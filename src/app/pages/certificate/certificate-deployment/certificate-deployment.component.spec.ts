import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateDeploymentComponent } from './certificate-deployment.component';

describe('CertificateDeploymentComponent', () => {
  let component: CertificateDeploymentComponent;
  let fixture: ComponentFixture<CertificateDeploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateDeploymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
