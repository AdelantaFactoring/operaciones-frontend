import {CoreMenu} from '@core/types';

export const menu: CoreMenu[] = [
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
    }]
  },
  {
    id:'liquidacion',
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
