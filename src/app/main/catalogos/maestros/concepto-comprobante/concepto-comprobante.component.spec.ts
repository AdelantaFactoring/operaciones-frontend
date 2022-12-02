import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptoComprobanteComponent } from './concepto-comprobante.component';

describe('ConceptoComprobanteComponent', () => {
  let component: ConceptoComprobanteComponent;
  let fixture: ComponentFixture<ConceptoComprobanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptoComprobanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptoComprobanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
