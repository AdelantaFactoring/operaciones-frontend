import { LiquidacionCab } from "../operaciones/liquidacion-cab";
import { LiquidacionDet } from "../operaciones/liquidacion-det";
import { LiquidacionCabSustento } from "../operaciones/LiquidacionCab-Sustento";

export class Dashboard {
    empresaCuenta: string;
    liquidacionCab: LiquidacionCab[];
    liquidacionDet: LiquidacionDet[];
    liquidacionCabSustento: LiquidacionCabSustento[];
    //liquidacionCabSeleccionados: LiquidacionCabSeleccionados[];
    liquidacionDevolucion: string;
    liquidacionDevolucionSustento: null;
    liquidacionDocumentoCab: null;
    liquidacionDocumentoDet: null;
  }
  