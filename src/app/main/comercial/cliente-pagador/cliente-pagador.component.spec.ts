import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientePagadorComponent } from './cliente-pagador.component';

describe('ClientePagadorComponent', () => {
  let component: ClientePagadorComponent;
  let fixture: ComponentFixture<ClientePagadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientePagadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientePagadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
