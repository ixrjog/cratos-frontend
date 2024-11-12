import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KubernetesResourceMemberEditorComponent } from './kubernetes-resource-member-editor.component';

describe('KubernetesResourceMemberEditorComponent', () => {
  let component: KubernetesResourceMemberEditorComponent;
  let fixture: ComponentFixture<KubernetesResourceMemberEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KubernetesResourceMemberEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KubernetesResourceMemberEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
