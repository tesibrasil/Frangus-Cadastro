import { Component,ChangeDetectorRef } from '@angular/core';
import { AtletaService } from '../../services/atleta';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaskCpfDirective } from '../../directives/mask-cpf';
import { MaskTelDirective } from '../../directives/mask-tel';
import { MaskRgDirective } from '../../directives/mask-rg';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, MaskCpfDirective, MaskTelDirective, MaskRgDirective],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})


export class CadastroComponent {

  public etapaAtual: number = 1; // Começa no card 1 (Dados do Atleta)
  novoAtleta = false; // Controle para mostrar/ocultar o formulário

  // Lista de modalidades
modalidades = [
  { nome: 'ATLETA', imagem: 'assets/img/frangus-atleta.png' },
  { nome: 'STAFF', imagem: 'assets/img/frangus-staff.png' }
];

transportes = [
  { nome: 'busão', imagem: 'assets/img/frangus-bus.png' },
  { nome: 'veículo próprio', imagem: 'assets/img/frangus-carro.png' }
];

indiceModalidade = 0;
indiceTransporte = 0;

prova = { cpf: '',
  nome: '',
  nascimento: '',
  telefone: '',
  rg: '',
  email: '',
  instagram: '',
  tamanho: '',
  nomecamiseta: '',
  pagamento: '',
  sugestoes: '',
  modalidade: this.modalidades[0].nome, // Começa como 'ATLETA'
  transporte: this.transportes[0].nome  // Começa como 'BUSÃO'
  };

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
campoComErro: string = ''; // Para destacar o campo com erro

  constructor(
    private atletaService: AtletaService,
    private cdr: ChangeDetectorRef
  ) {}

  /*
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
     // this.carregando = false;
    }
  }
*/

