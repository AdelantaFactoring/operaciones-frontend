import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ContentHeader} from "../../../../layout/components/content-header/content-header.component";
import {SolicitudDet} from "../../../../shared/models/comercial/solicitudDet";
import {SolicitudCab} from "../../../../shared/models/comercial/solicitudCab";

@Component({
  selector: 'app-consulta-factrack-detalle',
  templateUrl: './consulta-factrack-detalle.component.html',
  styleUrls: ['./consulta-factrack-detalle.component.scss']
})
export class ConsultaFactrackDetalleComponent implements OnInit, OnChanges {
  @Input() solicitud: SolicitudCab;
  @Output() regresarEvent: EventEmitter<unknown> = new EventEmitter<unknown>();
  data: SolicitudDet[] = [];
  contentHeader: ContentHeader;

  constructor() {
    this.contentHeader = {
      headerTitle: 'Consulta Factrack - Detalle',
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
            name: 'Operaciones',
            isLink: false
          },
          {
            name: 'Consulta Factrack',
            isLink: false
          },
          {
            name: 'Detalle',
            isLink: false
          }
        ]
      }
    };
  }


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.solicitud.previousValue !== changes.solicitud.currentValue) {
      this.data = this.solicitud.solicitudDet;
    }
  }

  onBuscar({target}: Event) {
    const _value = target['value'].toLowerCase();
    this.data = this.solicitud?.solicitudDet.filter(f =>
      Object.values(f).some(
        value => String(value)
          .toLowerCase()
          .includes(_value)
      )
    );
  }

  onRegresar() {
    this.regresarEvent.emit();
  }
}
