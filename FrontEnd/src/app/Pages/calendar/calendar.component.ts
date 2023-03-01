import { Component, OnInit } from '@angular/core';
import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import { HttpClient } from "@angular/common/http";
import { FunctionalRequirementService } from 'src/app/Services/functional-requirement.service';
import { project } from 'src/app/models/project';
import { ProjectService } from 'src/app/Services/project.service';
import { VersionService } from '../../Services/version.service';
import { version } from 'src/app/models/version';

defineFullCalendarElement();

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css',
  '../../../assets/css/bootstrap.min.css',
  '../../../assets/font-awesome/css/font-awesome.css',
  '../../../assets/css/animate.css',
  '../../../assets/css/style.css']
})
export class CalendarComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private versionService : VersionService,
    private FRService : FunctionalRequirementService, 
    private projectService : ProjectService
  ) {}

  events: any = [];
  meetings: any = [];
  projects : project[];
  selectedProjectId : number;
  versions : version[];
  selectedVersionId : number;
  idProductOwner : number;
  frs : any = [];

  modalVisibility : boolean = true;
  filterVisibility: boolean = true;
  FrTitle: string = "";
  FrDescription : string = "";
	FrAuthor : string  = "";

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
  };

  handleEventClick(event: any){
    this.FrTitle = event.event._def.title;
    this.FrAuthor = event.event._def.extendedProps.author;
		this.FrDescription = event.event._def.extendedProps.description;
    this.modalVisibility = false;
  }

  ngOnInit(): void {
    this.idProductOwner = JSON.parse(localStorage.getItem('memberId')); 
    this.projectService.getProjectsByProductOwner(this.idProductOwner).subscribe(data => {
      this.projects = data;
    });
    
  }

  onChangeProject() {
    this.versionService.getAllVersions(this.selectedProjectId).subscribe(data => {
      this.versions = <version[]>data;
    });
  }

  onChangeVersion() {
    this.filterVisibility = false;
    this.FRService.getCalendarFunctionalRequirement(this.selectedVersionId)
      .subscribe((res: any) => {
        this.events = [];
        for(let event of res){
          //The below "if" treatment will be fixed by modifying the date format in the API response
          if(event.start.length == 9){
            event.start = event.start.substring(0, 5) + "0" + event.start.substring(5, 10);
            console.log(event.start);
          }
          let eventObj = {
            title: event.title,
            description: event.description,
            color: "#1ab394",
            date: event.start,
            author: event.author
          }
          this.events.push(eventObj);
        }
        this.calendarOptions = {
          plugins: [dayGridPlugin],
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
          },
          weekends: true,
          editable: true,
          selectable: true,
          selectMirror: true,
          dayMaxEvents: true,
          droppable: true,
          events: this.events,
          eventClick: this.handleEventClick.bind(this),
          buttonText: {
              today:    'Today',
              month:    'Month',
              week:     'Week',
              day:      'Day',
              list:     'List'
          },
          height: 650,
          handleWindowResize: true,
          expandRows: true,
        };
      }
    );
  }

}
