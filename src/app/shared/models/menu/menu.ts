import { CoreMenu } from '@core/types';

export const menu: CoreMenu[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'package',
    children: [
      {
        id: '18',
        title: 'Tablero',
        // translate: 'MENU.DASHBOARD.ANALYTICS',
        type: 'collapsible',
        icon: 'package',
        //url: 'dashboard/pendientepago',
        children: [
          {
            id: '18',
            title: 'Power BI',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/powerbi',
            icon: 'circle',
            //openInNewTab: true
          },
          {
            id: '18',
            title: 'KPI',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/kpi',
            icon: 'circle',
            //openInNewTab: true
          },
          {
            id: '18',
            title: 'Global PEN',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/pendientepago/1',
            icon: 'circle',
            //openInNewTab: true
          },
          {
            id: '18',
            title: 'Ejecutivo PEN',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/ejecutivo/1',
            icon: 'circle',
          },
          {
            id: '18',
            title: 'Proyectado PEN',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/proyectado/1',
            icon: 'circle',
          },
          {
            id: '18',
            title: 'Global USD',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/pendientepago/2',
            icon: 'circle',
          },
          {
            id: '18',
            title: 'Ejecutivo USD',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/ejecutivo/2',
            icon: 'circle',
          },
          {
            id: '18',
            title: 'Proyectado USD',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/proyectado/2',
            icon: 'circle',
          },
          {
            id: '18',
            title: 'Acum. Ejecutivo',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/acumEjecutivo',
            icon: 'circle',
          },
          {
            id: '18',
            title: 'Acum. Pagador',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/acumPagador',
            icon: 'circle',
          },
          {
            id: '18',
            title: 'Sector',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/sector',
            icon: 'circle',
          },
          {
            id: '18',
            title: 'Vigente',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/vigente',
            icon: 'circle',
          },
          {
            id: '18',
            title: 'Vencido',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/vencido',
            icon: 'circle',
          },
          {
            id: '18',
            title: 'Confirming',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'dashboard/confirming',
            icon: 'circle',
          },
        ]
      },
    ]
  },
  {
    id: 'maestros',
    title: 'Catálogos',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'package',
    children: [
      {
        id: '19',
        title: 'Maestros',
        // translate: 'MENU.DASHBOARD.ANALYTICS',
        type: 'collapsible',
        icon: 'settings',
        children: [
          {
            id: '19',
            title: 'Moneda',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'catalogos/maestros/moneda',
            icon: 'circle',
            //openInNewTab: true
          },
          {
            id: '19',
            title: 'Concepto (C. Pago)',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'catalogos/maestros/conceptoComprobante',
            icon: 'circle',
            //openInNewTab: true
          },
          {
            id: '19',
            title: 'Parámetros Generales',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'catalogos/maestros/parametros',
            icon: 'circle',
            //openInNewTab: true
          },
          {
            id: '19',
            title: 'N° Comprobante (Factura)',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'catalogos/maestros/correlativoFactura',
            icon: 'circle',
            //openInNewTab: true
          },
          {
            id: '19',
            title: 'N° Comprobante (N. Crédito)',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'catalogos/maestros/correlativoNC',
            icon: 'circle',
            //openInNewTab: true
          },
          {
            id: '19',
            title: 'N° Comprobante (N. Débito)',
            //translate: 'MENU.PAGES.AUTH.LOGIN1',
            type: 'item',
            url: 'catalogos/maestros/correlativoND',
            icon: 'circle',
            //openInNewTab: true
          },
        ]
      },
      {
        id: '20',
        title: 'Tipo Cambio',
        // translate: 'MENU.DASHBOARD.ANALYTICS',
        type: 'item',
        icon: 'refresh-cw',
        url: 'catalogos/tipo-cambio'
      },
      {
        id: '20',
        title: 'Gastos por Mora',
        // translate: 'MENU.DASHBOARD.ANALYTICS',
        type: 'item',
        icon: 'dollar-sign',
        url: 'catalogos/gastosMora'
      }
    ]
  },
  {
    id: 'comercial',
    title: 'Comercial',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'dollar-sign',
    children: [{
      id: '1',
      title: 'Clientes',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'users',
      url: 'comercial/clientes'
    }, {
      id: '2',
      title: 'Pagadores',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'user-check',
      url: 'comercial/pagador'
    }, {
      id: '3',
      title: 'Cliente-Pagador',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'refresh-cw',
      url: 'comercial/clientepagador'
    }, {
      id: '4',
      title: 'Check list',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'check-square',
      url: 'comercial/checklist'
    }, {
      id: '5',
      title: 'Solicitudes',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'archive',
      url: 'comercial/solicitudes'
    }]
  },
  {
    id: 'operaciones',
    title: 'Operaciones',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'settings',
    children: [{
      id: '6',
      title: 'Respuesta Pagador',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'navigation',
      url: 'operaciones/respuestaPagador'
    }, {
      id: '7',
      title: 'Consulta Factrack',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'search',
      url: 'operaciones/consultaFactrack'
    }, {
      id: '17',
      title: 'Cavali',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'radio',
      url: 'operaciones/cavali'
    }]
  },
  {
    id: 'liquidacion',
    title: 'Liquidación',
    type: 'section',
    icon: 'dollar-sign',
    children: [{
      id: '8',
      title: 'Generar',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'layers',
      url: 'operaciones/generarLiquidacion'
    }, {
      id: '9',
      title: 'Aprobación',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'check',
      url: 'operaciones/liquidaciones/true'
    }, {
      id: '16',
      title: 'Historial',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'book',
      url: 'operaciones/liquidaciones/false'
    }]
  },
  {
    id: 'aprobacion',
    title: 'Desembolsos',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'credit-card',
    children: [{
      id: '10',
      title: 'Aprobación',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'check',
      url: 'desembolso/aprobacion'
    }]
  },
  {
    id: 'cobranza',
    title: 'Cobranza',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'dollar-sign',
    children: [{
      id: '11',
      title: 'Registro de Pagos',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'file-plus',
      url: 'cobranza/registroPagos'
    }, {
      id: '12',
      title: 'Devoluciones',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'rotate-ccw',
      url: 'cobranza/devoluciones'
    }]
  },
  {
    id: 'facturacion',
    title: 'Facturación',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'file-text',
    children: [{
      id: '13',
      title: 'Documentos',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'file-text',
      url: 'facturacion/documentos'
    }]
  },
  {
    id: 'seguridad',
    title: 'Seguridad',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'lock',
    children: [{
      id: '14',
      title: 'Usuario',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'user',
      url: 'seguridad/usuario'
    }, {
      id: '15',
      title: 'Perfil',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'tag',
      url: 'seguridad/perfil'
    }]
  }
];
