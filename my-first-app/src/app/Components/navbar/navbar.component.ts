import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/Auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [NgIf],
})
export class NavBarComponent implements OnInit {
  loggedInUser: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
  }

  logout(): void {
    this.authService.logout();
  }
}
