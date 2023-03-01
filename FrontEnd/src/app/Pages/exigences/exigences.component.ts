import {ChangeDetectorRef, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FunctionalRequirementService } from 'src/app/Services/functional-requirement.service';
import { VersionService } from 'src/app/Services/version.service';
import {functionalrequirement} from "../../models/functionalrequirement";
import {coerceStringArray} from "@angular/cdk/coercion";
import { OnChanges } from '@angular/core';
@Component({
  selector: 'app-exigences',
  templateUrl: './exigences.component.html',
  styleUrls: ['./exigences.component.css',
    '../../../assets/css/bootstrap.min.css',
    '../../../assets/font-awesome/css/font-awesome.css',
    '../../../assets/css/animate.css',
    '../../../assets/css/style.css'
  ]
})

export class ExigencesComponent implements OnInit,OnChanges {

  @Input() version !: number  /*2 pour tester*/;

  affController: boolean = true;
  reductionController: boolean = true;
  sectionTitle: string = "Exigences Fonctionnelles";
  panelName: string = "Exigences Fonctionnelles";
  buttonName: string = "Tâches";
  Visibilite: boolean = true;
  title: string = "";
  output: string = "";
  isLoading: boolean = true;
  hirearchy:any[][] = [];
  exigences!: functionalrequirement[];
  exigencesToAdd: any = [];
  exigencesToDel : Array<number> = [];
  exigencesToModify: any = [];
  hiarUpdate: any = [];
  struct:any = '';
  public static instance;
  private parent!: functionalrequirement;
  private oldStruct: any;
  public updateOutput: any;


  constructor(private http: HttpClient, private FRS: FunctionalRequirementService, private VS: VersionService) { }

