import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dashboard } from 'app/shared/models/dashboard/dashboard';
import { LiquidacionCab } from 'app/shared/models/operaciones/liquidacion-cab';
import { LiquidacionDet } from 'app/shared/models/operaciones/liquidacion-det';
import { UtilsService } from 'app/shared/services/utils.service';
import { EjecutivoService } from './ejecutivo.service';

class Anio {
  anio: string;
  cant: number;
  det: any;
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
  public moneda: string = 'PEN';

  constructor(
    private route: ActivatedRoute,
    private ejecutivoService: EjecutivoService,
    private utilsService: UtilsService) {

  }

  ngOnInit(): void {
    this.columnaMes.push({
      id: 1,
      columna: 'Prueba',
      anio: '2020',
      cant: 3
    },
      {
        id: 2,
        columna: 'Prueba 2',
        anio: '2020',
        cant: 3
      },
      {
        id: 3,
        columna: 'Prueba 3',
        anio: '2022',
        cant: 2
      },
      {
        id: 4,
        columna: 'Prueba 4',
        anio: '2022',
        cant: 2
      },
      {
        id: 5,
        columna: 'Prueba 5',
        anio: '2023',
        cant: 2
      },
      {
        id: 6,
        columna: 'Prueba 6',
        anio: '2023',
        cant: 2
      },
      {
        id: 7,
        columna: 'Prueba 7',
        anio: '2020',
        cant: 3
      });

    this.columnaMes.forEach(element => {
      if (this.columnaAnio.find(p => p.anio.toLowerCase() === element.anio.toLowerCase()) == undefined) {
        this.columnaAnio.push(element)
      }
    });

    this.route.params.subscribe(s => {
      this.moneda = s.moneda;
      this.onListarCobranza();
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

  async onListarCobranza(): Promise<void> {
    // this.pagadorLista2 = [];
    // this.pagadorLista4 = [];

    this.utilsService.blockUIStart('Obteniendo información...');

    const response = await this.ejecutivoService.listar2({
      idConsulta: 3,
      cliente: '',
      pagProv: '',
      moneda: this.moneda,
      pagProvDet: '',
      fechaDesde: '',
      fechaHasta: ''
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {
      this.pagadorCab = response.liquidacionCab;
      this.pagadorDet = response.liquidacionDet;
      this.onEjecutivoFilter(this.pagadorCab);
      this.onGenerarData();
      // this.pagadorLista3 = response;

      // for (const item of this.pagadorLista) {
      //   this.total += item.saldoTotal;
      // }

      // for (const item of this.pagadorLista) {
      //   item.flagSeleccionado = false;
      //   item.porcentajePagoTotal = (item.saldoTotal * 100) / this.total;
      // }

      // this.pagadorLista.forEach(element => {
      //   if (this.pagadorLista2.find(p => p.usuarioCreacion.toLowerCase() === element.usuarioCreacion.toLowerCase()) == undefined) {
      //     element.flagSeleccionado = false;
      //     this.pagadorLista2.push(element);
      //     this.pagadorLista4.push(element);
      //   }
      // });


      // this.onPie(this.pagadorLista2);
    }

    this.utilsService.blockUIStop();

    //   .subscribe((response: LiquidacionCab[]) => {
    //   this.cobranza = response;
    //   this.collectionSize = response.length > 0 ? response[0].totalRows : 0;
    //   this.utilsService.blockUIStop();
    // }, error => {
    //   this.utilsService.blockUIStop();
    //   this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    // });
  }

  onGenerarData(): void {
    // this.pagadorLista
    let data = [];
    // for (const cab of this.pagadorLista[0].liquidacionDet) {
    for (const det of this.pagadorDet) {
      // this.columnaMes2.push({
      //   anio: det.anio.toString(),
      //   mes: det.mes
      // });
      det.anio = det.anio.toString();
      if (this.columnaAnio2.find(p => p.anio.toLowerCase() === det.anio.toLowerCase()) == undefined) {
        this.columnaAnio2.push({
          anio: det.anio,
          cant: 0,
          det: ''
        })
      }

    }

    for (const item of this.columnaAnio2) {
      item.det = this.pagadorDet.filter(x => x.anio.toString() === item.anio.toString());
      for (const mes of item.det) {
        mes.mes = mes.mes.toString();
       if (data.find(x => x.anio.toLowerCase() === mes.anio.toLowerCase() && x.mes.toLowerCase() === mes.mes.toLowerCase()) === undefined) {
        data.push({
          anio: item.anio.toString(),
          mes: mes.mes.toString()
        });
       }
      }
    }

    for (const item of data) {
      if (this.columnaAnio3.find(x => x.anio.toLowerCase() === item.anio.toLowerCase()) === undefined)
      {
        this.columnaAnio3.push({
          anio: item.anio,
          cant: data.filter(x => x.anio.toString() === item.anio.toString()).length,
          det: data.filter(x => x.anio.toString() === item.anio.toString())
        });
      }
     
    }
  }

  idMes(value: number): string {
    if (value == 1) {
      return 'Enero'
    }
    else if (value == 2) {
      return 'Febrero'
    }
    else if (value == 3) {
      return 'Marzo'
    }
    else if (value == 4) {
      return 'Abril'
    }
    else if (value == 5) {
      return 'Mayo'
    }
    else if (value == 6) {
      return 'Junio'
    }
    else if (value == 7) {
      return 'Julio'
    }
    else if (value == 8) {
      return 'Agosto'
    }
    else if (value == 9) {
      return 'Setiembre'
    }
    else if (value == 10) {
      return 'Octubre'
    }
    else if (value == 11) {
      return 'Noviembre'
    }
    else if (value == 12) {
      return 'Diciembre'
    }
  }

  onEjecutivo(idEjecutivo): void {
    
  }

  onEjecutivoFilter(data): void {
    data.forEach(element => {
      if (this.ejecutivoFilter.find(p => p.usuarioCreacion.toLowerCase() === element.usuarioCreacion.toLowerCase()) == undefined) {
        
        this.ejecutivoFilter.push(element);
      }
    });

    
  }
}
