import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesembolsoComponent } from './desembolso.component';

describe('DesembolsoComponent', () => {
  let component: DesembolsoComponent;
  let fixture: ComponentFixture<DesembolsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesembolsoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesembolsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
