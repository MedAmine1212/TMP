import { functionalrequirement } from "./functionalrequirement";

export class column {
    constructor(public id : number, public name : string, public order : number, public tasks : functionalrequirement[]){}
}

export class kanbanBoard {
    constructor(public id, public name : string, public columns : column[]){}
}