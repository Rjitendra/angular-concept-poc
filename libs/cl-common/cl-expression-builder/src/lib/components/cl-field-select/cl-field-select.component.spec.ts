import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClFieldSelectComponent } from './cl-field-select.component';

describe('ClFieldSelectComponent', () => {
  let component: ClFieldSelectComponent;
  let fixture: ComponentFixture<ClFieldSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClFieldSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ClFieldSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
