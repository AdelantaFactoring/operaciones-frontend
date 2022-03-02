import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroFactrackComponent } from './registro-factrack.component';

describe('RegistroFactrackComponent', () => {
  let component: RegistroFactrackComponent;
  let fixture: ComponentFixture<RegistroFactrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroFactrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroFactrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
