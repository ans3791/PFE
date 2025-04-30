import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { Application } from "../../models/application";
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";
import { JobOfferUserStatus } from "../../models/job-offer-user-status";
import { NotificationService } from "../../services/notification.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-applications",
  imports: [CommonModule, HttpClientModule],
  templateUrl: "./applications.component.html",
  styleUrl: "./applications.component.css",
})
export class ApplicationsComponent {
  apiUrl = environment.apiBaseUrl;
  applications: Application[] = [];
  JobOfferUserStatus = JobOfferUserStatus;

  constructor(
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.http.get<Application[]>(this.apiUrl + "/joboffers/applications").subscribe(
      (response) => {
        this.applications = response;
      },
      (error) => {
        this.notificationService.showError("Error occured, please try again later!", this.messageService);
      }
    );
  }

  getStatusLabel(status: JobOfferUserStatus): string {
    switch (status) {
      case JobOfferUserStatus.Pending:
        return "Pending";
      case JobOfferUserStatus.Planned:
        return "Planned";
      case JobOfferUserStatus.Approved:
        return "Approved";
      case JobOfferUserStatus.Rejected:
        return "Rejected";
      default:
        return "Unknown";
    }
  }

  updateStatus(application: any, newStatus: JobOfferUserStatus): void {
    this.http.post(this.apiUrl + `/joboffers/applications/${application.id}/${newStatus}`, null).subscribe(
      (response) => {
        this.notificationService.showSuccess("The application is successfully updated!", this.messageService);
        application.status = newStatus;
      },
      (error) => {
        this.notificationService.showError("Error occured, please try again later!", this.messageService);
      }
    );
  }

  viewProfile(id: string) {
    this.router.navigate(["profile", id]);
  }
}
