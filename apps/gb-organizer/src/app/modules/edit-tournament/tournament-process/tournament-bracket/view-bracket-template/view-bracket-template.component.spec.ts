import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBracketTemplateComponent } from './view-bracket-template.component';

describe('ViewBracketTemplateComponent', () => {
  let component: ViewBracketTemplateComponent;
  let fixture: ComponentFixture<ViewBracketTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBracketTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBracketTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
