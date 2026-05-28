import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SugestaoService } from '../../services/sugestao';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sugestao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sugestao.html',
  styleUrl: './sugestao.css'
})
export class SugestaoComponent {
  public nome: string = '';
  public sugestao: string = '';
  public carregando: boolean = false;

  // Injeta apenas o seu serviço customizado aqui
  constructor(private sugestaoService: SugestaoService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone) {}

  limpar() {
    this.nome = '';
    this.sugestao = '';
  }

  enviar() {
    if (!this.nome.trim() || !this.sugestao.trim()) {
      Swal.fire('Atenção', 'Por favor, preencha todos os campos antes de enviar.', 'warning');
      return;
    }

    this.carregando = true;

    this.sugestaoService.enviarSugestao(this.nome, this.sugestao).subscribe({
      next: () => {
        // Força a execução dentro da zona do Angular para não travar a UI
        this.zone.run(() => {
          this.carregando = false; // Desliga a variável do loader
          this.nome  = '';
          this.sugestao = '';

          // O SEGREDO: Dá um "soco" no HTML para ele sumir com a tela de "Enviando..." AGORA
          this.cdr.detectChanges();

          // Só depois que o HTML limpou 100%, abrimos o pop-up de sucesso
          Swal.fire({
            title: 'Obrigado!',
            text: 'Sua sugestao foi enviada com sucesso.',
            icon: 'success',
            confirmButtonColor: '#2b2d84',
            heightAuto: false
          });
        });
      },
      error: (err) => {
        console.error('Erro ao enviar sugestao:', err);

        this.zone.run(() => {
          this.carregando = false;
          this.cdr.detectChanges(); // Garante o fechamento do loader mesmo se der erro de rede

          Swal.fire({
            title: 'Erro',
            text: 'Nao foi possivel enviar sua sugestao agora. Tente novamente mais tarde.',
            icon: 'error',
            confirmButtonColor: '#dc3545',
            heightAuto: false
          });
        });
      }
    });
  }
}

