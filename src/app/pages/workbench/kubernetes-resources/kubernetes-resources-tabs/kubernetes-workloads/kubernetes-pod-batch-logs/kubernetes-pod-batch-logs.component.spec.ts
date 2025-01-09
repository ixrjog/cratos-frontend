import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesPodBatchLogsComponent } from './kubernetes-pod-batch-logs.component';

describe('KubernetesPodBatchLogsComponent', () => {
  let component: KubernetesPodBatchLogsComponent;
  let fixture: ComponentFixture<KubernetesPodBatchLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesPodBatchLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesPodBatchLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
