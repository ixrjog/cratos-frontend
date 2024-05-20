import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerAccountComponent } from './server-account.component';

describe('ServerAccountComponent', () => {
  let component: ServerAccountComponent;
  let fixture: ComponentFixture<ServerAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
