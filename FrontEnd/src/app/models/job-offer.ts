import { JobOfferStatus } from "./job-offer-status";

export class JobOffer {
    id: number;
    title: string;
    description: string;
    status: JobOfferStatus;
    location: string;
    salary: string;
    experience: string;
    publishDate: Date;
}