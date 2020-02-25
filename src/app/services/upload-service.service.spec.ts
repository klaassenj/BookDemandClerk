import { TestBed } from '@angular/core/testing';

import { UploadServiceService } from './upload-service.service';

describe('UploadServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadServiceService = TestBed.get(UploadServiceService);
    expect(service).toBeTruthy();
  });
});
