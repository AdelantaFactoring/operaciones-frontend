import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VigenteComponent } from './vigente.component';

describe('VigenteComponent', () => {
  let component: VigenteComponent;
  let fixture: ComponentFixture<VigenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VigenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VigenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
