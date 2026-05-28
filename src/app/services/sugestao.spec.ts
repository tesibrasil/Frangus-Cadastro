import { TestBed } from '@angular/core/testing';

import { Sugestao } from './sugestao';

describe('Sugestao', () => {
  let service: Sugestao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sugestao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
