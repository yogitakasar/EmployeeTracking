import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'employee-list',
    pathMatch: 'full'
  },
  {
    path: 'employee-list',
    component:EmployeeListComponent
  },
  {
    path: 'add-employee',
    component:EmployeeFormComponent
  },
  {
    path: 'edit-employee/:id',
    component:EmployeeFormComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