  ngOnInit(): void {
    ExigencesComponent.instance = this;
    this.isLoading = true ;
    this.loadFr().then(()=>{
      setTimeout(()=>{
        this.isLoading = false;
      },1000);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
  }
  async loadFr() {
    this.FRS.getFunctionalRequirements(this.version).subscribe(data => {
      this.exigences = [];
      this.exigences = data;
      this.hirearchy = [];
      for(let ex of this.exigences) {
        this.getHierarchy(ex, 1, "");
      }
      //Inspinia jQuery function that updates the serialized output
      this.updateOutput = (e: any) => {
        var list = e.length ? e : $(e.target),
          output = list.data('output');
        output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
      };
    }, error => console.log(error));
  }
  getHierarchy(ex:functionalrequirement, level, parents) {
    if(ex.functional_requirements.length > 0) {
      this.hirearchy.push([ex.id, level,true,parents]);
      if(parents !="") {
        parents+=".";
      }
      for (let ex1 of ex.functional_requirements) {

        this.getHierarchy(ex1, level+1,parents+ex.id);
      }
    } else {
      this.hirearchy.push([ex.id, level,false,parents]);
    }
  }

  toggleShow(){
    this.affController = !this.affController;

    if(this.panelName == "Tâches"){
      this.panelName = "Exigences Fonctionelles";
    }
    else{
      this.panelName = "Tâches";
    }

    if(this.buttonName == "Tâches"){
      this.buttonName = "Exigences";
    }
    else{
      this.buttonName = "Tâches";
    }

    if(this.sectionTitle == "Exigences Fonctionnelles"){
      this.sectionTitle = "Tâches";
    }
    else {
      this.sectionTitle = "Exigences Fonctionnelles";
    }

  }

  toggleReduction(){
    this.allCollapsed = !this.allCollapsed;
    this.reductionController = !this.reductionController;
  }

  ajoutVisibilite(ex:any){
    this.parent = ex;
    this.Visibilite=false;
    setTimeout(()=>{
      // @ts-ignore
      document.getElementById('ajout-input').focus();
    },10);
  }

  annuler(){
    this.Visibilite=true;
    this.title = "";
  }

  ajouter(){
    let ex = new functionalrequirement();
    ex.title = this.title;
    ex.functional_requirements = [];
    ex.author = 1;
    if(this.parent != null) {
      this.parent.functional_requirements.push(ex);
      ex.parentId = this.parent.id + "";
    } else {
      this.exigences.push(ex);
      // @ts-ignore
      ex.parentId = null;
    }
    ex.version = this.version+"";
    this.exigencesToAdd.push(ex);
    this.Visibilite=true;
    this.title = "";
    (<HTMLInputElement>document.getElementById("ajout-input")).value = "";
    // @ts-ignore
    document.querySelector('.confirm-btn').setAttribute("style", "display: inline-block");
    // @ts-ignore
    document.querySelector('.cancel-btn').setAttribute("style", "display: inline-block");
  }

  modifier(e: any, ex: functionalrequirement){
    e.target.parentElement.parentElement.querySelector('.span-modif-input').setAttribute("style", "display: block");
    e.target.parentElement.parentElement.querySelector('.span-modif-input input').value = ex.title;
  }

  confirmerModif(e: any, ex: functionalrequirement){
    e.target.parentElement.parentElement.querySelector('.span-modif-input').setAttribute("style", "display: none");
    let newDesc = e.target.parentElement.parentElement.querySelector('.span-modif-input input').value;
    //modification dans this.exigences
    ex.title = newDesc;
    this.exigencesToModify.push({
      "id": ex.id,
      "title": newDesc
    });

    // @ts-ignore
    document.querySelector('.confirm-btn').setAttribute("style", "display: inline-block");
    // @ts-ignore
    document.querySelector('.cancel-btn').setAttribute("style", "display: inline-block");
  }

  annulerModif(e: any){
    e.target.parentElement.parentElement.querySelector('.span-modif-input').setAttribute("style", "display: none");
  }

  handleConfirm(){
    //handling the confirm functional requirements changes button click
    let output = (<HTMLInputElement>document.getElementById('nestable-output')).value;
    //API call : adding new functional requirements
    if(this.exigencesToAdd.length > 0){
      this.FRS.postMultipleFunctionalRequirements(this.version, this.exigencesToAdd).subscribe(()=>{
        setTimeout(()=>{
          // @ts-ignore
          $('#nestable').nestable('init');
          this.loadFr().then(()=>{
            this.isLoading = false;
          })
        },10);
      });

      this.exigencesToAdd =  [];
    }
    //API call : deleting functional requirements
    if(this.exigencesToDel.length > 0){
      this.FRS.deleteMultipleFunctionalRequirements(this.exigencesToDel).subscribe();
      this.exigencesToDel = [];
    }
    //API call : updating titles
    if(this.exigencesToModify.length > 0){
      this.FRS.updateTitles(this.exigencesToModify).subscribe();
      this.exigencesToModify = [];
    }

    if(this.hiarUpdate.length > 0){
      this.FRS.updateHierarchy(this.hiarUpdate).subscribe(()=>{
        this.hiarUpdate = [];
        this.isLoading = true;
        for(let s of this.struct) {
          // @ts-ignore
          document.getElementById(s.id).remove();
        }
        this.loadFr().then(()=>{
          this.oldStruct = this.struct;
          this.isLoading = false;
        });
      });
    }

    this.Visibilite=true;
    // @ts-ignore
    document.querySelector('.confirm-btn').setAttribute("style", "display: none");
    // @ts-ignore
    document.querySelector('.cancel-btn').setAttribute("style", "display: none");
  }

  handleCancel(){
    this.exigencesToAdd = [];
    this.exigencesToDel = [];
    this.exigencesToModify = [];
    if(this.hiarUpdate.length > 0) {
      this.isLoading = true;
      for(let s of this.struct) {
        // @ts-ignore
        document.getElementById(s.id).remove();
      }
      this.loadFr().then(()=>{
        if(this.oldStruct !=null) {
          this.struct = this.oldStruct;
        }
        this.isLoading = false;
      })
      this.hiarUpdate = [];

    }
    // @ts-ignore
    document.querySelector('.confirm-btn').setAttribute("style", "display: none");
    // @ts-ignore
    document.querySelector('.cancel-btn').setAttribute("style", "display: none");
    this.isLoading = true;
    this.loadFr().then(()=>{
      this.isLoading = false;
    });
  }

  //return the description of a functional requirement
  allCollapsed: boolean = true;

  delete(h, fr, exs) {
    if(h[3].length > 0) {
      for(let e of exs) {
        let id = "";
        if(h[3].indexOf(".")> -1) {
          id = h[3].substring(0,h[3].indexOf('.'));
        } else {
          id = h[3];
        }
        if(e.id == id){
          if(h[3].indexOf(".")> -1) {
            h[3] = h[3].substring(h[3].indexOf(".")+1);
          } else {
            h[3] = "";
          }
          this.delete(h, fr, e.functional_requirements);
          break;
        }
      }
    } else {
      if(fr.functional_requirements.length > 0) {
        for(let h of this.hirearchy) {
          let children = h[3];
          children = "."+children+".";
          if(children.indexOf("."+fr.id+".")> -1)
            this.hirearchy.splice(this.hirearchy.indexOf(h),1);
        }
      }
      this.hirearchy.splice(this.hirearchy.indexOf(h), 1);
      this.exigencesToDel.push(fr.id);

      // @ts-ignore
      document.querySelector('.confirm-btn').setAttribute("style", "display: inline-block");
      // @ts-ignore
      document.querySelector('.cancel-btn').setAttribute("style", "display: inline-block");
      exs.splice(exs.indexOf(fr),1);

    }
  }
  supprimer(fr:functionalrequirement) {
    for(let h of this.hirearchy) {
      if(h[0] == fr.id) {
        this.delete(h, fr, this.exigences);
        break;
      }
    }
  }
  update(s:any) {
    if(s.children != null) {
      for(let ch of s.children) {
        ExigencesComponent.instance.hiarUpdate.push({
          "id": ch.id,
          "parentId": s.id
        });
        this.update(ch);
      }
    }
  }
  handleDragAndDrop(list:any) {
    if(window.JSON.stringify(list) != window.JSON.stringify(this.struct)) {
      let update = false;
      if(this.struct!="") {
        update = true
        this.oldStruct = this.struct;
      } else {
        this.oldStruct = list;
      }
      this.struct = list;
      if(update) {

        (async function () {
          for(let s of ExigencesComponent.instance.struct) {
            ExigencesComponent.instance.hiarUpdate.push({
              "id": s.id,
              "parentId": null
            });
            ExigencesComponent.instance.update(s);
          }
        })().then(()=>{
          setTimeout(()=>{
            // @ts-ignore
            document.querySelector('.confirm-btn').setAttribute("style", "display: inline-block");
            // @ts-ignore
            document.querySelector('.cancel-btn').setAttribute("style", "display: inline-block");
          },50);
        });
      }
    }
  }
}

//drag & drop JQuery
$(document).ready(function(){

  var updateOutput = function (e) {
    var list = e.length ? e : $(e.target);
    ExigencesComponent.instance.handleDragAndDrop(list.nestable('serialize'));
  };

  // activate Nestable for list 1
  // @ts-ignore
  $('#nestable').nestable({
    group: 1
  }).on('change', updateOutput);

  // activate Nestable for list 2
  // @ts-ignore
  $('#nestable2').nestable({
    group: 2
  }).on('change', updateOutput);

  //this line waits for the API to retrieve the data before updating the serialized output
  setTimeout(function(){updateOutput($('#nestable').data('output', $('#nestable-output')));}, 1000);
});


//end drag & drop
