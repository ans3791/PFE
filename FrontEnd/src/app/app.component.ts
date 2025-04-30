import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { UserService } from "./services/user.service";
import { UserType } from "./models/user-type";
import { Toast, ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";


@Component({
  selector: "app-root",
  imports: [RouterOutlet, CommonModule, Toast, ToastModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [MessageService],
})
export class AppComponent {
  dropdownOpen = false;
  UserType = UserType;

  constructor(private router: Router, public userService: UserService) {}

  redirectToLogin() {
    this.router.navigate(["login"]);
  }
  redirectToAbout() {
    this.router.navigate(["about-us"]);
  }
  redirectToSearch() {
    this.router.navigate(["search"]);
  }
  redirectTocreateAccount() {
    this.router.navigate(["create"]);
  }
  redirectToHome() {
    this.router.navigate(["home"]);
  }
  redirectToProfile() {
    this.router.navigate(["profile"]);
  }
  redirectToApplications() {
    this.router.navigate(["applications"]);
  }
  redirectToJobOffers() {
    this.router.navigate(["job-offers"]);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  signOut() {
    this.userService.logoutUser();
    this.dropdownOpen = false;
    this.redirectToLogin();
  }
}
