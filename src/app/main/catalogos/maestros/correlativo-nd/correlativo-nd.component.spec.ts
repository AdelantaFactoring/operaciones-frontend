import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelativoNDComponent } from './correlativo-nd.component';

describe('CorrelativoNDComponent', () => {
  let component: CorrelativoNDComponent;
  let fixture: ComponentFixture<CorrelativoNDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrelativoNDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelativoNDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
