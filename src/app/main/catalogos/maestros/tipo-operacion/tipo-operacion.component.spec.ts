import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoOperacionComponent } from './tipo-operacion.component';

describe('TipoOperacionComponent', () => {
  let component: TipoOperacionComponent;
  let fixture: ComponentFixture<TipoOperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoOperacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoOperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
