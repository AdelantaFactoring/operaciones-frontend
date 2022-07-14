import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CavaliComponent } from './cavali.component';

describe('CavaliComponent', () => {
  let component: CavaliComponent;
  let fixture: ComponentFixture<CavaliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CavaliComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CavaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
