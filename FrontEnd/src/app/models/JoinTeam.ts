import {collaborator} from "./Collaborator";

export class JoinTeam{
  id!: number;
  role!:string;
  status!:number;
  dateJoined!:string;
  collaborator!:collaborator;
  workTime: number;
}
