import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { JobOffer } from "../../models/job-offer";
import { environment } from "../../../environments/environment";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { Tooltip } from "primeng/tooltip";
import { JobOfferStatus } from "../../models/job-offer-status";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "app-job-offers",
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    DialogModule,
    ButtonModule,
    InputText,
    Tooltip,
    ConfirmDialogModule,
  ],
  templateUrl: "./job-offers.component.html",
  styleUrl: "./job-offers.component.css",
  providers: [ConfirmationService],
})
export class JobOffersComponent {
  apiUrl = environment.apiBaseUrl;
  jobOffers: JobOffer[] = [];
  isDialogOpen = false;
  newJobOffer: JobOffer = new JobOffer();
  copyJobOffer: JobOffer = new JobOffer();
  isUpdate = false;

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getJobOffers();
  }

  getJobOffers() {
    this.http.get<JobOffer[]>(this.apiUrl + "/joboffers").subscribe(
      (response) => {
        this.jobOffers = response;
      },
      (error) => {
        this.notificationService.showError("Error occured, please try again later!", this.messageService);
      }
    );
  }

  openNewOffer() {
    this.isDialogOpen = true;
  }

  hideNewJobOfferDialog() {
    this.isDialogOpen = false;
    this.newJobOffer = new JobOffer();
    if (this.isUpdate) {
      var index = this.jobOffers.findIndex((b) => b.id === this.copyJobOffer.id);
      this.jobOffers[index] = this.copyJobOffer;
    }
    this.isUpdate = false;
  }

  isNewJobOfferValid() {
    return (
      this.newJobOffer.title &&
      this.newJobOffer.description &&
      this.newJobOffer.location &&
      this.newJobOffer.salary &&
      this.newJobOffer.experience
    );
  }

  sendNewOffer() {
    if (this.isUpdate) {
      this.http.put(this.apiUrl + `/joboffers/${this.newJobOffer.id}`, this.newJobOffer).subscribe(
        (response) => {
          this.notificationService.showSuccess("Job offer is successfully updated!", this.messageService);
          this.getJobOffers();
          this.hideNewJobOfferDialog();
          this.isUpdate = false;
        },
        (error) => {
          this.notificationService.showError("Error occured, please try again later!", this.messageService);
        }
      );
    } else {
      this.http.post(this.apiUrl + "/joboffers", this.newJobOffer).subscribe(
        (response) => {
          this.notificationService.showSuccess("Job offer is successfully created!", this.messageService);
          this.getJobOffers();
          this.hideNewJobOfferDialog();
        },
        (error) => {
          this.notificationService.showError("Error occured, please try again later!", this.messageService);
        }
      );
    }
  }

  getStatusLabel(status: JobOfferStatus): string {
    switch (status) {
      case JobOfferStatus.Active:
        return "Active";
      case JobOfferStatus.Closed:
        return "Closed";
      default:
        return "Unknown";
    }
  }

  updateJobOffer(jobOffer: JobOffer) {
    this.newJobOffer = jobOffer;
    this.copyJobOffer = JSON.parse(JSON.stringify(jobOffer));
    this.isUpdate = true;
    this.isDialogOpen = true;
  }

  showDialogRemoveJobOffer(jobOffer: JobOffer) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this job offer? This job will be deleted permanently",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Yes",
      rejectLabel: "No",
      accept: () => {
        this.http.delete(this.apiUrl + `/joboffers/${jobOffer.id}`).subscribe(
          (response) => {
            this.notificationService.showInfo("Job offer is successfully deleted!", this.messageService);
            this.jobOffers = this.jobOffers.filter((j) => j.id !== jobOffer.id);
          },
          (error) => {
            this.notificationService.showError("Error occured, please try again later!", this.messageService);
          }
        );
      },
    });
  }
}
