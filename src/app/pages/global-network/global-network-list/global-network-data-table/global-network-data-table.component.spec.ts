import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNetworkDataTableComponent } from './global-network-data-table.component';

describe('GlobalNetworkDataTableComponent', () => {
  let component: GlobalNetworkDataTableComponent;
  let fixture: ComponentFixture<GlobalNetworkDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalNetworkDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNetworkDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
