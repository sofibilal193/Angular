import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './Services/Auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserListComponent } from './components/auth/user/user-list/user-list.component';
import { NgIf } from '@angular/common';
import { NavBarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterModule, NavBarComponent],
})
export class AppComponent {
  title = 'my-first-app';
}
