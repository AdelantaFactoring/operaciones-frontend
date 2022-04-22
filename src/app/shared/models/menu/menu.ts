import { CoreMenu } from '@core/types';

export const menu: CoreMenu[] = [
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
    id: 'aprobacion',
    title: 'Desembolsos',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'credit-card',
    children: [{
      id: 'aprobacion',
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
      id: 'registroPagos',
      title: 'Registro de Pagos',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'file-plus',
      //url: 'cobranza/registroPagos'
      url: 'pages/miscellaneous/coming-soon'
    },{
      id: 'devoluciones',
      title: 'Devoluciones',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'rotate-ccw',
      url: 'pages/miscellaneous/coming-soon'
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
      url: 'pages/miscellaneous/coming-soon'
    },{
      id: 'consultaFactura',
      title: 'Consuta de Factura',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'circle',
      url: 'pages/miscellaneous/coming-soon'
    }]
  },
  {
    id: 'seguridad',
    title: 'Seguridad',
    // translate: 'MENU.DASHBOARD.COLLAPSIBLE',
    type: 'section',
    icon: 'lock',
    children: [{
      id: 'usuario',
      title: 'Usuario',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'user',
      url: 'pages/miscellaneous/coming-soon'
    },{
      id: 'perfil',
      title: 'Perfil',
      // translate: 'MENU.DASHBOARD.ANALYTICS',
      type: 'item',
      icon: 'tag',
      url: 'pages/miscellaneous/coming-soon'
    }]
  }
];
