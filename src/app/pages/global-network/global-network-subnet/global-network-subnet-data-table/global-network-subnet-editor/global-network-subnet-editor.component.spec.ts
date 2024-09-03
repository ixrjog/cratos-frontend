import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNetworkSubnetEditorComponent } from './global-network-subnet-editor.component';

describe('GlobalNetworkSubnetEditorComponent', () => {
  let component: GlobalNetworkSubnetEditorComponent;
  let fixture: ComponentFixture<GlobalNetworkSubnetEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalNetworkSubnetEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNetworkSubnetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
