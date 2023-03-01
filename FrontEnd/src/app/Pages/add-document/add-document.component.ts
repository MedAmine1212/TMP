import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DocumentsService } from 'src/app/Services/documents.service';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css' ,
  '../../../assets/css/bootstrap.min.css',
  '../../../assets/css/plugins/summernote/summernote-bs4.css',
  '../../../assets/font-awesome/css/font-awesome.css',
  '../../../assets/css/plugins/datapicker/datepicker3.css',
  '../../../assets/css/animate.css',
  '../../../assets/css/style.css']

})
export class AddDocumentComponent implements OnInit {
  public Editor = ClassicEditor ;


  title: any ='';
  description: any ='';
  category: any ='' ;

  LongTab=0 ;
  statut: number | undefined;
  constructor(private DS: DocumentsService) { }

  ngOnInit(): void {

  }


  @Input() config = {
    cloudServices: {
			tokenUrl: 'https://90103.cke-cs.com/token/dev/b83508d2a45f65da9a687e8b3da9533f485b22a1753086df0eaa34551ec5?limit=10',
			uploadUrl: 'https://90103.cke-cs.com/easyimage/upload/'
		},

    toolbar: {
      items: [
        'heading', '|',
        'fontfamily', 'fontsize',
        'alignment',
        'fontColor', 'fontBackgroundColor', '|',
        'bold', 'italic', '|',
        'link', '|',
        'outdent', 'indent', '|',
        'bulletedList', 'numberedList', 'todoList', '|',
        'code', 'codeBlock', '|',
        'insertTable', '|',
        'imageUpload', 'blockQuote', '|',

        'todoList'
        ,
        'undo', 'redo',
      ],
      shouldNotGroupWhenFull: true,

    },
    image: {
      // Configure the available styles.
      styles: [
        'alignLeft', 'alignCenter', 'alignRight'
      ],

      // Configure the available image resize options.
      resizeOptions: [
        {
          name: 'resizeImage:original',
          label: 'Original',
          value: null
        },
        {
          name: 'resizeImage:50',
          label: '25%',
          value: '25'
        },
        {
          name: 'resizeImage:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'resizeImage:75',
          label: '75%',
          value: '75'
        }
      ],

      // You need to configure the image toolbar, too, so it shows the new style
      // buttons as well as the resize buttons.
      toolbar: [
        'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
        '|',
        'ImageResize',
        '|',
        'imageTextAlternative'
      ]
    },
    // simpleUpload: {
    //    The URL that the images are uploaded to.
    // uploadUrl: 'http://localhost:52536/api/Image/ImageUpload',

    //   Enable the XMLHttpRequest.withCredentials property.

    //},

    language: 'en'
  };
  onReady(editor) {
    if (editor.model.schema.isRegistered('image')) {
      editor.model.schema.extend('image', { allowAttributes: 'blockIndent' });
    }
  }

  postAdd(request: Request) {
    console.log('vae',this.title);
    console.log('hi');
    this.DS
      .insertDoc(2,
        this.category,
        this.title,
        this.description,

      )
      .subscribe(
        (data) => {


          console.log('data', data);
          window.location.pathname =
          'tmp/documents';
        },
        (err: HttpErrorResponse) => {
          console.error(
            'An error occurred:',
            err.error.message,
            'status',
            err.status
          );
          if (err.status == 409) {
            this.statut = err.status;
            console.log('hi4');
          } else {
            this.statut = 500;
            console.log('hi5');
          }
        }
      );
  }


}
