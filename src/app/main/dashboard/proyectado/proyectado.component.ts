import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Dashboard } from 'app/shared/models/dashboard/dashboard';
import { UtilsService } from 'app/shared/services/utils.service';
import { DashboardService } from '../dashboard.service';

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

  public ejectutivo: string = 'Todos';
  columnaAnio = [];
  data = [];
  public ejecutivoFilter = [];
  constructor(
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private dashboardService: DashboardService) 
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
      this.onListar();
      this.onListarSaldo();
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

  onListarSaldo(idEjecutivo: number = 0, nombre: string = 'Todos'): void {
    this.ejectutivo = nombre;
    this.columnaAnio = [];
    this.data = [];
    this.utilsService.blockUIStart('Obteniendo información...');

    this.dashboardService.listarDashSaldo_Proyectado({
      idMoneda: this.moneda,
      idEjecutivo: idEjecutivo,
      fechaDesde: this.utilsService.formatoFecha_YYYYMMDD(this.filterFecha.desde),
      fechaHasta: this.utilsService.formatoFecha_YYYYMMDD(this.filterFecha.hasta)
    }).subscribe((response) => {
      this.data = response;
      
      for (var key in response) {
        let dataTempo;
        dataTempo = response[key];
        for (let item in dataTempo) {
          let column;
          if (!item.includes('Col')) {
            this.columnaAnio.push({
              anio: 'YEAR',
              mes: '',
              descripcion: item,
              columna: item,
              diaText: ''
            })
          }
          else {
            // column = item.split('#');
            column = item.split('Col');
            
            this.columnaAnio.push({
              anio: column[1],
              mes: column[2],
              descripcion: column[3],
              columna: item,
              diaText: column[4]
            });
          }

        }
        break;
      }

      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

  }

  async onListar(): Promise<void> {

    this.utilsService.blockUIStart('Obteniendo información...');

    const response: Dashboard[] = await this.dashboardService.listarDash({
      idMoneda: 0,
      idEjecutivo: 0,
      // fechaHasta: this.utilsService.formatoFecha_YYYYMM(this.filterFecha.hasta),
      fechaHasta: 207010
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {
      for (const item of response) {

        if (this.ejecutivoFilter.find(x => x.name.toLowerCase() === item.usuario.toLowerCase()) === undefined) {
          this.ejecutivoFilter.push({
            name: item.usuario,
            value: item.idEjecutivo,
            selected: false
          });
        }
      }
    }

    this.utilsService.blockUIStop();
  }
}
