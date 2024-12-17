import { Employee } from 'src/app/model/employee';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeDbService } from 'src/app/services/employee-db.service';
import { EmployeeStateService } from 'src/app/services/employee-state.service';
import {
  MatSnackBar
} from '@angular/material/snack-bar'

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  private _snackBar = inject(MatSnackBar);
  employeeList : any = [];
  currentEmployees : any = [];
  previousEmployees : any = [];
  constructor(
    private router:Router,
    public state: EmployeeStateService,
    private db: EmployeeDbService,
    private snackBar: MatSnackBar
  ){
  }

  ngOnInit() {
    this.getEmployeeList();
  }
  async getEmployeeList(){
    this.employeeList = await this.db.getEmployees();
    console.log(this.employeeList);

    this.state.setEmployees(this.employeeList);
    this.currentEmployees = this.employeeList.filter((employee:any) => !employee.endDate);
    this.previousEmployees = this.employeeList.filter((employee:any) => employee.endDate);
  }

  gotoAddEmployee(){


    this.router.navigateByUrl('/add-employee')
  }
  editEmployee(employee:any){
    this.router.navigateByUrl(`/edit-employee/${employee.id}`);
  }
  openSnackBar() {
    this.snackBar.open('Employee data has been deleted', 'Undo', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // Position of the snackbar
      verticalPosition: 'bottom',
    });
    // snackBar.open('Message archived', 'Undo', {
    //   duration: 3000
    // });
  }

  showDeleteIcon(employeeId: string,id:number) {

    if(id==1){
      this.previousEmployees = this.previousEmployees.map((emp:any) =>
        emp.id === employeeId ? { ...emp, showDelete: true } : { ...emp, showDelete: false }
      );
    }else{
      this.currentEmployees = this.currentEmployees.map((emp:any) =>
        emp.id === employeeId ? { ...emp, showDelete: true } : { ...emp, showDelete: false }
      );
    }


  }
  // Hide delete icon on swipe right
  hideDeleteIcon(employeeId: string,id:number) {
    console.log("hide deete icon");
    if(id==1){
      this.previousEmployees = this.previousEmployees.map((emp:any) =>
        emp.id === employeeId ? { ...emp, showDelete: false } : emp
      );
    }else{
      this.currentEmployees = this.currentEmployees.map((emp:any) =>
        emp.id === employeeId ? { ...emp, showDelete: false } : emp
      );
    }

  }
  //Delete employee
  async deleteEmployee(employeeId: string) {
    this.state.deleteEmployee(employeeId); // Update state
    await this.db.deleteEmployee(employeeId); // Remove from IndexedDB
    this.getEmployeeList();
    this.openSnackBar();
  }
  // deleteEmployee(employeeId: string) {
  //   // this.employeeList = this.employeeList.filter(emp => emp.id !== employeeId);
  //   // console.log(`Deleted employee with ID: ${employeeId}`);
  // }

}
