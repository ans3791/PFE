import { Component } from "@angular/core";
import { environment } from "../../../environments/environment";
import { JobOffer } from "../../models/job-offer";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-search",
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.css",
})
export class SearchComponent {
  apiUrl = environment.apiBaseUrl;
  jobOffers: JobOffer[] = [];
  filtered: JobOffer[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.http.get<JobOffer[]>(this.apiUrl + "/joboffers").subscribe(
      (response) => {
        this.jobOffers = response;
        this.filtered = response;
      },
      (error) => {
        this.notificationService.showError("Error occured, please try again later!", this.messageService);
      }
    );
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filterOffers(target.value);
  }

  filterOffers(value: string) {
    if (!value) {
      this.filtered = this.jobOffers;
    } else {
      this.filtered = this.jobOffers.filter(
        (offer) =>
          offer.title.toLowerCase().includes(value.toLowerCase()) ||
          offer.description.toLowerCase().includes(value.toLowerCase()) ||
          offer.location.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  applyOffer(id: number) {
    this.http.post(this.apiUrl + `/joboffers/apply/${id}/${this.userService.user?.id}`, null).subscribe(
      () => {
        this.notificationService.showSuccess("Your application is successfully sent!", this.messageService);
        this.router.navigate(["profile"]);
      },
      (error) => {
        this.notificationService.showError("Error occured, please try again later!", this.messageService);
      }
    );
  }
}
