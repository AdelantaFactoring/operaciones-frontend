import { Component, OnInit } from '@angular/core';
import { Dashboard } from 'app/shared/models/dashboard/dashboard';

@Component({
  selector: 'app-confirming',
  templateUrl: './confirming.component.html',
  styleUrls: ['./confirming.component.scss']
})
export class ConfirmingComponent implements OnInit {

  public contentHeader: object;

  public lista: Dashboard[] = [];
  constructor() 
  { 
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
  }

  ngOnInit(): void {
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
