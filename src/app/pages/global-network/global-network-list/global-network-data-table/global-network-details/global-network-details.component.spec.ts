import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNetworkDetailsComponent } from './global-network-details.component';

describe('GlobalNetworkDetailsComponent', () => {
  let component: GlobalNetworkDetailsComponent;
  let fixture: ComponentFixture<GlobalNetworkDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalNetworkDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNetworkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
