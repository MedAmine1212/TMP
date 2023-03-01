import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { labels } from 'src/app/models/labels';
import { LabelsService } from 'src/app/Services/labels.service';

@Component({
  selector: 'app-labels-management',
  templateUrl: './labels-management.component.html',
  styleUrls: ['./labels-management.component.css',
  '../../../assets/css/bootstrap.min.css',
  '../../../assets/font-awesome/css/font-awesome.css',
  '../../../assets/css/animate.css',
  '../../../assets/css/style.css'
]
})
export class LabelsManagementComponent implements OnInit {
  
  row : labels[];
  label : any;
  labelName: string;
  labelDesc:string;
  labelToUpdate: labels | undefined = undefined;
  
  addTable() {
    console.log(this.labelName);
    console.log(this.labelDesc);
    this.label= {name : this.labelName, description:  this.labelDesc, color: this.selectedColor};    // const obj = {
    this.labelsService.addLabel(this.label).subscribe(data => {
      this.labelsService.getAllLabels().subscribe(data => {
        this.row = data;
      });
    });
    this.cleanLabel();
  }

  deleteRow(idLabel : number){
    console.log(idLabel);
    this.labelsService.deleteLabel(idLabel).subscribe(data => {
      console.log(data);
      this.labelsService.getAllLabels().subscribe(data => {
        this.row = data;
      })
    });
  }

  

  updateLabel() {
    this.labelToUpdate.color = this.selectedColor;
    this.labelsService.updateLabel(this.labelToUpdate).subscribe(data => {
      this.labelsService.getAllLabels().subscribe(data => {
        this.row = data;
      });
    });
  }

  cleanLabel(){
    this.label.name = "";
    this.label.description = "";
    this.label.color = "";
  }
  

 /*  Color Picker edit */

 public toggle: boolean = false;

 public rgbaText: string = 'rgba(165, 26, 214, 0.2)';
 public colorList = [
  { key: "flame", value: "#e45a33", friendlyName: "Flame" },
  {key: "orange", value: "#fa761e", friendlyName: "Orange" },
  {key: "infrared",     value: "#ef486e", friendlyName: "Infrared" },
  {key: "male",       value: "#4488ff", friendlyName: "Male Color" },
  {key: "female",     value: "#ff44aa", friendlyName: "Female Color" },
  {key: "paleyellow",    value: "#ffd165", friendlyName: "Pale Yellow" },
  {key: "gargoylegas",  value: "#fde84e", friendlyName: "Gargoyle Gas" },
  {key: "androidgreen",   value: "#9ac53e", friendlyName: "Android Green" },
  {key: "carribeangreen",    value: "#05d59e", friendlyName: "Carribean Green" },
  {key: "bluejeans",    value: "#5bbfea", friendlyName: "Blue Jeans" },
  {key: "cyancornflower",    value: "#1089b1", friendlyName: "Cyan Cornflower" },
  {key: "warmblack",    value: "#06394a", friendlyName: "Warm Black" },
];

 public arrayColors: any = {
   color1: '#2883e9',
   color2: '#e920e9',
   color3: 'rgb(255,245,0)',
   color4: 'rgb(236,64,64)',
   color5: 'rgba(45,208,45,1)'
 };

 public presetValues : string[] = [];
 public selectedColor: string = '#2889e9';

 public color1: string = '#2889e9';
 public color2: string = '#e920e9';
 public color3: string = '#fff500';
 public color4: string = 'rgb(236,64,64)';
 public color5: string = 'rgba(45,208,45,1)';
 public color6: string = '#1973c0';
 public color7: string = '#f200bd';
 public color8: string = '#a8ff00';
 public color9: string = '#278ce2';
 public color10: string = '#0a6211';
 public color11: string = '#f2ff00';
 public color12: string = '#f200bd';
 public color13: string = 'rgba(0, 255, 0, 0.5)';
 public color14: string = 'rgb(0, 255, 255)';
 public color15: string = '#a51ad633';
 public color16: string = 'rgba(45,208,45,0.5)';

 public cmykColor: Cmyk = new Cmyk(0, 0, 0, 0);

  constructor(public vcRef: ViewContainerRef, private cpService: ColorPickerService, private labelsService : LabelsService) {  this.presetValues = this.getColorValues(); }
  
  getColorValues(){
    return this.colorList.map(c => c.value);
  }
  
  public onEventLog(event: string, data: any): void {
    console.log(event, data);
  }

  public onChangeColor(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    const rgba = this.cpService.hsvaToRgba(hsva);
    return this.cpService.rgbaToCmyk(rgba);
  }

  public onChangeColorHex8(color: string): string {
    const hsva = this.cpService.stringToHsva(color, true);
    return this.cpService.outputFormat(hsva, 'rgba', null);
  }

  public onChangeColorCmyk(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    if (hsva) {
      const rgba = this.cpService.hsvaToRgba(hsva);
      return this.cpService.rgbaToCmyk(rgba);
    }
    return new Cmyk(0, 0, 0, 0);
  }

  /* modals maniplation */
  modalVisibility : boolean = true;

  handleEventClick(){
    this.modalVisibility = false;
  }

  modalVisibility1 : boolean = true;

  handleEventClick1(){
    this.modalVisibility1 = false;
  }
/* end modals manipulation */

  ngOnInit(): void {
    this.labelsService.getAllLabels().subscribe(
      data => {
        console.log(data);
        this.row = data;
      }
    );
    console.log(this.labelToUpdate);
  }
}
