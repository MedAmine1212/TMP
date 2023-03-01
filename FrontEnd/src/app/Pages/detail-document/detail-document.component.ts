import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentsService } from 'src/app/Services/documents.service';

@Component({
  selector: 'app-detail-document',
  templateUrl: './detail-document.component.html',
  styleUrls: ['./detail-document.component.css',
  '../../../assets/css/bootstrap.min.css',
  '../../../assets/css/plugins/slick/slick.css',
  '../../../assets/font-awesome/css/font-awesome.css',
  '../../../assets/css/plugins/slick/slick-theme.css',
  '../../../assets/css/animate.css',
  '../../../assets/css/style.css']
})
export class DetailDocumentComponent implements OnInit {
  documents: any=[];
  id:any;
desc:any;
  constructor(private DS: DocumentsService ,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getDoc();
  }
  getDoc(){
    const idDocument = this.route.snapshot.paramMap.get('idDocument');
    console.log('id',idDocument);
    this.id=idDocument;
    this.DS.getDocument(this.id).subscribe(data => {
      this.documents = data;
      this.desc=this.documents.description;
       console.log('data',this.documents);
    });
  }

}
