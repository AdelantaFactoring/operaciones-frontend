import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelativoNCComponent } from './correlativo-nc.component';

describe('CorrelativoNCComponent', () => {
  let component: CorrelativoNCComponent;
  let fixture: ComponentFixture<CorrelativoNCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrelativoNCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelativoNCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
