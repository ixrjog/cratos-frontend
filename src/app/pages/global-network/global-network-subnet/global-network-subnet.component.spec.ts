import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNetworkSubnetComponent } from './global-network-subnet.component';

describe('GlobalNetworkSubnetComponent', () => {
  let component: GlobalNetworkSubnetComponent;
  let fixture: ComponentFixture<GlobalNetworkSubnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalNetworkSubnetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNetworkSubnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
