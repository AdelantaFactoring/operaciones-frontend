import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcumEjecutivoComponent } from './acum-ejecutivo.component';

describe('AcumEjecutivoComponent', () => {
  let component: AcumEjecutivoComponent;
  let fixture: ComponentFixture<AcumEjecutivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcumEjecutivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcumEjecutivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
