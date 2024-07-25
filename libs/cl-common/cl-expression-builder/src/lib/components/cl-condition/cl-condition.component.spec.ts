import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClConditionComponent } from './cl-condition.component';

describe('ClConditionComponent', () => {
  let component: ClConditionComponent;
  let fixture: ComponentFixture<ClConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClConditionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ClConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
