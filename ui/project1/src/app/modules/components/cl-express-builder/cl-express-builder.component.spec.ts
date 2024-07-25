import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClExpressBuilderComponent } from './cl-express-builder.component';

describe('ClExpressBuilderComponent', () => {
  let component: ClExpressBuilderComponent;
  let fixture: ComponentFixture<ClExpressBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClExpressBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClExpressBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
