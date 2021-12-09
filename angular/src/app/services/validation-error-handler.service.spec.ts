import { TestBed } from '@angular/core/testing';

import { ValidationErrorHandlerService } from './validation-error-handler.service';

describe('ValidationErrorHandlerService', () => {
  let service: ValidationErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
