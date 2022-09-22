import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dashboard } from 'app/shared/models/dashboard/dashboard';
import { LiquidacionCab } from 'app/shared/models/operaciones/liquidacion-cab';
import { LiquidacionDet } from 'app/shared/models/operaciones/liquidacion-det';
import { UtilsService } from 'app/shared/services/utils.service';
import { DashboardService } from '../dashboard.service';
import { EjecutivoService } from './ejecutivo.service';

class Anio {
  anio: string;
  cant: number;
  det: any;
}

class Data {
  columna: string;
  descripcion: string;
}
@Component({
  selector: 'app-ejecutivo',
  templateUrl: './ejecutivo.component.html',
  styleUrls: ['./ejecutivo.component.scss']
})
export class EjecutivoComponent implements OnInit {

  public contentHeader: object;

  public pagadorCab = [];
  public pagadorDet = [];
  public ejecutivoFilter = [];

  columnaAnio = [];
  columnaMes = [];
  columnaAnio2: Anio[] = [];
  columnaAnio3: Anio[] = [];
  columnaMes2 = [];
  data = [];

  public moneda: number = 0;
  public ejectutivo: string = 'Todos';

  constructor(
    private route: ActivatedRoute,
    private ejecutivoService: EjecutivoService,
    private utilsService: UtilsService,
    private dashboardService: DashboardService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(s => {
      this.moneda = s.moneda;
      // this.onListarCobranza();
      this.onListar();
      this.onListarSaldo();
      this.contentHeader = {
        headerTitle: 'Ejecutivo',
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
              name: 'Ejecutivo - ' + this.moneda,
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

    this.dashboardService.listarDashSaldo({
      idMoneda: this.moneda,
      idEjecutivo: idEjecutivo,
      fechaHasta: 1
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
              columna: item
            })
          }
          else {
            // column = item.split('#');
            column = item.split('Col');
            this.columnaAnio.push({
              anio: column[1],
              mes: column[2],
              descripcion: column[3],
              columna: item
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

  // async onListarCobranza(): Promise<void> {
  //   this.utilsService.blockUIStart('Obteniendo información...');

  //   const response = await this.ejecutivoService.listar2({
  //     idConsulta: 3,
  //     cliente: '',
  //     pagProv: '',
  //     moneda: this.moneda,
  //     pagProvDet: '',
  //     fechaDesde: '',
  //     fechaHasta: ''
  //   }).toPromise().catch(error => {
  //     this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
  //   });

  //   if (response) {
  //     this.pagadorCab = response.liquidacionCab;
  //     this.pagadorDet = response.liquidacionDet;
  //     this.onEjecutivoFilter(this.pagadorCab);
  //     // this.onGenerarData();
  //   }

  //   this.utilsService.blockUIStop();
  // }

  // onGenerarData(): void {
  //   // this.pagadorLista
  //   let data = [];
  //   // for (const cab of this.pagadorLista[0].liquidacionDet) {
  //   for (const det of this.pagadorDet) {
  //     // this.columnaMes2.push({
  //     //   anio: det.anio.toString(),
  //     //   mes: det.mes
  //     // });
  //     det.anio = det.anio.toString();
  //     if (this.columnaAnio2.find(p => p.anio.toLowerCase() === det.anio.toLowerCase()) == undefined) {
  //       this.columnaAnio2.push({
  //         anio: det.anio,
  //         cant: 0,
  //         det: ''
  //       })
  //     }

  //   }

  //   for (const item of this.columnaAnio2) {
  //     item.det = this.pagadorDet.filter(x => x.anio.toString() === item.anio.toString());
  //     for (const mes of item.det) {
  //       mes.mes = mes.mes.toString();
  //      if (data.find(x => x.anio.toLowerCase() === mes.anio.toLowerCase() && x.mes.toLowerCase() === mes.mes.toLowerCase()) === undefined) {
  //       data.push({
  //         anio: item.anio.toString(),
  //         mes: mes.mes.toString()
  //       });
  //      }
  //     }
  //   }

  //   for (const item of data) {
  //     if (this.columnaAnio3.find(x => x.anio.toLowerCase() === item.anio.toLowerCase()) === undefined)
  //     {
  //       this.columnaAnio3.push({
  //         anio: item.anio,
  //         cant: data.filter(x => x.anio.toString() === item.anio.toString()).length,
  //         det: data.filter(x => x.anio.toString() === item.anio.toString())
  //       });
  //     }

  //   }
  // }

  onEjecutivoFilter(data): void {
    data.forEach(element => {
      if (this.ejecutivoFilter.find(p => p.usuarioCreacion.toLowerCase() === element.usuarioCreacion.toLowerCase()) == undefined) {

        this.ejecutivoFilter.push(element);
      }
    });


  }

  onSuma(parametro: string, tipo: number): Number {
    let monto = [];
    let valor: number = 0;
    let convertido: string;

    if (tipo == 1) {
      // // monto = this.data.filter(x => x.pagadorSector === parametro);
      // for (const item of monto) {
      //   valor += item.saldoTotal
      // }
      for (const item of this.data) {
        for (const row of item) {
          console.log('row', row);

        }
      }
    }
    convertido = parseFloat(valor.toString()).toFixed(2);
    valor = Number(convertido);
    return valor;
  }
}
