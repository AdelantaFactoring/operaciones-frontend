import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss']
})
export class KPIComponent implements OnInit {

  public contentHeader: object;
  constructor() { 
    this.contentHeader = {
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: true,
            link: '/'
          },
          {
            name: 'Dashboard',
            isLink: false
          },
          {
            name: 'KPI',
            isLink: false
          }
        ]
      }
    }
  }

  ngOnInit(): void {
    this.totalPantalla();
  }

  totalPantalla(): void {
    let height1 = document.body.clientHeight - 180;

    const elem1 = document.getElementById('contenedorKPI');
    elem1.style.height = height1.toString() + 'px';

  }

}
