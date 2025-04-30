import { JobOffer } from "./job-offer";
import { JobOfferUserStatus } from "./job-offer-user-status";
import { User } from "./user";

export class Application {
    job: JobOffer;
    user: User;
    dateApplication: Date;
    status: JobOfferUserStatus;
}