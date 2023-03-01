import { Component, OnInit } from '@angular/core';
import { ScrumTeam } from '../../models/ScrumTeam';
import { project } from '../../models/project';
import { ScrumTeamService } from 'src/app/Services/scrum-team.service';
import { ProjectService } from 'src/app/Services/project.service';
import { flatMap } from 'rxjs';

@Component({
  selector: 'app-scrum-team',
  templateUrl: './scrum-team.component.html',
  styleUrls: ['./scrum-team.component.css',
  '../../../assets/css/bootstrap.min.css',
  '../../../assets/font-awesome/css/font-awesome.css',
  '../../../assets/css/animate.css',
  '../../../assets/css/style.css']
})
export class ScrumTeamComponent implements OnInit {

  ScrumTeams : ScrumTeam[];
  ScrumTeamsIDs : number[];
  projects : project[];
  scrumTeamTitle : string = "";
  isLoading : boolean = true;
  selectedProject : number;

  constructor(private ScrumTeamService : ScrumTeamService, private projectService : ProjectService) { }

  addTeamVisibility : boolean = true;
  showTeamInfo : boolean = true;
  modalVisibility : boolean = true;
  TeamClickedID : number | undefined;
  TeamClickedInfos : ScrumTeam | undefined;


  handleEventClick(){
    this.modalVisibility = false;
  }
  
  ngOnInit(): void {
    this.ScrumTeamService.getAllScrumTeams().subscribe(data => {
      this.ScrumTeams = data;
      this.isLoading = false;
    });
  }

  getProjectName(idScrumTeam : number) {
    return this.ScrumTeams.find(team => team.id == idScrumTeam)['working']['project']['0']['name'];
  }

  addScrumTeam() {
    let team = new ScrumTeam();
    team.name = this.scrumTeamTitle;
    this.ScrumTeamService.addScrumTeam(team).subscribe(data => {
      this.ScrumTeamService.getAllScrumTeams().subscribe(data => {
        this.ScrumTeams = data;
      });
    });
  }

  getTeamClickedInfos(idScrumTeam : number) {
    this.ScrumTeamService.getScrumTeamById(idScrumTeam).subscribe(data => {
      this.TeamClickedInfos = data;
      this.isLoading = false;
    });
  }

  getAllProject(){
    this.projectService.getProjects().subscribe(data => {
      this.projects = data; 
      this.selectedProject = this.projects[0].id;
    });
  }

  affectProjectToTeam(selectedTeam : number) {
    console.log(this.selectedProject);
    let obj = {idProject : this.selectedProject, idSCRUMTeam : selectedTeam};
    this.ScrumTeamService.affectProjectToTeam(obj).subscribe(data => {
      this.ScrumTeamService.getScrumTeamById(this.TeamClickedID).subscribe(data => {
        this.TeamClickedInfos = data;
      });
      this.ScrumTeamService.getAllScrumTeams().subscribe(data => {
        this.ScrumTeams = data;
      });
    });
    this.selectedProject = this.projects[0].id;
  }
}
