import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-proyectado',
  templateUrl: './proyectado.component.html',
  styleUrls: ['./proyectado.component.scss']
})
export class ProyectadoComponent implements OnInit {

  public moneda: string = 'PEN';
  public contentHeader: object;
  public filtroForm: FormGroup;

  public filterFecha: any;

  constructor(
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder) 
  {
    this.filtroForm = this.formBuilder.group({
      fechaDesde: [''],
      fechaHasta: ['']
    });
    let fecha = new Date();
    fecha.setDate(fecha.getDate() - Number(5));
    this.filterFecha = {
      desde: {
        year: fecha.getFullYear(),
        month: fecha.getMonth() + 1,
        day: fecha.getDate()
      },
      hasta: this.calendar.getToday()
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe(s => {
      this.moneda = s.moneda;
      // this.onListarLiquidaciones();
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
              name: 'Global - ' + this.moneda,
              isLink: false
            }
          ]
        }
      }
    });
  }

}
