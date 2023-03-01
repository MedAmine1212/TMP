import {collaborator} from "./Collaborator";

export class functionalrequirement{
    id!: number;
    version!: string;
    author!:any;
    responsible!:any;
    estimationTime!:number;
    elapsedTime!:number;
    status!:number;
    statusKanban!:number;
    parentId!: string;
    title!: string;
    description!: string;
    collapsed!: boolean;
    functional_requirements!: functionalrequirement[];
    creationDate!:string;
}
