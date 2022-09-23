import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Dashboard } from 'app/shared/models/dashboard/dashboard';
import { UtilsService } from 'app/shared/services/utils.service';
import { color, EChartsOption } from 'echarts';
import { SectorService } from './sector.service';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.scss']
})
export class SectorComponent implements OnInit {

  public contentHeader: object;
  public filtroForm: FormGroup;
  public sectorBar: EChartsOption;
  public monedaBar: EChartsOption;
  public tipoOperacionBar: EChartsOption;

  public lista: Dashboard[] = [];
  public dataSector = [];
  public moneda = [];
  public tipoOperacion = [];
  public ejecutivoFilter = [];
  public data = [];
  public filterFecha: any;
  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private sectorService: SectorService,
    private calendar: NgbCalendar
  ) {
    this.contentHeader = {
      headerTitle: 'Sector',
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
            name: 'Sector',
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
    this.moneda = [];
    this.dataSector = [];
    this.tipoOperacion = [];
    this.data = [];

    this.utilsService.blockUIStart('Obteniendo información...');

    const response: Dashboard[] = await this.sectorService.listarDash({
      idMoneda: 0,
      idEjecutivo: idEjecutivo,
      fechaHasta: this.utilsService.formatoFecha_YYYYMM(this.filterFecha.hasta),
      // fechaHasta: 202210
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {

     this.lista = response;
      for (const item of response) {

        if (this.ejecutivoFilter.find(x => x.name.toLowerCase() === item.usuario.toLowerCase()) === undefined) {
          this.ejecutivoFilter.push({
            name: item.usuario,
            value: item.idEjecutivo,
            selected: false
          });
        }

        if (this.dataSector.find(x => x.name.toLowerCase() === item.pagadorSector.toLowerCase()) === undefined) {
          this.dataSector.push({
            name: item.pagadorSector,
            value: this.onSuma(item.pagadorSector, 1),
            selected: false
          });
        }

        if (this.moneda.find(x => x.name.toLowerCase() === item.codMoneda.toLowerCase()) === undefined) {
          this.moneda.push({
            name: item.codMoneda,
            value: this.onSuma(item.codMoneda, 2),
            selected: false,
            color: item.codMoneda == 'PEN' ? '#75A0F6' : '#75F6BF'
          });
        }

        if (this.tipoOperacion.find(x => x.name.toLowerCase() === item.idTipoOperacion.toString().toLowerCase()) === undefined) {
          this.tipoOperacion.push({
            name: item.idTipoOperacion.toString(),
            value: this.onSuma(item.idTipoOperacion.toString(), 3),
            selected: false,
            color: item.idTipoOperacion == 1 ? '#E675F6' : item.idTipoOperacion == 2 ? '#75F675' : '#75DBF6'
          });
        }

        if (this.data.find(x => x.rucPagador.toLowerCase() == item.rucPagador.toLowerCase()) == undefined) {
          this.data.push({
            rucPagador: item.rucPagador,
            pagador: item.pagador,
            saldoTotal: this.onSuma(item.rucPagador, 5)
          });
        }
      }

      // this.onPie(this.moneda);
      this.onSectorBar(this.dataSector);
      this.onMonedaBar(this.moneda);
      this.onTipoOperacionBar(this.tipoOperacion);

    }

    this.utilsService.blockUIStop();
  }

  onClickDash(event, tipo): void {

  }

  onSectorBar(data): void {

    let dataX = [];
    let dataY = [];
    for (const item of data) {
      dataX.push(item.name);
      dataY.push(item.value);
    }
    this.sectorBar = {
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: [{
        type: 'category',
        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        data: dataX,
        axisLabel: {
          interval: 0,
          rotate: 30
        },
      }],
      yAxis: {
        type: 'value'
      },
      series: [
        {
          label: {
            show: true,
            position: 'top'
          },
          // data: [120, 200, 150, 80, 70, 110, 130],
          data: dataY,
          type: 'bar'
        }
      ]
    };
  }

  onMonedaBar(data): void {

    let moneda = [];
    let monto = [];
    for (const item of data) {
      moneda.push(item.name);
      monto.push({
        value: item.value,
        itemStyle: {
          color: item.color
        }});
    }

    this.monedaBar = {
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      title: {
        text: '%TG Acumulado por Pagador'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: moneda
      },
      series: [
        {
          label: {
            show: true,
            position: 'inside'
          },
          selectedMode: 'single',
         // name: 'USD',
          type: 'bar',
          data: monto
        },
      ],
    };
  }

  onTipoOperacionBar(data): void {

    let tipoOperacion = [];
    let monto = [];
    for (const item of data) {
      tipoOperacion.push(item.name == 1 ? 'F' : item.name == 2 ? 'CT' : 'C');
      monto.push({
        value: item.value,
        itemStyle: {
          color: item.color
        }});
    }

    this.tipoOperacionBar = {
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      title: {
        text: '%TG Acumulado por Pagador'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: tipoOperacion
      },
      series: [
        {
          label: {
            show: true,
            position: 'inside',
            fontSize: 14
          },
          selectedMode: 'single',
         // name: 'USD',
          type: 'bar',
          data: monto
        },
      ],
    };
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
    else if (tipo == 4)
    {
      for (const item of this.lista) {
        valor += item.saldoTotal 
      }
    }
    else if (tipo == 5) {
      monto = this.lista.filter(x => x.rucPagador.toString() === parametro);
      for (const item of monto) {
        valor += item.saldoTotal
      }
    }

    convertido = parseFloat(valor.toString()).toFixed(2);
    valor = Number(convertido);
    return valor;
  }

}
