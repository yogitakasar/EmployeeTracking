import { Injectable } from '@angular/core';
import { Employee } from '../model/employee';
import { openDB, IDBPDatabase } from 'idb';


@Injectable({
  providedIn: 'root'
})
export class EmployeeDbService {

  private db: Promise<IDBPDatabase>;

  constructor() {
    this.db = openDB('EmployeeDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id' });
        }
      },
    });
  }

  // Add or update employee in IndexedDB
  async saveEmployee(employee: Employee) {
    const db = await this.db;
    await db.put('employees', employee);
    console.log("in save");

  }
   // Get all employees from IndexedDB
   async getEmployees(): Promise<Employee[]> {
    const db = await this.db;
    return db.getAll('employees');
  }
  async getEmployeeById(employeeId: string): Promise<Employee | undefined> {
    const db = await this.db;
    return db.get('employees', employeeId);
  }

  // Delete employee from IndexedDB
  async deleteEmployee(employeeId: string) {
    const db = await this.db;
    await db.delete('employees', employeeId);
  }
}
