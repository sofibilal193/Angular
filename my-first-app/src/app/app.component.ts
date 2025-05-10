import { Component } from '@angular/core';
import { RegisterComponent } from './Components/Auth/Register/register/register.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
   styleUrl: './app.component.css',
   imports: [RegisterComponent]
})
export class AppComponent {
  title = 'my-first-app';
}
