
import { Component,ChangeDetectorRef } from '@angular/core';
import { AtletaService } from '../../services/atleta';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaskCpfDirective } from '../../directives/mask-cpf';
import { MaskTelDirective } from '../../directives/mask-tel';
import { MaskRgDirective } from '../../directives/mask-rg';
import Swal from 'sweetalert2';
import { DadosCamiseta } from '../../Models/cadastro.models';
import { forkJoin } from 'rxjs';

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
  { nome: 'ATLETA INDIVIDUAL', imagem: 'assets/img/frangus-atleta-individual.png' },
  { nome: 'STAFF', imagem: 'assets/img/frangus-staff.png' }

];

transportes = [
  { nome: 'busao', imagem: 'assets/img/frangus-bus.png' },
  { nome: 'veiculo proprio', imagem: 'assets/img/frangus-carro.png' }
];

indiceModalidade = 0;
indiceTransporte = 0;



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

public camiseta: DadosCamiseta = {
  nome: '',
  temInstagram: false,
  tamanho: '',
  numero: ''
};


bloqueiaCamiseta: boolean = false; // Controle para bloquear o campo de nome da camiseta

carregando = false; // Controle de estado
campoComErro: string = ''; // Para destacar o campo com erro

prova = { cpf: '',
  nome: '',
  nascimento: '',
  telefone: '',
  rg: '',
  email: '',
  instagram: '',
  modalidade: this.modalidades[0].nome, // Começa como 'ATLETA',
  transporte: this.transportes[0].nome,  // Começa como 'BUSÃO'
  tamanhoCamisetaKit: '',
  regiao: '',
  estacao: '',
  pagamento: '',
  uniforme: this.bloqueiaCamiseta ? 'Nao' : 'Sim', // Começa como 'Sim' (pois o campo de camiseta começa desbloqueado)
  uniformeNome: this.bloqueiaCamiseta ? '' : this.camiseta.nome,
  uniformeNumero: this.camiseta.numero,
  uniformeTamanho: this.camiseta.tamanho,
  uniformeInsta: this.camiseta.temInstagram ? 'Sim' : 'Nao',
  sugestao: ''
  };

  constructor(
    private atletaService: AtletaService,
    private cdr: ChangeDetectorRef
  ) {}

  jaTenhoCamiseta() {
  this.bloqueiaCamiseta = !this.bloqueiaCamiseta;

  if (this.bloqueiaCamiseta) {
    // Limpa os campos ao bloquear
    this.camiseta = {
      nome: 'Nao quero caraio',
      temInstagram: false,
      tamanho: '', // valor padrão neutro apenas para não quebrar validações futuras
      numero: ''
    };
  } else {
    // Reseta para o estado vazio caso o usuário desmarque a opção
    this.camiseta = {
      nome: '',
      temInstagram: false,
      tamanho: '',
      numero: ''
    };
  }
}

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

validarEtapa3(): boolean {
  // Se o usuário MARCOU que já tem a camiseta, nenhum campo dela é obrigatório
  if (this.bloqueiaCamiseta) {
    return true;
  }

  // Se ele NÃO marcou, precisamos validar campo por campo da camiseta
  if (!this.camiseta.nome || !this.camiseta.nome.trim()) {
    Swal.fire('Atenção', 'Por favor, digite o nome que deseja na camiseta.', 'warning');
    this.campoComErro = 'nomeCamiseta'; // Opcional: para você aplicar classe de erro se quiser
    return false;
  }

  if (!this.camiseta.temInstagram) {
    Swal.fire('Atenção', 'Por favor, selecione se deseja exibir o Instagram ou não.', 'warning');
    this.campoComErro = 'temInstagram';
    return false;
  }

  if (!this.camiseta.tamanho) {
    Swal.fire('Atenção', 'Por favor, selecione o tamanho da sua camiseta.', 'warning');
    this.campoComErro = 'tamanhoCamiseta';
    return false;
  }

  // Valida o número: precisa existir e ter exatamente 2 dígitos (conforme pattern do HTML)
  const numeroValido = /^[0-9]{2}$/.test(this.camiseta.numero);
  if (!this.camiseta.numero || !numeroValido) {
    Swal.fire('Atenção', 'Por favor, insira um número de camiseta válido com exatamente 2 dígitos (Ex: 07).', 'warning');
    this.campoComErro = 'numeroCamiseta';
    return false;
  }

  // Se passou por todos os "ifs", está tudo preenchido corretamente
  this.campoComErro = '';
  return true;
}

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
    confirmButtonText: 'Otimo!',
    heightAuto: false // Evita conflitos de layout no Angular
  });
  this.etapaAtual = 1;
  this.reset();
}

