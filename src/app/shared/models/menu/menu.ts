import { CoreMenu } from '@core/types';

export const menu: CoreMenu[] = [
  // {
  //   id: 'clientes',
  //   title: 'Clientes',
  //   // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
  //   type: 'collapsible',
  //   icon: 'users',
  //   children: [{
  //     id: 'solicitudes',
  //     title: 'Solicitudes',
  //     // translate: 'MENU.DASHBOARD.ANALYTICS',
  //     type: 'item',
  //     icon: 'circle',
  //     url: 'clientes/solicitudes'
  //   },{
  //     id: 'liquidaciones',
  //     title: 'Liquidaciones',
  //     // translate: 'MENU.DASHBOARD.ANALYTICS',
  //     type: 'item',
  //     icon: 'circle',
  //     url: 'test/test'
  //   },{
  //     id: 'desembolsos',
  //     title: 'Desembolsos',
  //     // translate: 'MENU.DASHBOARD.ANALYTICS',
  //     type: 'item',
  //     icon: 'circle',
  //     url: 'test/test'
  //   },{
  //     id: 'facturas',
  //     title: 'Facturas',
  //     // translate: 'MENU.DASHBOARD.ANALYTICS',
  //     type: 'item',
  //     icon: 'circle',
  //     url: 'test/test'
  //   }]
  // },
  {
    id: 'comercial',
    title: 'Comercial',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'dollar-sign',
    children: [{
      id: 'clientes',
      title: 'Clientes',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'users',
      url: 'comercial/clientes'
    },{
      id: 'pagador',
      title: 'Pagadores',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'user-check',
      url: 'comercial/pagador'
    },{
      id: 'clienteapagador',
      title: 'Cliente-Pagador',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'refresh-cw',
      url: 'comercial/clientepagador'
    },{
      id: 'checklist',
      title: 'Check list',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'check-square',
      url: 'comercial/checklist'
    },{
      id: 'solicitudes',
      title: 'Solicitudes',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'archive',
      url: 'comercial/solicitudes'
    }]
  },
  // {
  //   id: 'riegos',
  //   title: 'Riesgos',
  //   // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
  //   type: 'collapsible',
  //   icon: 'alert-triangle',
  //   children: [{
  //     id: 'aprobacionSolicitud',
  //     title: 'Aprobación de Solicitudes',
  //     // translate: 'MENU.DASHBOARD.ANALYTICS',
  //     type: 'item',
  //     icon: 'circle',
  //     url: 'test/test'
  //   },{
  //     id: 'aprobarCondicion',
  //     title: 'Aprobar Condiciones',
  //     // translate: 'MENU.DASHBOARD.ANALYTICS',
  //     type: 'item',
  //     icon: 'circle',
  //     url: 'test/test'
  //   },{
  //     id: 'aprobarExcepcion',
  //     title: 'Aprobar Excepciones',
  //     // translate: 'MENU.DASHBOARD.ANALYTICS',
  //     type: 'item',
  //     icon: 'circle',
  //     url: 'test/test'
  //   }]
  // },
  {
    id: 'operaciones',
    title: 'Operaciones',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'settings',
    children: [{
      id: 'respuestaPagador',
      title: 'Respuesta Pagador',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'navigation',
      url: 'operaciones/respuestaPagador'
    },{
      id: 'consultaFactrack',
      title: 'Consulta Factrack',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'search',
      url: 'operaciones/consultaFactrack'
    },{
      id: 'liquidaciones',
      title: 'Liquidaciones',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'dollar-sign',
      url: 'operaciones/liquidaciones'
    }]
  },
  {
    id: 'desembolso',
    title: 'Desembolsos',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'credit-card',
    children: [{
      id: 'aprobacionDesembolso',
      title: 'Aprobación',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'check',
      url: 'desembolso/desembolso'
    }]
  },
  {
    id: 'cobranza',
    title: 'Cobranza',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'dollar-sign',
    children: [{
      id: 'estadFactura',
      title: 'Estado de Factura',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    },{
      id: 'devoluciones',
      title: 'Devoluciones',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    }]
  },
  {
    id: 'facturacion',
    title: 'Facturación',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'file-text',
    children: [{
      id: 'emitirFactura',
      title: 'Emitir Factura',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    },{
      id: 'consultaFactura',
      title: 'Consuta de Factura',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    }]
  }
];
