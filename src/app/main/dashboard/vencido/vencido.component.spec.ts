import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VencidoComponent } from './vencido.component';

describe('VencidoComponent', () => {
  let component: VencidoComponent;
  let fixture: ComponentFixture<VencidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VencidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VencidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