erroAoSalvar() {
  Swal.fire({
    title: 'Erro',
    text: 'Nao foi possível salvar na planilha.',
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

  this.etapaAtual = this.etapaAtual + 1;
  window.scrollTo(0, 0); // Volta para o topo da página
}

voltarCard() {
  this.etapaAtual = this.etapaAtual -1;

}


enviar() {

  this.campoComErro = '';

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
    uniforme: this.bloqueiaCamiseta ? 'Nao' : 'Sim',
    uniformeNome: this.bloqueiaCamiseta ? '' : this.camiseta.nome,
    uniformeNumero: this.camiseta.numero,
    uniformeTamanho: this.camiseta.tamanho,
    uniformeInsta: this.checkInstagramCamiseta()
     // Aproveita e limpa o RG também
  };




// 1. Criamos a variável que vai guardar a requisição do Atleta (POST ou PATCH)
  let requisicaoAtleta$;

  if (this.novoAtleta) {
    // Apenas preparamos o Observable do POST, sem dar o .subscribe() ainda
    requisicaoAtleta$ = this.atletaService.salvar(dadosParaSalvarAtleta);
  } else {
    // Apenas preparamos o Observable do PATCH
    requisicaoAtleta$ = this.atletaService.atualizar(
      this.atleta.cpf.replace(/\D/g, ''),
      dadosParaSalvarAtleta
    );
  }

  // 2. Preparamos a requisição da Prova
  const requisicaoProva$ = this.atletaService.salvarProva(dadosParaSalvarProva);

  // 3. O SEGREDO: Juntamos as duas requisições em um único bloco definitivo
  forkJoin({
    atleta: requisicaoAtleta$,
    prova: requisicaoProva$
  }).subscribe({
    next: (resultados) => {
      // Este bloco SÓ VAI EXECUTAR quando as duas APIs responderem com sucesso!
      console.log('Ambos os envios foram concluídos!', resultados);

      // Passamos 'this.novoAtleta' para que o método saiba se foi um cadastro ou atualização
      this.sucessoAoSalvar(true);
    },
    error: (err) => {
      // Se o atleta OU a prova falharem, o erro é capturado aqui centralizado
      console.error('Falha em um dos envios:', err);
      this.erroAoSalvar();
    }
  });


}


reset() {
  this.atleta = { id: 0, cpf: '', nome: '', nascimento: '', telefone: '', rg: '', email: '', instagram: '' };
  this.novoAtleta = false; // Esconde o aviso de novo atleta ao resetar
  this.carregando = false; // Garante que o estado de carregamento seja resetado
  this.indiceModalidade = 0;
  this.indiceTransporte = 0;
  this.campoComErro = ''; // Limpa qualquer destaque de campo com erro
  this.resetProva();
  this.cdr.detectChanges(); // Garante que a tela atualize imediatamente
}

resetProva() {
  this.prova = { cpf: '',
  nome: '',
  nascimento: '',
  telefone: '',
  rg: '',
  email: '',
  instagram: '',
  modalidade: this.modalidades[0].nome,
  transporte: this.transportes[0].nome,
  tamanhoCamisetaKit: '',
  regiao: '',
  estacao: '',
  pagamento: '',
  uniforme: 'Sim',
  uniformeNome: '',
  uniformeNumero: '',
  uniformeTamanho: '',
  uniformeInsta: '',
  sugestao: ''
 };

  this.bloqueiaCamiseta = false; // Reseta o bloqueio da camiseta
  this.camiseta = { nome: '', temInstagram: false, tamanho: '', numero: '' }; // Reseta os dados da camiseta

}

checkInstagramCamiseta() {

  if(this.bloqueiaCamiseta){
    return ''; // Se bloqueado, sempre "Não" para o Instagram na camiseta
  }
  else if (this.camiseta.temInstagram){
    return 'Sim';
  }else{
    return 'Nao';
  }

}
}
