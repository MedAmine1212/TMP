import { Component, OnInit } from '@angular/core';
import { DocumentsService } from 'src/app/Services/documents.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css',
  '../../../assets/css/bootstrap.min.css',
  '../../../assets/css/plugins/summernote/summernote-bs4.css',
  '../../../assets/font-awesome/css/font-awesome.css',
  '../../../assets/css/plugins/datapicker/datepicker3.css',
  '../../../assets/css/animate.css',
  '../../../assets/css/style.css']
})
export class DocumentsComponent implements OnInit {
  documents: any = [];
x=1;


  constructor(private DS: DocumentsService) { }


  ngOnInit(): void {
this.getDoc(2);
  }
  getDoc(idProject: number){
    this.DS.getDocuments(idProject).subscribe(data => {
      this.documents = data;
      this.documents = Array.from(this.documents);
       console.log('data',this.documents);
    });
  }
  deleteDoc(idDocument: number){
    this.DS.deleteDoc(idDocument).subscribe(data => {
      window.location.pathname =
      'tmp/documents';
    });
  }
}
