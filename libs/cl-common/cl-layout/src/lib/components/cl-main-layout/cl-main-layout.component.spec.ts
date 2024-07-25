import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClMainLayoutComponent } from './cl-main-layout.component';

describe('ClMainLayoutComponent', () => {
  let component: ClMainLayoutComponent;
  let fixture: ComponentFixture<ClMainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClMainLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
