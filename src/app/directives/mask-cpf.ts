import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMaskCpf]',
  standalone: true
})
export class MaskCpfDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (valor.length > 11) valor = valor.substring(0, 11);

    // Aplica a máscara 000.000.000-00
    if (valor.length > 9) {
      valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    } else if (valor.length > 3) {
      valor = valor.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2');
    }

    this.el.nativeElement.value = valor;
  }
}
