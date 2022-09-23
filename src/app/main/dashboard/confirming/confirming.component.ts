import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Dashboard } from 'app/shared/models/dashboard/dashboard';
import { UtilsService } from 'app/shared/services/utils.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-confirming',
  templateUrl: './confirming.component.html',
  styleUrls: ['./confirming.component.scss']
})
export class ConfirmingComponent implements OnInit {

  public contentHeader: object;
  public filtroForm: FormGroup;

  public lista: Dashboard[] = [];
  public data = [];
  public filterFecha: any;
  constructor(
    private utilsService: UtilsService,
    private dashboardService: DashboardService,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder
  ) {
    this.contentHeader = {
      headerTitle: 'Confirming',
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
            name: 'Confirming',
            isLink: false
          }
        ]
      }
    };

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
      usuario: []
    });
  }

  ngOnInit(): void {
    this.onListar();
  }

  onListar(): void {
    this.data = [];

    this.utilsService.blockUIStart('Obteniendo información...');

    this.dashboardService.listarDash({
      idMoneda: 0,
      idEjecutivo: 0,
      fechaHasta: this.utilsService.formatoFecha_YYYYMM(this.filterFecha.hasta),
    }).subscribe((response: Dashboard[]) => {
      if (response) {
        this.lista = response.filter(x => x.idTipoOperacion === 3 && !x.flagPagoInteresAdelantado);

        this.lista.forEach(e => {
          if (this.data.find(x => x.idPagador.toString().toLocaleLowerCase() === e.idPagador.toString().toLocaleLowerCase() && x.codMoneda.toLowerCase() === e.codMoneda.toLocaleLowerCase()) == undefined) {
            this.data.push({
              idPagador: e.idPagador,
              codMoneda: e.codMoneda,
              pagador: e.pagador,
              montoFacturado: this.onSuma(e.idPagador.toString(), 4, e.codMoneda)
            });
          }
        });
      }
      this.utilsService.blockUIStop();
    }, error => {
      this.utilsService.blockUIStop();
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });
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
    else if (tipo == 4) {
      monto = this.lista.filter(x => x.idTipoOperacion === 3 && x.idPagador.toString() === parametro && x.codMoneda === moneda);
      for (const item of monto) {
        valor += item.montoFacturado_Total
      }
    }
    else if (tipo == 5) {
      monto = this.data.filter(x => x.codMoneda === parametro);

      for (const item of monto) {
        valor += item.montoFacturado
      }
    }
    else {
      for (const item of this.lista) {
        valor += item.saldoTotal
      }
    }

    convertido = parseFloat(valor.toString()).toFixed(2);
    valor = Number(convertido);
    return valor;
  }
}
