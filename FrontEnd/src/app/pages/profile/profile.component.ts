import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../../models/user";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { UserService } from "../../services/user.service";
import { CommonModule } from "@angular/common";
import { JobOfferUserStatus } from "../../models/job-offer-user-status";
import { ButtonModule } from "primeng/button";
import { UserType } from "../../models/user-type";
import { saveAs } from "file-saver";
import { NotificationService } from "../../services/notification.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-profile",
  imports: [HttpClientModule, CommonModule, ButtonModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {
  user: User = new User();
  skills: string[] = [];
  apiUrl = environment.apiBaseUrl;
  id: string;
  UserType = UserType;

  constructor(
    private router: Router,
    private http: HttpClient,
    public userService: UserService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {
    this.id = this.route.snapshot.paramMap.get("id") ?? "";
  }

  ngOnInit() {
    this.http
      .get<User>(this.apiUrl + "/users/profile/" + ((this.id as string) || (this.userService.user?.id as string)))
      .subscribe(
        (response) => {
          this.user = response;
          if (this.user?.technicalSkills) {
            this.skills = this.user.technicalSkills.split(",").map((s) => s.trim());
          }
        },
        (error) => {
          this.notificationService.showError("Error occured, please try again later!", this.messageService);
        }
      );
  }

  getStatusIcon(status: JobOfferUserStatus): string {
    switch (status) {
      case JobOfferUserStatus.Approved:
        return "✅";
      case JobOfferUserStatus.Rejected:
        return "❌";
      case JobOfferUserStatus.Planned:
        return "📅";
      case JobOfferUserStatus.Pending:
        return "⏳";
      default:
        return "❓";
    }
  }

  redirectToTracking() {
    this.router.navigate(["tracking"]);
  }

  generateCv() {
    this.http
      .post(`${this.apiUrl}/users/cv/${this.id}`, null, {
        responseType: "blob",
      })
      .subscribe({
        next: (blob: Blob) => {
          const fileName = `cv-${this.user.firstName}-${this.user.lastName}.pdf`;
          saveAs(blob, fileName);
        },
        error: (err) => {
          this.notificationService.showError("Error downloading the CV", this.messageService);
        },
      });
  }
}
