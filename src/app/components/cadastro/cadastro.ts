import { Component,ChangeDetectorRef } from '@angular/core';
import { AtletaService } from '../../services/atleta';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaskCpfDirective } from '../../directives/mask-cpf';
import { MaskTelDirective } from '../../directives/mask-tel';
import { MaskRgDirective } from '../../directives/mask-rg';


@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, MaskCpfDirective, MaskTelDirective, MaskRgDirective],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class CadastroComponent {

  novoAtleta = false; // Controle para mostrar/ocultar o formulário

  atleta = {
  id: 0,
  cpf: '',
  nome: '',
  nascimento: '',
  telefone: '',
  rg: '',
  email: '',
  instagram: ''
};

carregando = false; // Controle de estado

  constructor(
    private atletaService: AtletaService,
    private cdr: ChangeDetectorRef
  ) {}

  verificarCpf() {
    if (this.atleta.cpf.length >= 11) {
      this.atletaService.buscarPorCpf(this.atleta.cpf).subscribe(res => {
        if (res.length > 0) {
          this.atleta = res[0]; // Preenche os campos se achar
        }
      });
    }
  }

  verificarCpf2() {
  const cpfLimpo = this.atleta.cpf.replace(/\D/g, '');

  if (cpfLimpo.length === 11) {
    this.atletaService.buscarPorCpf(cpfLimpo).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          // Usamos o spread operator (...) para garantir que o Angular
          // detecte a mudança de referência do objeto e atualize o HTML
          this.atleta = { ...res[0] };
          console.log('Dados carregados:', res[0]);
        }
      },
      error: (err) => console.error('Erro ao buscar CPF:', err)
    });
  }
}

verificarCpf3() {
    const cpfLimpo = this.atleta.cpf.replace(/\D/g, '');

    if (cpfLimpo.length === 11) {
      this.carregando = true; // Inicia o loading

      this.atletaService.buscarPorCpf(cpfLimpo).subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            this.atleta = { ...res[0] };
          }
          this.carregando = false; // Para o loading ao encontrar
        },
        error: (err) => {
          console.error(err);
          this.carregando = false; // Para o loading mesmo em erro
        }
      });
    }
  }

  verificarCpf4() {
    const cpfLimpo = this.atleta.cpf.replace(/\D/g, '');

    if (cpfLimpo.length === 11) {
      this.carregando = true;

      this.atletaService.buscarPorCpf(cpfLimpo).subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            // 3. Atualizamos o objeto com os dados da planilha
            this.atleta = {
            id: res[0].id,
            nome: res[0].nome,
            nascimento: res[0].nascimento,
            cpf: res[0].cpf,
            instagram: res[0].instagram,
            telefone: res[0].telefone,
            rg: res[0].rg,
            email: res[0].email
            };

            // 4. FORÇA O ANGULAR A ATUALIZAR A TELA AGORA
            this.cdr.detectChanges();
          }
          this.carregando = false;
        },
        error: (err) => {
          console.error(err);
          this.carregando = false;
        }
      });
    }
  }

  verificarCpf5() {
  // Limpa a máscara para a lógica de busca
  const cpfApenasNumeros = this.atleta.cpf.replace(/\D/g, '');

  // Se o usuário apagar o CPF, resetamos o aviso
    if (cpfApenasNumeros.length < 11) {
      this.novoAtleta = false;
      return;
    }

  // Só dispara se tiver os 11 números completos
  if (cpfApenasNumeros.length === 11) {
    this.carregando = true;
    this.novoAtleta = false; // Resetamos antes de buscar

    // Enviamos o CPF limpo para a API
    this.atletaService.buscarPorCpf(cpfApenasNumeros).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          // Ao receber os dados, mantemos o CPF com máscara na tela
          const atletaEncontrado = res[0];
          this.atleta = {
            ...atletaEncontrado,
            cpf: this.formatarCpf(atletaEncontrado.cpf), // Formata o que vem da planilha
            telefone: this.formatarTel(atletaEncontrado.telefone || ''), // Formata o telefone
            rg: this.formatarRg(atletaEncontrado.rg || '')
          };
          this.novoAtleta = false;
         // this.cdr.detectChanges();
        }
        else{
          this.novoAtleta = true; // Mostra o formulário para novo atleta
          this.limparCamposExcetoCpf();
        }
        this.cdr.detectChanges();
        this.carregando = false;
      },
      error: () =>{this.carregando = false;
                   this.novoAtleta = false; // Se der erro, não mostramos o formulário de novo atleta, pois pode ser um erro de conexão ou outro problema.
      }
    });
  }
}

