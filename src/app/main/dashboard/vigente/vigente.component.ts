import { Component, OnInit } from '@angular/core';
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

  constructor(
    private dashboardService: DashboardService,
    private utilsService: UtilsService,
  ) 
  { 
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
  }

  ngOnInit(): void {
    // this.onSectorBar();
    this.onListar();
  }

  async onListar(idEjecutivo: number = 0): Promise<void> {
    this.utilsService.blockUIStart('Obteniendo información...');

    const response: Dashboard[] = await this.dashboardService.listarDash({
      idMoneda: 0,
      idEjecutivo: idEjecutivo,
      // fechaHasta: this.utilsService.formatoFecha_YYYYMM(this.filterFecha.hasta),
      fechaHasta: 202210
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {

      this.lista = response;

    }

    this.utilsService.blockUIStop();
  }

  onSuma(parametro: string, tipo: number): Number {
    let monto = [];
    let valor: number = 0;
    let convertido: string;

    if (tipo == 1) {
      monto = this.lista.filter(x => x.pagadorSector === parametro);
      for (const item of monto) {
        valor += item.saldoTotal
      }
    } else if (tipo == 2){
      monto = this.lista.filter(x => x.codMoneda === parametro);
      for (const item of monto) {
        valor += item.saldoTotal
      }
    }
    else if (tipo == 3)
    {
      monto = this.lista.filter(x => x.idTipoOperacion.toString() === parametro);
      for (const item of monto) {
        valor += item.saldoTotal
      }
    }
    else 
    {
      for (const item of this.lista) {
        valor += item.saldoTotal 
      }
    }

    convertido = parseFloat(valor.toString()).toFixed(2);
    valor = Number(convertido);
    return valor;
  }
}
