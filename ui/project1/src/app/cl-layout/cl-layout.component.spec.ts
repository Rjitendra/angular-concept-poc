import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClLayoutComponent } from './cl-layout.component';

describe('ClLayoutComponent', () => {
  let component: ClLayoutComponent;
  let fixture: ComponentFixture<ClLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
