import { JobOfferUser } from "./job-offer-user";
import { UserType } from "./user-type";

export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    summary: string;
    title: string;
    technicalSkills: string;
    location: string;
    experience: string;
    signInDate: Date;
    offers: JobOfferUser[]
    type: UserType;
}