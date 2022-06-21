import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPermisoComponent } from './lista-permiso.component';

describe('ListaPermisoComponent', () => {
  let component: ListaPermisoComponent;
  let fixture: ComponentFixture<ListaPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPermisoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
