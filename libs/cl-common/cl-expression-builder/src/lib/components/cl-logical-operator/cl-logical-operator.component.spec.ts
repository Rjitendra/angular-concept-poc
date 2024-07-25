import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClLogicalOperatorComponent } from './cl-logical-operator.component';

describe('ClLogicalOperatorComponent', () => {
  let component: ClLogicalOperatorComponent;
  let fixture: ComponentFixture<ClLogicalOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClLogicalOperatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ClLogicalOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
