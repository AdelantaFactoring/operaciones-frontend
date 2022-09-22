import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcumPagadorComponent } from './acum-pagador.component';

describe('AcumPagadorComponent', () => {
  let component: AcumPagadorComponent;
  let fixture: ComponentFixture<AcumPagadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcumPagadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcumPagadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
