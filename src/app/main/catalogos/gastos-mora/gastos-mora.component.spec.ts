import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosMoraComponent } from './gastos-mora.component';

describe('GastosMoraComponent', () => {
  let component: GastosMoraComponent;
  let fixture: ComponentFixture<GastosMoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GastosMoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GastosMoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
