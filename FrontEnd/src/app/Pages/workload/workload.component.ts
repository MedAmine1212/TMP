import { Component, OnInit } from '@angular/core';
import {ScrumTeam} from "../../models/ScrumTeam";
import {ScrumTeamService} from "../../Services/scrum-team.service";
import {TimeConverterService} from "../../Services/time-converter.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {ExtractDateTypeFromSelection, MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DateRange} from "@fullcalendar/core";

@Component({
  selector: 'app-workload',
  templateUrl: './workload.component.html',
  styleUrls: ['./workload.component.css'],
  animations: [
    trigger('animSlider', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 }))
      ]),
     ]),
    trigger('inputSlider', [
      transition(':enter',  [style({ width: '0' }), animate('.2s ease-out', style({ width:'80%' }))]),
      transition(':leave',  [style({ width: '80%' }), animate('.2s ease-out', style({ width:'0' }))]),
    ]),

  ]
})
export class WorkloadComponent implements OnInit {
  selectedTeam!: ScrumTeam;
  allTeams: ScrumTeam[] = [];
  loading: boolean = true;
  displayList: ScrumTeam[] = [];
  showSearch: boolean = false;
  search: string = "";
  startDate: string = "";
  endDate: string = "";
  startInput: string = "";
  endInput: string = "";

  constructor(private timeConverter: TimeConverterService, private scrumTeamServ: ScrumTeamService) {
  }

  ngOnInit(): void {
    this.scrumTeamServ.getAllScrumTeams().subscribe((r: any) => {
      this.allTeams = r;
      this.displayList = r;
      this.loading = false;
    })
  }

  getTimeString(minutes: number) {
    return this.timeConverter.getFullStringTime(minutes);
  }

  focus() {
    this.search = '';
    setTimeout(() => {
      document.getElementById("searchInput").focus();
    }, 10)
  }


  startDateChanged(event: MatDatepickerInputEvent<ExtractDateTypeFromSelection<DateRange>, DateRange>) {
    this.startDate = event.value.toLocaleString().substring(0, event.value.toLocaleString().indexOf(","));
  }

  endDateChanged(event: MatDatepickerInputEvent<ExtractDateTypeFromSelection<DateRange>, DateRange>) {
    this.endDate = event.value.toLocaleString().substring(0, event.value.toLocaleString().indexOf(","));
    this.loading = true;
    this.updateTeamsList().then(() => {
      setTimeout(() => {
        this.loading = false;
      }, 10);
    });
  }

  async updateTeamsList() {
    this.displayList = [];
    for (let team of this.allTeams)
      if (Date.parse(team.creationDate) >= Date.parse(this.startDate) && Date.parse(team.creationDate) <= Date.parse(this.endDate))
        this.displayList.push(team);
  }

  clearRange() {
    this.loading = true;
    this.startDate = "";
    this.startInput = "";
    this.endInput = "";
    this.endDate = "";
    this.displayList = this.allTeams;
    setTimeout(() => {
      this.loading = false;
    }, 10);
  }
}
