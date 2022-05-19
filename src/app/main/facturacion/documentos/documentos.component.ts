import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {
  public contentHeader: object;

  public search: string = '';
  public page: number = 1;
  public pageSize: number = 10;
  public collectionSize: number;

  constructor() {
    this.contentHeader = {
      headerTitle: 'Documentos',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: true,
            link: '/'
          },
          {
            name: 'Facturación',
            isLink: false
          },
          {
            name: 'Documentos',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
  }

  onListarDocumentos(): void {

  }
}
