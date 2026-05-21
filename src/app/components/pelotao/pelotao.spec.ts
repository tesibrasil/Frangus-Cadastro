import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pelotao } from './pelotao';

describe('Pelotao', () => {
  let component: Pelotao;
  let fixture: ComponentFixture<Pelotao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pelotao],
    }).compileComponents();

    fixture = TestBed.createComponent(Pelotao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
