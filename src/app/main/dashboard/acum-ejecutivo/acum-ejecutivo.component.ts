import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { DataBarra } from 'app/shared/models/dashboard/DashBarra';
import { Dashboard } from 'app/shared/models/dashboard/dashboard';
import { UtilsService } from 'app/shared/services/utils.service';
import { EChartsOption } from 'echarts';
import { AcumEjecutivoService } from './acum-ejecutivo.service';

// class dataBar {
//   ejecutivo: string;
//   dataPen: any;
//   dataUsd: any;
// }

@Component({
  selector: 'app-acum-ejecutivo',
  templateUrl: './acum-ejecutivo.component.html',
  styleUrls: ['./acum-ejecutivo.component.scss']
})
export class AcumEjecutivoComponent implements OnInit {

  public contentHeader: object;
  public filtroForm: FormGroup;
  ejecutivoPie: EChartsOption;
  ejecutivoBar: EChartsOption;
  seleccionado: boolean = false;
  public acumulado: number;
  public oldAcumulado: number;
  public lista: Dashboard[] = [];

  public moneda = [];
  public dataB: DataBarra[] = [];
  public dataUsd = [];
  public filterFecha: any;
  constructor(private utilsService: UtilsService,
    private acumEjecutivo: AcumEjecutivoService,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder) {
    this.contentHeader = {
      headerTitle: 'Acumulado por ejecutivo',
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
            name: 'Acum. Ejecutivo',
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

  async onListar(): Promise<void> {
    this.moneda = [];

    this.utilsService.blockUIStart('Obteniendo información...');

    const response = await this.acumEjecutivo.listarDash({
      idMoneda: 0,
      idEjecutivo: 0,
      fechaHasta: this.utilsService.formatoFecha_YYYYMM(this.filterFecha.hasta),
      //fechaHasta: 202210
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {
      
      this.lista = response;

      for (const item of response) {
        if (this.moneda.find(x => x.name.toLowerCase() === item.codMoneda.toLowerCase()) === undefined) {
          this.moneda.push({
            name: item.codMoneda,
            value: this.onSuma(item.codMoneda),
            selected: false
          });
        }
      }

      this.onPie(this.moneda);
      this.onBarra(this.lista);

    }

    this.utilsService.blockUIStop();
  }

  async onPie(moneda, velor = 0): Promise<void> {
    this.acumulado = 0;
    this.oldAcumulado = 0;
    for (const item of moneda) {
      this.acumulado += item.value;
      this.oldAcumulado += item.value;
    }

    let formato = '';
    formato = this.seleccionado ? '{a} <br/> Moneda: {b} <br/> Monto por Cobrar: {c} ({d}%)' :
      '{a} <br/> Moneda: {b} <br/> Monto por Cobrar: {c} ({d}%) <br/> Resaltado: '

    this.ejecutivoPie = {
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      title: {
        text: 'Ejecutivo Pie',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: formato
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        // left: 'left',
        // top: '60',
        right: 10,
        top: '20' + top + '%',
        bottom: 20,
        data: moneda.moneda

      },
      series: [
        {
          selectedMode: 'single',
          radius: [80, '75%'],
          // radius: '55%',
          top: '10' + top + '%',
          // top: top + '%',
          name: 'Access From',
          type: 'pie',
          center: ['40%', '50%'],
          //radius: '100%',
          data: moneda,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            alignTo: 'labelLine',
            minMargin: 5,
            edgeDistance: 50,
            lineHeight: 15,
            formatter: '{c} \n ({d}%)',
          }
        },

      ],
    };
  }

  async onBarra(data: Dashboard[]): Promise<void> {
    // this.dataPen = [];
    // this.dataUsd = [];
    this.dataB = [];

    for (const item of data) {
      if (this.dataB.find(x => x.ejecutivo.toLowerCase() === item.usuario.toLowerCase()) === undefined) {
        this.dataB.push({
          ejecutivo: item.usuario,
          dataPen: [],
          dataUsd: [],
          pagador: '',
          rucPagador : ''
        });
      }
    }

    let valorPen: number = 0;
    let valorUsd: number = 0;

    this.dataB.forEach(el => {
      valorPen = 0;
      valorUsd = 0;
      for (const item of data) {
        if (item.usuario == el.ejecutivo) {
          valorPen = item.codMoneda == 'PEN' ? valorPen + item.saldoTotal : valorPen + 0;
          valorUsd = item.codMoneda == 'USD' ? valorUsd + item.saldoTotal : valorUsd + 0;
        }
      }
      el.dataPen.push(valorPen);
      el.dataUsd.push(valorUsd);
    });

    let pen = [];
    let usd = [];
    let ejecutivo = [];

    for (const item of this.dataB) {
      ejecutivo.push(item.ejecutivo);
      pen.push(item.dataPen[0]);
      usd.push(item.dataUsd[0])
    }
    
    this.ejecutivoBar = {
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      title: {
        text: '%TG Acumulado por Ejecutivo'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        // type: 'scroll',
        // orient: 'vertical',
        // // left: 'left',
        // // top: '60',
        // right: 10,
        // top: '20' + top + '%',
        // bottom: 20,
        // data: data.moneda

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
        data: ejecutivo
      },
      series: [
        {
          selectedMode: 'single',
          name: 'USD',
          type: 'bar',
          data: usd
        },
        {
          selectedMode: 'single',
          name: 'PEN',
          type: 'bar',
          data: pen
        },

      ],
    };
  }

  onPruebaPie(event, tipo): void {
   if (tipo == 1) {
    event.data.selected = event.data.selected ? false : true;
    this.acumulado = event.data.selected ? event.value : this.oldAcumulado;
    for (const item of this.ejecutivoPie.series[0].data) {
      if (item.name !== event.data.name) {
        item.selected = false;
      }
    }
   } 
  }

  onSuma(moneda: string): Number {
    let monto = [];
    let valor: number = 0;
    let convertido: string;

    monto = this.lista.filter(x => x.codMoneda === moneda);
    for (const item of monto) {
      valor += item.saldoTotal
    }
    convertido = parseFloat(valor.toString()).toFixed(2);
    valor = Number(convertido);
    return valor;
  }
}
