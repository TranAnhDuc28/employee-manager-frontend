import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './service/employee.service';
import { Employee } from './common/employee';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  employees: Employee[] = [];
  editEmployee?: Employee;
  deleteEmployee?: Employee;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmplyees().subscribe({
      next: data => {
        this.employees = data
        console.log(this.employees);
      },
      error: err => alert(err.message)
    });
  }


  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('btn-close-add-form')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: employee => {
        console.log(`Add employee: ` + JSON.stringify(employee));
        this.getEmployees();
        // resetForm() sử dụng trong Template-Driven Forms với NgForm để đặt lại toàn bộ form về trạng thái ban đầu.
        addForm.resetForm();
      },
      error: err => alert(err.message)
    });
  }


  public onUpdateEmployee(employee: Employee): void {
    document.getElementById('btn-close-update-form')?.click();
    this.employeeService.updateEmplyee(employee).subscribe({
      next: employee => {
        console.log(`Update employee: ` + JSON.stringify(employee));
        this.getEmployees();
      },
      error: err => alert(err.message)
    });

  }


  public onDeleteEmployee(employeeId?: number): void {
    document.getElementById('btn-close-delete-form')?.click();
    this.employeeService.deleteEmplyee(employeeId).subscribe({
      next: response => {
        console.log(response);
        this.getEmployees();
      },
      error: err => alert(err.message)
    });

  }


  public searchEmployee(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (let employee of this.employees) {
      if (employee.name?.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email?.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phone?.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle?.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    if(key.length === 0 || !key) {
      this.getEmployees();
    }
  }


  public onOpenModal(employee: Employee | undefined, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#addEmployeeModal');
    } else if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-bs-target', '#editEmployeeModal');
    } else if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-bs-target', '#deleteEmployeeModal');
    }

    container?.appendChild(button);
    button.click();
  }
}
