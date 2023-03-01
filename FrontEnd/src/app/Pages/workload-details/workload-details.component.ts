import {Component, Input, OnInit} from '@angular/core';
import {TimeConverterService} from "../../Services/time-converter.service";
import {ScrumTeam} from "../../models/ScrumTeam";
import {WorkloadComponent} from "../workload/workload.component";
import {animate, style, transition, trigger} from "@angular/animations";
import {JoinTeam} from "../../models/JoinTeam";
import {ExtractDateTypeFromSelection, MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DateRange} from "@fullcalendar/core";

@Component({
  selector: 'app-workload-details',
  templateUrl: './workload-details.component.html',
  styleUrls: ['./workload-details.component.css'],
  animations: [
    trigger('animSlider', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))]),
    ]),
    trigger('inputSlider', [
      transition(':enter',  [style({ width: '0' }), animate('.2s ease-out', style({ width:'40%' }))]),
      transition(':leave',  [style({ width: '40%' }), animate('.2s ease-out', style({ width:'0' }))]),
    ])
  ]
})
export class WorkloadDetailsComponent implements OnInit {

  @Input() selectedTeam!: ScrumTeam;
  @Input() parent!: WorkloadComponent;
  showSearch: boolean = false;
  search: string = "";
  displayList: JoinTeam[] = [];
  loading: boolean = true;
  startDate: string = "";
  startInput: string = "";
  endInput: string = "";
  endDate: string = "";
  constructor(private timeConverter: TimeConverterService) { }

  ngOnInit(): void {
    this.loadCols().then(()=>{
      setTimeout(()=>{
        this.loading = false;
      },10)
    });
  }

async loadCols(){
  let jts = this.selectedTeam.joinTeam;
  this.selectedTeam.joinTeam = [];
  for(let jt of jts) {
    if(jt.status == 1){
      this.selectedTeam.joinTeam.push(jt);
      this.displayList.push(jt);
    }
  }
}
getTimeString(workTime: number) {
  return this.timeConverter.getFullStringTime(workTime);
}

  focus() {
    this.search = '';
    setTimeout(()=>{
      document.getElementById("searchInput").focus();
    },10)
  }

  startDateChanged(event: MatDatepickerInputEvent<ExtractDateTypeFromSelection<DateRange>, DateRange>) {
    this.startDate = event.value.toLocaleString().substring(0, event.value.toLocaleString().indexOf(","));
  }

  endDateChanged(event: MatDatepickerInputEvent<ExtractDateTypeFromSelection<DateRange>, DateRange>) {
    this.endDate = event.value.toLocaleString().substring(0, event.value.toLocaleString().indexOf(","));
    this.loading = true;
    this.updateList().then(() => {
      setTimeout(() => {
        this.loading = false;
      }, 10);
    });
  }

  async updateList() {
    this.displayList = [];
    for (let jt of this.selectedTeam.joinTeam)
      if (Date.parse(jt.dateJoined) >= Date.parse(this.startDate) && Date.parse(jt.dateJoined) <= Date.parse(this.endDate))
        this.displayList.push(jt);
  }

  clearRange() {
    this.loading = true;
    this.startDate = "";
    this.startInput = "";
    this.endInput = "";
    this.endDate = "";
    this.displayList = this.selectedTeam.joinTeam;
    setTimeout(() => {
      this.loading = false;
    }, 10);
  }
}
