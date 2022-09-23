import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Dashboard } from 'app/shared/models/dashboard/dashboard';
import { UtilsService } from 'app/shared/services/utils.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-vigente',
  templateUrl: './vigente.component.html',
  styleUrls: ['./vigente.component.scss']
})
export class VigenteComponent implements OnInit {

  public contentHeader: object;
  public lista: Dashboard[] = [];
  public filtroForm: FormGroup;

  public filterFecha: any;
  public data = [];
  constructor(
    private dashboardService: DashboardService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private calendar: NgbCalendar
  ) {
    this.contentHeader = {
      headerTitle: 'Vigente',
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
            name: 'Dashboard',
            isLink: false
          },
          {
            name: 'Vigente',
            isLink: false
          }
        ]
      }
    };
    this.filtroForm = this.formBuilder.group({
      fechaHasta: [],
      usuario: []
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
    this.filtroForm = this.formBuilder.group({
      fechaHasta: [],
    });
  }

  ngOnInit(): void {
    // this.onSectorBar();
    this.onListar();
  }

  async onListar(idEjecutivo: number = 0): Promise<void> {
    this.data = [];
    this.utilsService.blockUIStart('Obteniendo información...');

    const response: Dashboard[] = await this.dashboardService.listarDash({
      idMoneda: 0,
      idEjecutivo: idEjecutivo,
      fechaHasta: this.utilsService.formatoFecha_YYYYMM(this.filterFecha.hasta),
      // fechaHasta: 202210
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {

      this.lista = response;

      response.forEach(e => {
        if (this.data.find(x => x.idPagador.toString().toLocaleLowerCase() === e.idPagador.toString().toLocaleLowerCase() && x.codMoneda.toLowerCase() === e.codMoneda.toLocaleLowerCase()) == undefined) {
          this.data.push({
            idPagador: e.idPagador,
            codMoneda: e.codMoneda,
            pagador: e.pagador,
            saldoTotal: this.onSuma(e.idPagador.toString(), 5, e.codMoneda)
          });
        }
      });

    }

    this.utilsService.blockUIStop();
  }

  onSuma(parametro: string, tipo: number, moneda: string = ''): Number {
    let monto = [];
    let valor: number = 0;
    let convertido: string;

    if (tipo == 1) {
      monto = this.lista.filter(x => x.pagadorSector === parametro);
      for (const item of monto) {
        valor += item.saldoTotal
      }
    } else if (tipo == 2) {
      monto = this.lista.filter(x => x.codMoneda === parametro);
      for (const item of monto) {
        valor += item.saldoTotal
      }
    }
    else if (tipo == 3) {
      monto = this.lista.filter(x => x.idTipoOperacion.toString() === parametro);
      for (const item of monto) {
        valor += item.saldoTotal
      }
    }
    else if (tipo == 4) 
    {
      for (const item of this.lista) {
        valor += item.saldoTotal
      }
    }
    else if (tipo == 5) {
      monto = this.lista.filter(x => x.idPagador.toString() === parametro && x.codMoneda == moneda);
      for (const item of monto) {
        valor += item.saldoTotal
      }
    }

    convertido = parseFloat(valor.toString()).toFixed(2);
    valor = Number(convertido);
    return valor;
  }
}
