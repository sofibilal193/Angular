import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { AuthService } from '../../../../Services/auth.service';
import { Role } from '../../../../models/user';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  profilePhoto: string | null;
}

interface ApiResponse {
  items: User[];
  totalRecords: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [NgFor, FormsModule],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  page = 1;
  pageSize = 11;
  totalPages = 0;

  // Filters
  roles = Object.values(Role);
  roleFilter: string = '';

  // Sorting
  sortColumn: string = 'Id';
  search: string = '';
  sortDirection: string = '↓';

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    (await this.authService
      .GetUsers(
        this.page,
        this.pageSize,
        this.search,
        this.sortColumn,
        this.roleFilter,
        this.sortDirection
      ))
      .subscribe((response: ApiResponse) => {
        this.users = response.items;
        this.page = response.page;
        this.totalPages = response.totalPages;
      });
  }

  ApplyFilter(role: string) {
    this.roleFilter = role;
    this.loadUsers();
  }

  ApplySearch(searchTerm: string): void {
    this.page = 1;
    this.search = searchTerm;
    this.loadUsers();
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadUsers();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '↓';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }
}
