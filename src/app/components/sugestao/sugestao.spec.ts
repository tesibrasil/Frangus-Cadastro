import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sugestao } from './sugestao';

describe('Sugestao', () => {
  let component: Sugestao;
  let fixture: ComponentFixture<Sugestao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sugestao],
    }).compileComponents();

    fixture = TestBed.createComponent(Sugestao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
