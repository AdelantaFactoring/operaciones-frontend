import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCambioComponent } from './tipo-cambio.component';

describe('TipoCambioComponent', () => {
  let component: TipoCambioComponent;
  let fixture: ComponentFixture<TipoCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
