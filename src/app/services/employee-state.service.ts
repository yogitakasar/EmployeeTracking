import { Injectable, signal } from '@angular/core';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeStateService {

    // Signal to manage employee list
    employees = signal<Employee[]>([]);

    // Add a new employee
    addEmployee(employee: Employee) {
      const current = this.employees();
      this.employees.set([...current, employee]);
    }

    // Edit an existingg employee
    editEmployee(updatedEmployee: Employee) {
      const current = this.employees();
      this.employees.set(
        current.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
      );
    }

    // Delete employee
    deleteEmployee(employeeId: string) {
      const current = this.employees();
      this.employees.set(current.filter(emp => emp.id !== employeeId));
    }


    //set employee from local db to state
    setEmployees(employees: Employee[]) {
      this.employees.set(employees);
    }
}