// Função auxiliar para limpar a tela se for um novo cadastro
  limparCamposExcetoCpf() {
    const cpfAtual = this.atleta.cpf;
    this.atleta = {
      id: 0, cpf: cpfAtual, nome: '', nascimento: '',
      telefone: '', rg: '', email: '', instagram: ''
    };
  }


// Função auxiliar para formatar o que vem da planilha (caso venha sem pontos)
formatarCpf(v: string): string {
  v = v.replace(/\D/g, '');
  return v.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

// Formata Telefone: (00) 00000-0000
formatarTel(v: string): string {
  if (!v) return '';
  v = v.replace(/\D/g, '');
  if (v.length === 11) {
    return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return v; // Retorna sem máscara se não tiver 11 dígitos
}

// Formata RG: 00.000.000-X
formatarRg(v: string): string {
  if (!v) return '';
  v = v.replace(/[^0-9X]/gi, '').toUpperCase();
  return v.replace(/(\d{2})(\d{3})(\d{3})([0-9X])/, '$1.$2.$3-$4');
}

  verificarCpfAoDigitar() {
  // Remove qualquer caractere que não seja número (prevenção)
  const cpfLimpo = this.atleta.cpf.replace(/\D/g, '');

  // Só dispara a busca quando chegar exatamente em 11 dígitos
  if (cpfLimpo.length === 11) {
    this.atletaService.buscarPorCpf(cpfLimpo).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          // Atribui os dados encontrados ao objeto atleta
          // O SheetDB retorna os nomes das colunas conforme a planilha
          this.atleta = {
            id: res[0].id,
            nome: res[0].nome,
            nascimento: res[0].nascimento,
            cpf: res[0].cpf,
            instagram: res[0].instagram,
            telefone: res[0].telefone,
            rg: res[0].rg,
            email: res[0].email
          };
          console.log('Atleta encontrado e preenchido!');
        }
      },
      error: (err) => console.error('Erro na busca:', err)
    });
  }
}

  enviar() {
    this.carregando = true;

    const dadosParaSalvar = {

    ...this.atleta,
    id: 0,
    nome: this.atleta.nome,
    nascimento: this.atleta.nascimento,
    email: this.atleta.email,
    instagram: this.atleta.instagram,
    cpf: this.atleta.cpf.replace(/\D/g, ''),
    telefone: this.atleta.telefone.replace(/\D/g, ''),
    rg: this.atleta.rg.replace(/[\.\-]/g, '') // Aproveita e limpa o RG também
  };
    this.atletaService.salvar(dadosParaSalvar).subscribe({
    next: () => {
      alert('Atleta salvo com sucesso!');
      this.atleta = { id: 0, cpf: '', nome: '', nascimento: '', telefone: '', rg: '', email: '', instagram: '' };

      this.cdr.detectChanges();
      this.carregando = false
    },
    error: () => {
      alert('Erro ao salvar dados.');
      this.carregando = false;
    }
  });
}
reset() {
  this.atleta = { id: 0, cpf: '', nome: '', nascimento: '', telefone: '', rg: '', email: '', instagram: '' };
  this.novoAtleta = false; // Esconde o aviso de novo atleta ao resetar
  this.carregando = false; // Garante que o estado de carregamento seja resetado
  this.cdr.detectChanges(); // Garante que a tela atualize imediatamente
}
}
