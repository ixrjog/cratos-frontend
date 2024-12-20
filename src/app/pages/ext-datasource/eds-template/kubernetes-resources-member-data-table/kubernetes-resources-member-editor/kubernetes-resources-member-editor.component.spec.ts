import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourcesMemberEditorComponent } from './kubernetes-resources-member-editor.component';

describe('KubernetesResourceMemberEditorComponent', () => {
  let component: KubernetesResourcesMemberEditorComponent;
  let fixture: ComponentFixture<KubernetesResourcesMemberEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourcesMemberEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourcesMemberEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
