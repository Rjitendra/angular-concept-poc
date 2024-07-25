import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClContactComponent } from './cl-contact.component';

describe('ClContactComponent', () => {
  let component: ClContactComponent;
  let fixture: ComponentFixture<ClContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
