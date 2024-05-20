import { TestBed } from '@angular/core/testing';

import { ColaboratorService } from './colaborator.service';

describe('ColaboratorService', () => {
  let service: ColaboratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColaboratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
