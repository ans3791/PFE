import { Component } from '@angular/core';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './createAccount.component.html',
  styleUrl: './createAccount.component.css',
})
export class createAccountComponent {
  user: User = new User();
  cvFile: File;
  confirmPassword: string;
  checkbox: boolean;
  apiUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {}

  createAccount() {
    if (this.user.password !== this.confirmPassword) {
      this.notificationService.showWarning("Passwords don't match!", this.messageService)
      return;
    }
    const formData = new FormData();
    formData.append('cvFile', this.cvFile, this.cvFile.name);
    formData.append('firstName', this.user.firstName);
    formData.append('lastName', this.user.lastName);
    formData.append('email', this.user.email);
    formData.append('phoneNumber', this.user.phoneNumber);
    formData.append('password', this.user.password);
    formData.append('summary', this.user.summary);
    formData.append('title', this.user.title);
    formData.append('technicalSkills', this.user.technicalSkills);
    formData.append('location', this.user.location);
    formData.append('experience', this.user.experience);

    this.http.post(this.apiUrl + '/users/create-account', formData).subscribe(
      (response) => {
        this.notificationService.showSuccess("Account created! please log in.", this.messageService)
        this.router.navigate(['login']);
      },
      (error) => {
        this.notificationService.showError("Error occured, please try again later!", this.messageService)
      }
    );
  }

  onFileChange(event: any) {
    this.cvFile = event.target.files[0];
  }
}