  verificarCpf() {
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
          this.carregando = false; // Para o loading mesmo se não encontrar, para mostrar o formulário de novo atleta
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

formatarEmail() {
  if (this.atleta.email) {
    this.atleta.email = this.atleta.email.toLowerCase().trim();
  }
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

formatarInstagram() {
  if (this.atleta.instagram) {
    let insta = this.atleta.instagram.trim().toLowerCase();
    if (!insta.startsWith('@')) {
      insta = '@' + insta;
    }
    this.atleta.instagram = insta;
  }
}

exibirErroValidacao(titulo: string, mensagem: string) {
  Swal.fire({
    title: titulo,
    text: mensagem,
    imageUrl: '/assets/img/cabeca-frangus-triste.png',
    imageHeight: 250,
    confirmButtonColor: '#dc3545',
    confirmButtonText: 'Corrigir',
    heightAuto: false
  });
}

/*
exibirErroValidacao(nomeCampo: string) {
  Swal.fire({
    title: 'Campo Obrigatório!',
    text: `O campo "${nomeCampo}" precisa ser preenchido.`,
    imageUrl: '/assets/img/logo-frangos.png', // Ou uma imagem do frango "bravo/triste"
    imageHeight: 150,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Vou preencher!',
    heightAuto: false
  });
}
*/

// Funções de apoio para limpar o código
sucessoAoSalvar(isNovo: boolean) {
  Swal.fire({
    title: 'Sucesso!',
    text: 'O Frangolinu inscrito com sucesso!',
    imageUrl: '/assets/img/cabeca-frangus-feliz.png', // Seu logo aqui
    //imageAlt: 'Logo Frangos',
    imageHeight: 250,
    icon: 'success',
    confirmButtonColor: 'rgb(48, 48, 132)', // O azul do seu cabeçalho
    confirmButtonText: 'Ótimo!',
    heightAuto: false // Evita conflitos de layout no Angular
  });
  this.reset();
}

erroAoSalvar() {
  Swal.fire({
    title: 'Erro',
    text: 'Não foi possível salvar na planilha.',
    imageUrl: '/assets/img/cabeca-frangus-triste.png',
    imageHeight: 250,
    confirmButtonColor: '#dc3545',
    confirmButtonText: 'Fechar',
    heightAuto: false
  });
  this.carregando = false;
}

get modalidadeAtual() {
  return this.modalidades[this.indiceModalidade];
}

get transporteAtual() {
  return this.transportes[this.indiceTransporte];
}

mudarModalidade(direcao: number) {
  this.indiceModalidade += direcao;
  // Lógica para girar em loop
  if (this.indiceModalidade < 0) this.indiceModalidade = this.modalidades.length - 1;
  if (this.indiceModalidade >= this.modalidades.length) this.indiceModalidade = 0;

  // CAPTURA: Salva o nome da modalidade escolhida no objeto prova
  this.prova.modalidade = this.modalidadeAtual.nome;
}

mudarTransporte(direcao: number) {
  this.indiceTransporte += direcao;
  if (this.indiceTransporte < 0) this.indiceTransporte = this.transportes.length - 1;
  if (this.indiceTransporte >= this.transportes.length) this.indiceTransporte = 0;

  // CAPTURA: Salva o nome do transporte escolhido no objeto prova
 this.prova.transporte = this.transporteAtual.nome;
}

proximoCard() {

 /*
  // Aqui você pode adicionar uma validação: só avança se o form 1 estiver ok
 type AtletaKeys = 'id' | 'cpf' | 'nome' | 'nascimento' | 'telefone' | 'rg' | 'email' | 'instagram';
  const obrigatorios: { campo: AtletaKeys, nome: string, regra?: () => boolean, msg?: string }[] = [
    {
      campo: 'cpf',
      nome: 'CPF',
      regra: () => this.atleta.cpf.replace(/\D/g, '').length === 11,
      msg: 'O CPF deve conter exatamente 11 dígitos.'
    },
    {
      campo: 'nome',
      nome: 'Nome Completo'
    },
    {
      campo: 'nascimento',
      nome: 'Data de Nascimento'
    },
    {
      campo: 'telefone',
      nome: 'Telefone',
      regra: () => this.atleta.telefone.replace(/\D/g, '').length === 11,
      msg: 'O Telefone deve ter o DDD + 9 dígitos (total 11).'
    },
    {
      campo: 'rg',
      nome: 'RG'
    },
    {
      campo: 'email',
      nome: 'E-mail',
      regra: () => this.atleta.email.includes('@'),
      msg: 'O E-mail informado é inválido (falta o @).'
    }
  ];

  // 3. Execução da validação
  for (let item of obrigatorios) {
    const valor = String(this.atleta[item.campo] || '').trim();

    // Verifica se está vazio
    if (!valor) {
      this.campoComErro = item.campo;
      this.exibirErroValidacao(item.nome, `O campo "${item.nome}" é obrigatório.`);
      return;
    }

    // Verifica a regra específica (comprimento/formato)
    if (item.regra && !item.regra()) {
      this.campoComErro = item.campo;
      this.exibirErroValidacao(item.nome, item.msg || 'Formato inválido.');
      return;
    }
  }

    this.formatarInstagram();
    this.formatarEmail();
*/
  this.etapaAtual = 2;
  window.scrollTo(0, 75); // Volta para o topo da página
}

voltarCard() {
  this.etapaAtual = 1;
}


enviar() {

  this.campoComErro = '';
  //this.carregando = true;

/*
  type AtletaKeys = 'id' | 'cpf' | 'nome' | 'nascimento' | 'telefone' | 'rg' | 'email' | 'instagram';
  const obrigatorios: { campo: AtletaKeys, nome: string, regra?: () => boolean, msg?: string }[] = [
    {
      campo: 'cpf',
      nome: 'CPF',
      regra: () => this.atleta.cpf.replace(/\D/g, '').length === 11,
      msg: 'O CPF deve conter exatamente 11 dígitos.'
    },
    {
      campo: 'nome',
      nome: 'Nome Completo'
    },
    {
      campo: 'nascimento',
      nome: 'Data de Nascimento'
    },
    {
      campo: 'telefone',
      nome: 'Telefone',
      regra: () => this.atleta.telefone.replace(/\D/g, '').length === 11,
      msg: 'O Telefone deve ter o DDD + 9 dígitos (total 11).'
    },
    {
      campo: 'rg',
      nome: 'RG'
    },
    {
      campo: 'email',
      nome: 'E-mail',
      regra: () => this.atleta.email.includes('@'),
      msg: 'O E-mail informado é inválido (falta o @).'
    }
  ];

  // 3. Execução da validação
  for (let item of obrigatorios) {
    const valor = String(this.atleta[item.campo] || '').trim();

    // Verifica se está vazio
    if (!valor) {
      this.campoComErro = item.campo;
      this.exibirErroValidacao(item.nome, `O campo "${item.nome}" é obrigatório.`);
      return;
    }

    // Verifica a regra específica (comprimento/formato)
    if (item.regra && !item.regra()) {
      this.campoComErro = item.campo;
      this.exibirErroValidacao(item.nome, item.msg || 'Formato inválido.');
      return;
    }
  }

    this.formatarInstagram();
    this.formatarEmail();
*/
    const dadosParaSalvarAtleta = {

    ...this.atleta,
    id: 0,
    instagram: this.atleta.instagram,
    cpf: this.atleta.cpf.replace(/\D/g, ''),
    telefone: this.atleta.telefone.replace(/\D/g, ''),
    rg: this.atleta.rg.replace(/[\.\-]/g, '') // Aproveita e limpa o RG também
  };

  const dadosParaSalvarProva = {
    ...this.prova,
    ...this.atleta,
    instagram: this.atleta.instagram,
    cpf: this.atleta.cpf.replace(/\D/g, ''),
    telefone: this.atleta.telefone.replace(/\D/g, ''),
    rg: this.atleta.rg.replace(/[\.\-]/g, ''),
     // Aproveita e limpa o RG também
  };


 if (this.novoAtleta) {
    // É um cadastro novo: usamos POST (salvar)
    this.atletaService.salvar(dadosParaSalvarAtleta).subscribe({
      next: () => this.sucessoAoSalvar(true),
      error: () => this.erroAoSalvar()
    });
  } else {
    // Já existe: usamos PATCH (atualizar)
    // Passamos o CPF original para o SheetDB encontrar a linha certa
    this.atletaService.atualizar(this.atleta.cpf.replace(/\D/g, ''), dadosParaSalvarAtleta).subscribe({
      next: () => this.sucessoAoSalvar(false),
      error: () => this.erroAoSalvar()
    });
  }

    this.atletaService.salvarProva(dadosParaSalvarProva).subscribe({
      next: () => this.sucessoAoSalvar(true),
      error: () => this.erroAoSalvar()
    });
}


reset() {
  this.atleta = { id: 0, cpf: '', nome: '', nascimento: '', telefone: '', rg: '', email: '', instagram: '' };
  this.novoAtleta = false; // Esconde o aviso de novo atleta ao resetar
  this.carregando = false; // Garante que o estado de carregamento seja resetado
  this.campoComErro = ''; // Limpa qualquer destaque de campo com erro
  this.cdr.detectChanges(); // Garante que a tela atualize imediatamente
}



}
