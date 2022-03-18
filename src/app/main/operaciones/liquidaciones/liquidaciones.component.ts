import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.component.html',
  styleUrls: ['./liquidaciones.component.scss']
})
export class LiquidacionesComponent implements OnInit {
  public contentHeader: object;
  constructor() {
    this.contentHeader = {
      headerTitle: 'Liquidaciones',
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
            name: 'Operaciones',
            isLink: false
          },
          {
            name: 'Liquidaciones',
            isLink: false
          }
        ]
      }
    };
  }

  ngOnInit(): void {
  }

}
