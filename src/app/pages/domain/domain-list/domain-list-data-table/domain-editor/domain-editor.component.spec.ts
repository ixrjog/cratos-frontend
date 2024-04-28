import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainEditorComponent } from './domain-editor.component';

describe('DomainEditorComponent', () => {
  let component: DomainEditorComponent;
  let fixture: ComponentFixture<DomainEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
