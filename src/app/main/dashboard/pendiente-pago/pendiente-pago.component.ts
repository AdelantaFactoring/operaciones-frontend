import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LiquidacionCab } from 'app/shared/models/operaciones/liquidacion-cab';
import { UtilsService } from 'app/shared/services/utils.service';
import { EChartsOption } from 'echarts';
import { PendientePagoService } from './pendiente-pago.service';

@Component({
  selector: 'app-pendiente-pago',
  templateUrl: './pendiente-pago.component.html',
  styleUrls: ['./pendiente-pago.component.scss']
})
export class PendientePagoComponent implements OnInit {

  public moneda: string = 'PEN';
  public contentHeader: object;
  public filtroForm: FormGroup;

  public activeId: number = 1;
  public optUsuario = [];
  ejecutivoPie: EChartsOption;

  columnaAnio = [];
  columnaMes = [];
  public pagadorLista: LiquidacionCab[] = [];
  public pagadorLista2: LiquidacionCab[] = [];
  public pagadorLista3: LiquidacionCab[] = [];
  public pagadorLista4: LiquidacionCab[] = [];
  public total: number = 0;
  public selectedRowIds: number[] = [];

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private pendientePagoService: PendientePagoService) 
  { 
    this.contentHeader = {
      headerTitle: 'Pendiente Pago',
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
            name: 'Global',
            isLink: false
          }
        ]
      }
    };

    this.filtroForm = this.formBuilder.group({
      pagador: [],
      usuario: []
    });
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(s => {
      this.moneda = s.moneda;
      this.onListarCobranza();
      // this.onListarLiquidaciones();
      
      this.contentHeader = {
        headerTitle: 'Pendiente Pago',
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
              name: 'Global - ' + this.moneda,
              isLink: false
            }
          ]
        }
      }
    });
  }

  async onListarCobranza(): Promise<void> {
    this.pagadorLista2 = [];
    this.pagadorLista4 = [];
    
    this.utilsService.blockUIStart('Obteniendo información...');

    const response = await this.pendientePagoService.listar({
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
      cliente: 0,
      pagProv: '',
      moneda: this.moneda,
      pagProvDet: '',
      fechaDesde: '',
      fechaHasta: ''
    }).toPromise().catch(error => {
      this.utilsService.showNotification('An internal error has occurred', 'Error', 3);
    });

    if (response) {
      this.pagadorLista = response;
      this.pagadorLista3 = response;
      
      for (const item of this.pagadorLista) {
        this.total += item.saldoTotal;
      }

      for (const item of this.pagadorLista) {
        item.flagSeleccionado = false;
        item.porcentajePagoTotal = (item.saldoTotal * 100) / this.total;
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
        if (row.usuarioNombreCompleto === item.usuarioNombreCompleto) {
          suma += row.saldoTotal;
        }
        if (row.idLiquidacionCab !== id) {
          row.flagSeleccionado = false;
        }
      }

      data2.push({
        value: parseFloat(suma.toString()).toFixed(2),
        name: item.usuarioNombreCompleto,
        selected: item.flagSeleccionado
      })
    } 
    
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
        type: 'scroll',
        orient: 'vertical',
        // left: 'left',
        // top: '60',
        right: 10,
        top: '20' + top + '%',
        bottom: 20,
        data: data.legendData
        
      },
      series: [
        {
          selectedMode: 'single',
          // radius: [0, '100%'],
          radius: '55%',
          top: '10' + top + '%',
          // top: top + '%',
          name: 'Access From',
          type: 'pie',
          center: ['40%', '50%'],
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
      return d.usuarioNombreCompleto.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // Update The Rows
    this.pagadorLista = temp;
    this.total = 0;
    for (const item of temp) {
      this.total += item.saldoTotal;
    }

    for (const item of this.pagadorLista) {
      item.porcentajePagoTotal = (item.saldoTotal * 100) / this.total;
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
    
    for (const it of this.pagadorLista4) {
      if (it.idEjecutivo === item.idEjecutivo) {
        //it.flagSeleccionado = item.flagSeleccionado;
        data.push({
          usuarioNombreCompleto: it.usuarioNombreCompleto,
          flagSeleccionado: item.flagSeleccionado
        });
      }
      else
      {
        //it.flagSeleccionado = false;
        data.push({
          usuarioNombreCompleto: it.usuarioNombreCompleto,
          flagSeleccionado: false
        });
      }
    }
    
    // console.log('data', data, '\n pag4', this.pagadorLista4, '\n item', item);
    
    await this.onPie(data, tool, item.saldoTotal + ' (' + parseFloat(item.porcentajePagoTotal.toString()).toFixed(2) + '%)', item.idLiquidacionCab);
  }

}