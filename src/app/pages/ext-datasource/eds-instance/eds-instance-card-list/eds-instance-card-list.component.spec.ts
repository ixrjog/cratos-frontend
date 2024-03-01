import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdsInstanceCardListComponent } from './eds-instance-card-list.component';

describe('EdsInstanceCardListComponent', () => {
  let component: EdsInstanceCardListComponent;
  let fixture: ComponentFixture<EdsInstanceCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdsInstanceCardListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdsInstanceCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
