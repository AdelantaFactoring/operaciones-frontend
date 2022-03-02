import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaPagadorComponent } from './respuesta-pagador.component';

describe('RespuestaPagadorComponent', () => {
  let component: RespuestaPagadorComponent;
  let fixture: ComponentFixture<RespuestaPagadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespuestaPagadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestaPagadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
