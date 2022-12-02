import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-power-bi',
  templateUrl: './power-bi.component.html',
  styleUrls: ['./power-bi.component.scss']
})
export class PowerBiComponent implements OnInit {

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
            name: 'Power BI',
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

    const elem1 = document.getElementById('contenedorPB');
    elem1.style.height = height1.toString() + 'px';

  }
}
