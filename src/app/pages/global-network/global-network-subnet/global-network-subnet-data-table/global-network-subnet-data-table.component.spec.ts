import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNetworkSubnetDataTableComponent } from './global-network-subnet-data-table.component';

describe('GlobalNetworkSubnetDataTableComponent', () => {
  let component: GlobalNetworkSubnetDataTableComponent;
  let fixture: ComponentFixture<GlobalNetworkSubnetDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalNetworkSubnetDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNetworkSubnetDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
