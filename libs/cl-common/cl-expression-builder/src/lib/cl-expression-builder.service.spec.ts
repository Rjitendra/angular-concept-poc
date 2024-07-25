import { TestBed } from '@angular/core/testing';

import { ClExpressionBuilderService } from './cl-expression-builder.service';

describe('ClExpressionBuilderService', () => {
  let service: ClExpressionBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClExpressionBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
