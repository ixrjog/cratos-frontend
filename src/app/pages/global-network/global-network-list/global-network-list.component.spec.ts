import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNetworkListComponent } from './global-network-list.component';

describe('GlobalNetworkListComponent', () => {
  let component: GlobalNetworkListComponent;
  let fixture: ComponentFixture<GlobalNetworkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalNetworkListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNetworkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
