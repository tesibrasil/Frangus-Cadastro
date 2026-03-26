import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMaskRg]',
  standalone: true
})
export class MaskRgDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    let valor = event.target.value.toUpperCase(); // Garante o X maiúsculo

    // Remove tudo que não é número ou a letra X
    valor = valor.replace(/[^0-9X]/g, '');

    // Limita o tamanho (máximo 9 caracteres para o padrão 00.000.000-0)
    if (valor.length > 9) valor = valor.substring(0, 9);

    // Aplica a máscara 00.000.000-X
    if (valor.length > 8) {
      valor = valor.replace(/^(\d{2})(\d{3})(\d{3})([0-9X]).*/, '$1.$2.$3-$4');
    } else if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,3}).*/, '$1.$2');
    }

    this.el.nativeElement.value = valor;
  }
}
