import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaPagadorDetalleComponent } from './respuesta-pagador-detalle.component';

describe('RespuestaPagadorDetalleComponent', () => {
  let component: RespuestaPagadorDetalleComponent;
  let fixture: ComponentFixture<RespuestaPagadorDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespuestaPagadorDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestaPagadorDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
