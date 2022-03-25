import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesGrillaComponent } from './solicitudes-grilla.component';

describe('SolicitudesGrillaComponent', () => {
  let component: SolicitudesGrillaComponent;
  let fixture: ComponentFixture<SolicitudesGrillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesGrillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesGrillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
