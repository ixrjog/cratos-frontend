import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNetworkCheckCidrComponent } from './global-network-check-cidr.component';

describe('GlobalNetworkCheckCidrComponent', () => {
  let component: GlobalNetworkCheckCidrComponent;
  let fixture: ComponentFixture<GlobalNetworkCheckCidrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalNetworkCheckCidrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNetworkCheckCidrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
