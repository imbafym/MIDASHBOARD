import { TestBed } from '@angular/core/testing';

import { DatabaseInfoService } from './services/database-info.service';

describe('DatabaseInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatabaseInfoService = TestBed.get(DatabaseInfoService);
    expect(service).toBeTruthy();
  });
});
