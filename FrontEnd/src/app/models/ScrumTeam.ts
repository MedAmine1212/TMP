import {JoinTeam} from "./JoinTeam";

export class ScrumTeam{
    id!: number;
    name!:string;
    dateJoined!:string;
    creationDate!:string;
    project!:number | null;
    collapsed: boolean = false;
    joinTeam:JoinTeam [];
    role!:string;
}
