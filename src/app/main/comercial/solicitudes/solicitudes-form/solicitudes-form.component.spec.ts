import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesFormComponent } from './solicitudes-form.component';

describe('SolicitudesFormComponent', () => {
  let component: SolicitudesFormComponent;
  let fixture: ComponentFixture<SolicitudesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
