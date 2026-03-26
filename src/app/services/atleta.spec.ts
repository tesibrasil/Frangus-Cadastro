import { TestBed } from '@angular/core/testing';

import { AtletaService } from './atleta';

describe('Atleta', () => {
  let service: AtletaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtletaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
