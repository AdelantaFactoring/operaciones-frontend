import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPagosComponent } from './registro-pagos.component';

describe('RegistroPagosComponent', () => {
  let component: RegistroPagosComponent;
  let fixture: ComponentFixture<RegistroPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroPagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
