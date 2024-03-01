import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsInstanceCardComponent } from './eds-instance-card.component';

describe('EdsInstanceCardComponent', () => {
  let component: EdsInstanceCardComponent;
  let fixture: ComponentFixture<EdsInstanceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsInstanceCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsInstanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
