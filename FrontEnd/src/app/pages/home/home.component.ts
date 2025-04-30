import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { JobOffer } from "../../models/job-offer";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { NotificationService } from "../../services/notification.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-home",
  imports: [ButtonModule, CommonModule, HttpClientModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  apiUrl = environment.apiBaseUrl;
  jobOffers: JobOffer[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.http.get<JobOffer[]>(this.apiUrl + "/joboffers/4").subscribe(
      (response) => {
        this.jobOffers = response;
      },
      (error) => {
        this.notificationService.showError("Error occured, please try again later!", this.messageService);
      }
    );
  }

  apply(id: number) {
    if (this.userService.isLogged) {
      this.http.post(this.apiUrl + `/joboffers/apply/${id}/${this.userService.user?.id}`, null).subscribe(
        () => {
          this.notificationService.showSuccess("Your application is successfully sent!", this.messageService);
          this.router.navigate(["profile"]);
        },
        (error) => {
          this.notificationService.showError("Error occured, please try again later!", this.messageService);
        }
      );
    } else {
      this.router.navigate(["login"]);
    }
  }

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
  redirectToJob() {
    this.router.navigate(["job"]);
  }
}
