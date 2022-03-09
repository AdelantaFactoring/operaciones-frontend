import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaFactrackComponent } from './consulta-factrack.component';

describe('ConsultaFactrackComponent', () => {
  let component: ConsultaFactrackComponent;
  let fixture: ComponentFixture<ConsultaFactrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaFactrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaFactrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
