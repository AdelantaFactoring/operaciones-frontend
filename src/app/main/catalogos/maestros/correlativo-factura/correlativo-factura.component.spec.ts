import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelativoFacturaComponent } from './correlativo-factura.component';

describe('CorrelativoFacturaComponent', () => {
  let component: CorrelativoFacturaComponent;
  let fixture: ComponentFixture<CorrelativoFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrelativoFacturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelativoFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
