import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../models/user";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { UserService } from "../../services/user.service";
import { UserType } from "../../models/user-type";
import { MessageService } from "primeng/api";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "app-login",
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  apiUrl = environment.apiBaseUrl;
  user = new User();
  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {}

  login() {
    this.http.post<User>(this.apiUrl + "/users/login", this.user).subscribe(
      (response) => {
        this.notificationService.showSuccess("You are now logged in!", this.messageService);
        this.userService.logUser(response);
        if (this.userService.user?.type === UserType.Recruiter) {
          this.router.navigate(["job-offers"]);
        } else {
          this.router.navigate(["profile"]);
        }
      },
      (error) => {
        this.notificationService.showError("Email or password incorrect", this.messageService);
      }
    );
  }

  redirectTocreateAccount() {
    this.router.navigate(["create"]);
  }
}
