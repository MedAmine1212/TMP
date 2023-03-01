import { Component, OnInit } from '@angular/core';
import { kanbanBoard, column } from '../../models/kanbanboard.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { KanbanColumnService } from '../../Services/kanban-column.service';
import { project } from 'src/app/models/project';
import { ProjectService } from 'src/app/Services/project.service';
import { VersionService } from '../../Services/version.service';
import { version } from 'src/app/models/version';
import { functionalrequirement } from 'src/app/models/functionalrequirement';
import { FunctionalRequirementService } from 'src/app/Services/functional-requirement.service';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css',
  '../../../assets/css/bootstrap.min.css',
  '../../../assets/css/plugins/summernote/summernote-bs4.css',
  '../../../assets/font-awesome/css/font-awesome.css',
  '../../../assets/css/plugins/datapicker/datepicker3.css',
  '../../../assets/css/animate.css',
  '../../../assets/css/style.css']
})
export class KanbanBoardComponent implements OnInit {

  Events: any = [];
  isLoading: boolean = false;
  board : kanbanBoard = new kanbanBoard(1, "kanaban", []);
  modalVisibility : boolean = true;
  UpdateColumnVisibility : boolean = true;
  idColumn! : number; 
  columnTitle : string = "";
  projects : project[];
  selectedProjectId : number;
  versions : version[];
  selectedVersionId : number;
  idProductOwner : number;
  FunctionalReq : functionalrequirement[];
  idColumnDropedIn : number;

  constructor(private kanbanColumnService : KanbanColumnService, 
    private projectService : ProjectService, 
    private versionService : VersionService,
    private FRService : FunctionalRequirementService) {}

  ngOnInit(): void {
    this.idProductOwner = JSON.parse(localStorage.getItem('memberId')); 
    this.projectService.getProjectsByProductOwner(this.idProductOwner).subscribe(data => {
      this.projects = data;
    });
  }
  onChangeProject(newVal) {
    this.versionService.getAllVersions(this.selectedProjectId).subscribe(data => {
      this.versions = <version[]>data;
    });
  }

  onChangeVersion(newVal) {
    this.isLoading = true;
    this.kanbanColumnService.getColumnsByKanbanId(this.board.id).subscribe(
      (data) => {
        this.board.columns = data;
        setTimeout(()=>{
          this.isLoading = false;
        },2000);
      });
    this.FRService.getFunctionalRequirements(this.selectedVersionId).subscribe(data => {
      this.FunctionalReq = data;
      this.board.columns.forEach(c => {
        c.tasks = [];
      });
      this.fillColumnsByFR(this.FunctionalReq);
    });
  }

  drop(event: CdkDragDrop<string[]>, idColumn) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      let body = {statusKanban : idColumn};
      let idFRDroped = event.container.data[event.currentIndex]['id'];
      this.FRService.updateStatusKanban(body, idFRDroped).subscribe(
        data => {
          console.log(data)
        }
      );
    }
  }

  fillColumnsByFR(listOfFR : functionalrequirement[]){
    listOfFR.forEach(FR => {
      let column = this.board.columns.find(c => c.order == FR.statusKanban);
      column.tasks.push(FR);
      if(FR.functional_requirements.length != 0) {
        this.fillColumnsByFR(FR.functional_requirements);
      }
    });
  }

  public deleteColumn(columnId : number){
    this.kanbanColumnService.deleteColumn(columnId).subscribe({
      next : data => {
        this.board.columns = data;
      }
  });
  }

  handleEventClick(event: any) {
    this.modalVisibility = false;
  }

  addColumn(){
    this.kanbanColumnService.addColumn(this.board.id, {
      name : this.columnTitle,
      order : this.board.columns.length + 1
    }).subscribe(
      data => {
        this.board.columns.push(data);
      });
      this.columnTitle = "";
  }

  updateColumn() {
    this.kanbanColumnService.updateColumnName(this.idColumn, {name : this.columnTitle})
    .subscribe({
      next: (data) => {
        this.board.columns.forEach(column => {
          if(column.id === this.idColumn) {
            column.name = this.columnTitle;
            this.columnTitle ="";
            this.idColumn = -1;
          }
        })
      },
      error: (err) => {
        console.log(err);
      }
  });
  }
}
