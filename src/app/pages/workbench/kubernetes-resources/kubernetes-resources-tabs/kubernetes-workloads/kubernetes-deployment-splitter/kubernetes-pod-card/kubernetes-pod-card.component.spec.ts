import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesPodCardComponent } from './kubernetes-pod-card.component';

describe('KubernetesPodCardComponent', () => {
  let component: KubernetesPodCardComponent;
  let fixture: ComponentFixture<KubernetesPodCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesPodCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesPodCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
