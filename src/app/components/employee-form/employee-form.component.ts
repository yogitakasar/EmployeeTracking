import { Employee } from 'src/app/model/employee';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Inject, OnDestroy, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeDbService } from 'src/app/services/employee-db.service';
import { EmployeeStateService } from 'src/app/services/employee-state.service';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, Subject, takeUntil } from 'rxjs';
import { MatCalendar, MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent {

  exampleHeader = ExampleHeader;
  employeeForm: FormGroup;
  employeeId :any;
  //selectedDate: Date | null = null;
  maxDate : Date = new Date();
  selectedDate:any

  onDateSelect(event: MatDatepickerInputEvent<Date>)
  {
this.selectedDate =  event.value
  }
  onDateHeaderChange(newDate: Date) {
    this.selectedDate = newDate;
    this.employeeForm.get('startDate')?.setValue(newDate);
  }



  constructor(private fb: FormBuilder,
    private state: EmployeeStateService,
    private db: EmployeeDbService,
    private router:Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params =>{
      this.employeeId = params['id'];
      if(this.employeeId)
        this.getEmployee();


    })

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
    });
  }
  async getEmployee(){
    let employee = await this.db.getEmployeeById(this.employeeId);
    this.employeeForm.patchValue({
      name:employee?.name,
      role:employee?.role,
      startDate: employee?.startDate,
      endDate: employee?.endDate

     })
  }
  onSave() {
    if (this.employeeForm.valid) {
      console.log(this.employeeForm.value);
    }
  }
  newEmployee: Employee = { id: '', name: '', startDate: '', role: '' };
  isEditMode = false;


  async ngOnInit() {
    const employees = await this.db.getEmployees();
    this.state.setEmployees(employees); // Initialize state with IndexedDB data
  }

  // Add new employee
  async addEmployee() {
    if (!this.employeeForm.value.name || !this.employeeForm.value.startDate || !this.employeeForm.value.role) return;
    const employee = { ...this.employeeForm.value, id: uuidv4() };

    this.state.addEmployee(employee); // Update state
    await this.db.saveEmployee(employee); // Persist to IndexedDB
    this.employeeForm.reset()
  }

  submit(){
    if (this.employeeForm.valid) {
     this.employeeId?this.saveEdit():this.addEmployee();
     this.router.navigateByUrl('/employee-list')

    }
  }

   // Save edited employee
  async saveEdit() {
    if (!this.employeeForm.value.name || !this.employeeForm.value.startDate || !this.employeeForm.value.role) return;
    const employee = { ...this.employeeForm.value, id:this.employeeId };
    this.state.editEmployee(employee); // Update state
    await this.db.saveEmployee(employee); // Persist to IndexedDB
  }

  onCancel() {
    this.employeeForm.reset();
    this.router.navigateByUrl('/employee-list')
  }
  setNextMonday() {
    this.selectedDate = this.getNextWeekday(1); // Monday
  }

  // Set the date to the next Tuesday
  setNextTuesday() {
    this.selectedDate = this.getNextWeekday(2); // Tuesday
  }

  // Helper to calculate the next weekday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  private getNextWeekday(dayOfWeek: number): Date {
    const today = new Date();
    const diff = (dayOfWeek - today.getDay() + 7) % 7 || 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff);
    return nextDate;
  }

  // Save action
  onSaveDate() {
    console.log('Selected Date:', this.selectedDate);
    alert(`Date saved: ${this.selectedDate}`);
  }
  async deleteEmployee() {
    this.state.deleteEmployee(this.employeeId); // Update state
    await this.db.deleteEmployee(this.employeeId); // Remove from IndexedDB
    this.router.navigateByUrl('/employee-list');
  }
}




@Component({
  selector: 'example-header',
  styleUrls: ['./employee-form.component.scss'],
  template: `
  <div class="example-button-header">
  <button mat-stroked-button color="accent" class="button-accent headerButton"  (click)="setToday()">
       Today
      </button>
      <button mat-stroked-button color="accent" class="button-accent headerButton"  (click)="setNextMonday()">
       Next Monday
      </button>
  </div>
  <div class="example-button-header">
  <button mat-stroked-button color="accent" class="button-accent headerButton"  (click)="setNextTuesday()">
       Next Tuesday
      </button>
      <button mat-stroked-button color="accent" class="button-accent headerButton"  (click)="setAfterOneWeek()">
       After 1 Week
      </button>
  </div>
    <div class="example-header">
    <!--  -->
      <button mat-icon-button (click)="previousClicked('month')">
        <mat-icon>arrow_left</mat-icon>
      </button>
      <span class="example-header-label">{{periodLabel()}}</span>
      <button mat-icon-button (click)="nextClicked('month')">
        <mat-icon>arrow_right</mat-icon>
      </button>



    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ExampleHeader<D> implements OnDestroy {
  private _calendar = inject<MatCalendar<D>>(MatCalendar);
  private _dateAdapter = inject<DateAdapter<D>>(DateAdapter);
  private _dateFormats = inject(MAT_DATE_FORMATS);
  @Output() dateChange = new EventEmitter<D>();


  private _destroyed = new Subject<void>();

  readonly periodLabel = signal('');

  constructor() {
    this._calendar.stateChanges.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
      this.periodLabel.set(
        this._dateAdapter
          .format(this._calendar.activeDate, this._dateFormats.display.monthYearA11yLabel)
          .toLocaleUpperCase(),
      );
    });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }
  setToday() {
    const today = this._dateAdapter.today();
    this._calendar.activeDate = today;
 //   this.dateChange.emit(today); // Emit the new date
  }
  setNextMonday() {
    const today = this._dateAdapter.today();
    const dayOfWeek = this._dateAdapter.getDayOfWeek(today);
    const daysUntilMonday = (1 - dayOfWeek + 7) % 7 || 7; // Calculate days until next Monday
    this._calendar.activeDate = this._dateAdapter.addCalendarDays(today, daysUntilMonday);
  }
  setNextTuesday() {
    const today = this._dateAdapter.today();
    const dayOfWeek = this._dateAdapter.getDayOfWeek(today);
    const daysUntilTuesday = (2 - dayOfWeek + 7) % 7 || 7; // Calculate days until next Tuesday
    this._calendar.activeDate = this._dateAdapter.addCalendarDays(today, daysUntilTuesday);
  }
  setAfterOneWeek() {
    const today = this._dateAdapter.today();
    this._calendar.activeDate = this._dateAdapter.addCalendarDays(today, 7);
  }



}

