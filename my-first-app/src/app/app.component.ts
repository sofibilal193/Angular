import { Component } from '@angular/core';
import { RegisterComponent } from './Components/Auth/register/register.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from "./Components/Auth/login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
   styleUrl: './app.component.css',
   imports: [RegisterComponent, LoginComponent]
})
export class AppComponent {
  title = 'my-first-app';
}
