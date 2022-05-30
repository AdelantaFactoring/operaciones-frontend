import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarLiquidacionComponent } from './generar-liquidacion.component';

describe('GenerarLiquidacionComponent', () => {
  let component: GenerarLiquidacionComponent;
  let fixture: ComponentFixture<GenerarLiquidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarLiquidacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarLiquidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
