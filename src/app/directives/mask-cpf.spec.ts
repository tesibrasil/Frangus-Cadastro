import { MaskCpf } from './mask-cpf';

describe('MaskCpf', () => {
  it('should create an instance', () => {
    const directive = new MaskCpf();
    expect(directive).toBeTruthy();
  });
});
