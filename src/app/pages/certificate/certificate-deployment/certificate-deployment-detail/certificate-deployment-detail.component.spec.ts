import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateDeploymentDetailComponent } from './certificate-deployment-detail.component';

describe('CertificateDeploymentDetailComponent', () => {
  let component: CertificateDeploymentDetailComponent;
  let fixture: ComponentFixture<CertificateDeploymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateDeploymentDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateDeploymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
