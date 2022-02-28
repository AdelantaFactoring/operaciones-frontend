import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss']
})
export class CheckListComponent implements OnInit {
  public contentHeader: object;
  constructor() {
    this.contentHeader = {
      headerTitle: 'Check list',
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
            name: 'Comercial',
            isLink: false
          },
          {
            name: 'Check list',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
  }

}
