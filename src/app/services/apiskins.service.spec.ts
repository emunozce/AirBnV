import { TestBed } from '@angular/core/testing';

import { ApiskinsService } from './apiskins.service';

describe('ApiskinsService', () => {
  let service: ApiskinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiskinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
