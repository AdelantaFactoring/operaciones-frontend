import { Component, Input, OnInit } from '@angular/core';
import { ClickType } from '@swimlane/ngx-datatable';
import { LiquidacionCab } from 'app/shared/models/operaciones/liquidacion-cab';
import { UtilsService } from 'app/shared/services/utils.service';
import { promises } from 'dns';
import { dataTool, EChartsOption } from 'echarts';
import { NavContentService } from './nav-content.service';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {

  @Input() paramsURL: any;
  @Input() moneda: any;
  ejecutivoPie: EChartsOption;

  columnaAnio = [];
  columnaMes = [];
  public pagadorLista: LiquidacionCab[] = [];
  public pagadorLista2: LiquidacionCab[] = [];
  public pagadorLista3: LiquidacionCab[] = [];
  public pagadorLista4: LiquidacionCab[] = [];

  public idActivo: number;
  public total: number = 0;
  public selectedRowIds: number[] = [];
  constructor(private utilsService: UtilsService,
    private navContentService: NavContentService) { }

  async ngOnInit(): Promise<void> {
   
    await this.onListarCobranza();
  }

  async onListarCobranza(): Promise<void> {
    console.log('mone', this.moneda);
    
    this.utilsService.blockUIStart('Obteniendo información...');

    const response = await this.navContentService.listar({
      idConsulta: 3,
      // codigoLiquidacion: this.filtroForm.controls.codigoLiquidacion.value,
      // codigoSolicitud: this.filtroForm.controls.codigoSolicitud.value,
      // cliente: this.filtroForm.controls.cliente.value,
      // pagProv: this.filtroForm.controls.pagadorProveedor.value,
      // moneda: this.filtroForm.controls.moneda.value,
      // idTipoOperacion: this.filtroForm.controls.tipoOperacion.value,
      // idEstado: this.filtroForm.controls.estado.value,
      // pagProvDet: this.filtroForm.controls.pagadorProveedorDet.value,
      // nroDocumento: this.filtroForm.controls.nroDocumento.value,
      // fechaOperacion: this.utilsService.formatoFecha_YYYYMMDD(this.filtroForm.controls.fechaOperacion.value) ?? "",
      // search: this.search,
      // pageIndex: this.page,
      // pageSize: this.pageSize
      codigoLiquidacion: '',
      codigoSolicitud: '',
      cliente: 0,
      pagProv: '',
      moneda: this.moneda,
      idTipoOperacion: 0,
      idEstado: 0,
      pagProvDet: '',
      nroDocumento: '',
      fechaOperacion: '',
      search: '',
      pageIndex: 1,
      pageSize: 50
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {
      this.pagadorLista = response;
      this.pagadorLista3 = response;
      
      for (const item of this.pagadorLista) {
        this.total += item.netoConfirmadoTotal;
      }

      for (const item of this.pagadorLista) {
        item.flagSeleccionado = false;
        item.porcentajePagoTotal = (item.netoConfirmadoTotal * 100) / this.total;
      }
      
      this.pagadorLista.forEach(element => {
        if (this.pagadorLista2.find(p => p.usuarioCreacion.toLowerCase() === element.usuarioCreacion.toLowerCase()) == undefined) {
          element.flagSeleccionado = false;
          this.pagadorLista2.push(element);
          this.pagadorLista4.push(element);
        }
      });

      // this.collectionSize = response.length > 0 ? response[0].totalRows : 0; porcentajePagoTotal
      
      this.onPie(this.pagadorLista2);
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

  async onPie(data, tool: boolean = false, valor: string = '', id: number = 0): Promise<void> {
    let data2 = [];
    for (const item of data) {
      let suma = 0;
      for (const row of this.pagadorLista) {
        if (row.usuarioCreacion === item.usuarioCreacion) {
          suma += row.netoConfirmadoTotal;
        }
        if (row.idLiquidacionCab !== id) {
          row.flagSeleccionado = false;
        }
      }

      data2.push({
        value: parseFloat(suma.toString()).toFixed(2),
        name: item.usuarioCreacion,
        selected: item.flagSeleccionado
      })
    } 
    
    console.log('data2', data2);
    
    let formato = '';
    formato = !tool ? '{a} <br/> Ejecutivo: {b} <br/> Monto por Cobrar: {c} ({d}%)' : 
                      '{a} <br/> Ejecutivo: {b} <br/> Monto por Cobrar: {c} ({d}%) <br/> Resaltado: ' + valor

    this.ejecutivoPie = {
      
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
        orient: 'horizontal',
        left: 'left',
        top: '60',
        
      },
      series: [
        {
          selectedMode: 'single',
          radius: [0, '100%'],
          top: '50' + top + '%',
          // top: top + '%',
          name: 'Access From',
          type: 'pie',
          //radius: '100%',
          data: data2,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            alignTo: 'edge',
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            formatter: '{c} \n ({d}%)',
          }
        },
        
      ],
    };
  }

  onPruebaPie(event, texto): void {
    // event.seleccionado = false;
    
    event.data.selected = event.data.selected ? false : true;
    for (const item of this.ejecutivoPie.series[0].data) {
      if (item.name !== event.data.name) {
        item.selected = false;
      }
      // else
      // {
      //   item.selected = true;
      // }
    }
    
    // const val = event.target.value.toLowerCase();
    const val = event.data.selected ? event.name.toLowerCase() : '';

    // Filter Our Data
    const temp = this.pagadorLista3.filter(function (d) {
      return d.usuarioCreacion.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // Update The Rows
    this.pagadorLista = temp;
    this.total = 0;
    for (const item of temp) {
      this.total += item.netoConfirmadoTotal;
    }

    for (const item of this.pagadorLista) {
      item.porcentajePagoTotal = (item.netoConfirmadoTotal * 100) / this.total;
    }
    // Whenever The Filter Changes, Always Go Back To The First Page
    //this.table.offset = 0;
  }

  rowIsSelected(idfila) {
    return this.selectedRowIds.includes(idfila);
  }

  async onRowClick(item): Promise<void> {
    
    let tool: boolean = false;
    let data = [];
    tool = item.flagSeleccionado ? false : true;
    item.flagSeleccionado = tool;
    console.log('flag', item.flagSeleccionado, 'name', item.usuarioCreacion);
    
    for (const it of this.pagadorLista4) {
      if (it.usuarioCreacion === item.usuarioCreacion) {
        //it.flagSeleccionado = item.flagSeleccionado;
        data.push({
          usuarioCreacion: it.usuarioCreacion,
          flagSeleccionado: item.flagSeleccionado
        });
      }
      else
      {
        //it.flagSeleccionado = false;
        data.push({
          usuarioCreacion: it.usuarioCreacion,
          flagSeleccionado: false
        });
      }
    }
    console.log('data', data);
    
    await this.onPie(data, tool, item.netoConfirmadoTotal + ' (' + parseFloat(item.porcentajePagoTotal.toString()).toFixed(2) + '%)', item.idLiquidacionCab);
  }
  
}
