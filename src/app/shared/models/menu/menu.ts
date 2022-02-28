import { CoreMenu } from '@core/types';

export const menu: CoreMenu[] = [
  {
    id: 'clientes',
    title: 'Clientes',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'users',
    children: [{
      id: 'solicitudes',
      title: 'Solicitudes',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'clientes/solicitudes'
    },{
      id: 'liquidaciones',
      title: 'Liquidaciones',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    },{
      id: 'desembolsos',
      title: 'Desembolsos',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    },{
      id: 'facturas',
      title: 'Facturas',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    }]
  },
  {
    id: 'comercial',
    title: 'Comercial',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'dollar-sign',
    children: [{
      id: 'clientes',
      title: 'Clientes',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'comercial/clientes'
    },{
      id: 'pagador',
      title: 'Pagador',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'comercial/pagador'
    },{
      id: 'checklist',
      title: 'Check list',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'comercial/checklist'
    },{
      id: 'solicitudes',
      title: 'Solicitudes',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'comercial/solicitudes'
    }]
  },
  {
    id: 'riegos',
    title: 'Riesgos',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'alert-triangle',
    children: [{
      id: 'aprobacionSolicitud',
      title: 'Aprobación de Solicitudes',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    },{
      id: 'aprobarCondicion',
      title: 'Aprobar Condiciones',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    },{
      id: 'aprobarExcepcion',
      title: 'Aprobar Excepciones',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    }]
  },
  {
    id: 'operaciones',
    title: 'Operaciones',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'settings',
    children: [{
      id: 'respuestaPagador',
      title: 'Respuesta Pagador',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    },{
      id: 'registroFactrack',
      title: 'Registro Factrack',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    },{
      id: 'liquidaciones',
      title: 'Liquidaciones',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    }]
  },
  {
    id: 'desembolso',
    title: 'Desembolso',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'credit-card',
    children: [{
      id: 'aprobacionDesembolso',
      title: 'Aprobación desembolsos',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'test/test'
    },{
      id: 'generacionArchivos',
      title: 'Generación Archivos',
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
    type: 'collapsible',
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
  },
  {
    id: 'cobranza',
    title: 'Cobranza',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'collapsible',
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
  }
];
