import { JobOfferUserStatus } from "./job-offer-user-status";

export class JobOfferUser {
    title: string;
    description: string;
    status: JobOfferUserStatus;
    dateApplication: Date;
}