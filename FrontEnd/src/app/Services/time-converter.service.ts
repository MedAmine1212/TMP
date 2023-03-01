import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeConverterService {

  constructor() { }

  full:boolean = false;

  padTo2Digits(num:number) {
    return num.toString().padStart(2, '0');
  }
  getWeeks(time:number) {
    return Math.trunc(time/60/8/5);
  }

  getDays(time: number) {
    return Math.trunc(time/60/8%5);
  }

  getHours(time: number) {
    return Math.trunc(time/60%8);
  }

  getMinutes(time: number) {
    return Math.trunc(time%60);
  }

  getStringTime(minutes: number) {
    let hours =this.getHours(minutes);
    let days = this.getDays(minutes);
    let weeks =this.getWeeks(minutes);
    minutes = this.getMinutes(minutes);
    let time = '';
    let yesWeek = weeks != 0 || this.full;
    let yesDay = days != 0 || (yesWeek && hours !=0) || this.full;
    let yesHours = hours != 0 || (yesDay && minutes != 0) || this.full;
    let yesMinutes = minutes !=0 || this.full;

    if(yesWeek)
      time+=weeks+"W";
    if(yesWeek && yesDay)
      time+=":";
    if(yesDay)
      time+=days+"D";
    if(yesDay && yesHours)
      time+=":";
    if(yesHours)
      time+=hours+"H";
    if(yesHours && yesMinutes)
      time+=":";
    if(yesMinutes)
      time+=minutes+"M";
    this.full = false;
    return time;
  }

  getFullStringTime(minutes: number) {
    this.full = true;
    return this.getStringTime(minutes);
  }
}
