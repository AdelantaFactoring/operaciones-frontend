import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Dashboard, Detalle } from 'app/shared/models/dashboard/dashboard';
import { UtilsService } from 'app/shared/services/utils.service';
import { DashboardService } from '../dashboard.service';
class VencidoData {
  idMoneda: number;
  codMoneda: string;
  idEjecutivo: Number;
  ejecutivo: string;
  montoCobrar: Number;
  importeRecaudado: Number;
  detalle: EjecutivoDet[];
  cambiarIcono: boolean;
  netoConfirmado: number;
  pagoTotal: number;

  confirmadoTot: number;
  pagoTot: number;
}

class EjecutivoDet {
  pagador: string;
  moneda: string;
  netoConfirmado: number;
  pagoTotal: number;
}

@Component({
  selector: 'app-vencido',
  templateUrl: './vencido.component.html',
  styleUrls: ['./vencido.component.scss']
})
export class VencidoComponent implements OnInit {

  public contentHeader: object;

  public lista: Dashboard[] = [];

  public ejecutivo: VencidoData[] = [];
  public cambiarIconoPen: boolean = false;
  public cambiarIconoUsd: boolean = false;
  public ejecutivoPen: VencidoData[] = [];
  public ejecutivoUsd: VencidoData[] = [];
  public filtroForm: FormGroup;
  public filterFecha: any;
  constructor(
    private utilsService: UtilsService,
    private dashboardService: DashboardService,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
  ) {
    this.contentHeader = {
      headerTitle: 'Vencido',
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
            name: 'Vencido',
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
    });
  }

  ngOnInit(): void {
    this.onListar();
  }

  async onListar(idEjecutivo: number = 0): Promise<void> {
    this.ejecutivo = [];
    this.utilsService.blockUIStart('Obteniendo información...');

    const response: Dashboard[] = await this.dashboardService.listarDashVencido({
      idMoneda: 0,
      idEjecutivo: idEjecutivo,
      // fechaHasta: this.utilsService.formatoFecha_YYYYMM(this.filterFecha.hasta),
      fechaDesde: this.utilsService.formatoFecha_YYYYMM(this.filterFecha.hasta),
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {
      this.lista = response;
      for (const item of response) {
        if (this.ejecutivo.find(x => x.ejecutivo.toLowerCase() === item.usuario.toLowerCase() &&
          x.codMoneda.toLocaleLowerCase() == item.codMoneda.toLocaleLowerCase()) === undefined) {
          this.ejecutivo.push({
            idMoneda: item.idMoneda,
            codMoneda: item.codMoneda,
            idEjecutivo: item.idEjecutivo,
            ejecutivo: item.usuario,
            montoCobrar: 0,
            importeRecaudado: item.nuevoMontoTotal,
            detalle: this.onDetalle(item.usuario, item.codMoneda),
            cambiarIcono: false,
            netoConfirmado: item.netoConfirmado,
            pagoTotal: item.pagoTotal,
            confirmadoTot: this.onSuma(item.usuario, 5, item.codMoneda),
            pagoTot: this.onSuma(item.usuario, 6, item.codMoneda)
          });
        }
      }
      this.ejecutivoPen = this.ejecutivo.filter(x => x.codMoneda == 'PEN');
      this.ejecutivoUsd = this.ejecutivo.filter(x => x.codMoneda == 'USD');
    }

    this.utilsService.blockUIStop();
  }

  onSuma(parametro: string, tipo: number, moneda: string = '', pagador: string = ''): number {
    let monto = [];
    let valor: number = 0;
    let convertido: string;

    if (tipo == 1) {
      monto = this.lista.filter(x => x.codMoneda === parametro);
      for (const item of monto) {
        valor += item.netoConfirmado
      }
    }
    else if (tipo == 2) {
      monto = this.lista.filter(x => x.codMoneda === parametro);
      for (const item of monto) {
        valor += item.pagoTotal
      }
    }
    // else if (tipo == 4) {
    //   for (const item of this.ejecutivo) {
    //     valor += item.saldoTotal
    //   }
    // }
    
    else if (tipo == 5) {
      monto = this.lista.filter(x => x.usuario === parametro && x.codMoneda === moneda);
      for (const item of monto) {
        valor += item.netoConfirmado
      }
    }
    
    else if (tipo == 6) {
      monto = this.lista.filter(x => x.usuario === parametro && x.codMoneda === moneda);
      for (const item of monto) {
        valor += item.pagoTotal
      }
    }
    else if (tipo == 7) {
      monto = this.lista.filter(x => x.usuario === parametro && x.codMoneda === moneda && x.pagador === pagador);
      for (const item of monto) {
        valor += item.netoConfirmado
      }
    }
    else if (tipo == 8) {
      monto = this.lista.filter(x => x.usuario === parametro && x.codMoneda === moneda && x.pagador === pagador);
      for (const item of monto) {
        valor += item.pagoTotal
      }
    }
    convertido = parseFloat(valor.toString()).toFixed(2);
    valor = Number(convertido);
    return valor;
  }

  onDetalle(parametro, moenda): EjecutivoDet[] {
    let detalle: EjecutivoDet[] = [];
    let dataFilter = [];
    dataFilter = this.lista.filter(x => x.usuario === parametro && x.codMoneda == moenda);
    
    for (const item of dataFilter) {
      if (detalle.find(x => x.pagador.toLocaleLowerCase() == item.pagador.toLocaleLowerCase()) === undefined) {
        detalle.push({
          pagador: item.pagador,
          moneda: item.codMoneda,
          netoConfirmado: this.onSuma(parametro, 7, moenda, item.pagador),
          pagoTotal: this.onSuma(parametro, 8, moenda, item.pagador),
        });
      }
      // detalle.push({
      //   pagador: item.pagador,
      //   moneda: item.codMoneda
      // });
    }

    return detalle;
  }

  onCambiarVisibilidadDetalleTodo(tipo: number) {
    if (tipo == 1) {
      this.cambiarIconoPen = !this.cambiarIconoPen;
      this.ejecutivo.forEach(el => {
        if (el.idMoneda == 1) {
          el.cambiarIcono = this.cambiarIconoPen;
          document.getElementById('trPEN' + el.idEjecutivo).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
          document.getElementById('detailPEN' + el.idEjecutivo).style.display = (el.cambiarIcono) ? "block" : "none";
        }
        // if(el.idTipoOperacion != 2)
      })
    } else {
      this.cambiarIconoUsd = !this.cambiarIconoUsd;
      this.ejecutivo.forEach(el => {
        if (el.idMoneda == 2) {
          el.cambiarIcono = this.cambiarIconoUsd;
          document.getElementById('trUSD' + el.idEjecutivo).style.visibility = (el.cambiarIcono) ? "visible" : "collapse";
          document.getElementById('detailUSD' + el.idEjecutivo).style.display = (el.cambiarIcono) ? "block" : "none";
        }
      })
    }

  }
  onCambiarVisibilidadDetalle(item: any) {
    item.cambiarIcono = !item.cambiarIcono;
    document.getElementById('tr' + item.codMoneda + item.idEjecutivo).style.visibility = (item.cambiarIcono) ? "visible" : "collapse";
    document.getElementById('detail' + item.codMoneda + item.idEjecutivo).style.display = (item.cambiarIcono) ? "block" : "none";

  }
}
