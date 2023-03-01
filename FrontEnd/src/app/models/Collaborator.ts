import { ScrumTeam } from "./ScrumTeam";

export class collaborator {
    id!: number;
    firstName!: string;
    lastName!: string;
    phone!: string;
    email!: string;
    password!: string;
    status!: number;
    invitationToken!: string
    memberType!: number;
    picture!: string;
    team!: ScrumTeam;
    role!: string;
    creactionDate!: string;
    fullName!: string;
}
