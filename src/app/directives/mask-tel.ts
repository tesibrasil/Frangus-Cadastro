import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMaskTel]',
  standalone: true
})
export class MaskTelDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é número

    // Limita a 11 dígitos (DDD + 9 dígitos)
    if (valor.length > 11) valor = valor.substring(0, 11);

    // Aplica a máscara (00) 00000-0000
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    } else if (valor.length > 0) {
      valor = valor.replace(/^(\d{0,2}).*/, '($1');
    }

    this.el.nativeElement.value = valor;
  }
}
