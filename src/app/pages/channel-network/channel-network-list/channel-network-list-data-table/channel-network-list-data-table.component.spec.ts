import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelNetworkListDataTableComponent } from './channel-network-list-data-table.component';

describe('ChannelNetworkListDataTableComponent', () => {
  let component: ChannelNetworkListDataTableComponent;
  let fixture: ComponentFixture<ChannelNetworkListDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelNetworkListDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelNetworkListDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
