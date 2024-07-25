import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClExpressionBuilderComponent } from './cl-expression-builder.component';

describe('ClExpressionBuilderComponent', () => {
  let component: ClExpressionBuilderComponent;
  let fixture: ComponentFixture<ClExpressionBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClExpressionBuilderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ClExpressionBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
