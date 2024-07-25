import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClAboutComponent } from './cl-about.component';

describe('ClAboutComponent', () => {
  let component: ClAboutComponent;
  let fixture: ComponentFixture<ClAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClAboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
