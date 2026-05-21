import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';

interface AtletaPelotao {
  id: number;
  nome: string;
  selecionado: boolean;
}

@Component({
  selector: 'app-pelotao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pelotao.html',
  styleUrl: './pelotao.css'
})
export class PelotaoComponent implements OnInit {
  public nomePelotao: string = '';
  public nivelDificuldade: string = '';
  public atletas: AtletaPelotao[] = [];
  public carregando: boolean = false;

  private apiUrl = 'https://sheetdb.io/api/v1/dxcsbkancz5e7';

  constructor(
    private http: HttpClient,
  private cdr: ChangeDetectorRef,
  private zone: NgZone) {}

  ngOnInit() {
    this.inicializarGrade();
  }

inicializarGrade() {
  const nomesReais = [
    'Agatha',
    'Beatriz',
    'Bryan',
    'Diogo',
    'Felipe',
    'Gabi Macedo',
    'Gabrielle Janoni',
    'Gustavo',
    'Isabelle',
    'Jailson',
    'Jardel',
    'Juliana Lira',
    'Larissa Cristina',
    'Luana',
    'Lucas',
    'Matheus',
    'Michele',
    'Mônica',
    'Paloma Gomes',
    'Paloma Rolim',
    'Pamela',
    'Rafael',
    'Raianny',
    'Renan',
    'Renato',
    'Romario',
    'Thamires',
    'Thay',
    'Thayna',
    'Thiago',
    'Victor Eloy',
    'Victor Silva',
    'Vitor Antonio',
    'Vitoria',
    'Wesley',
    'Yasmin'
  ];

  // Mapeia os 36 nomes para a estrutura de objetos com ID e estado inicial desmarcado
  this.atletas = nomesReais.map((nome, indice) => ({
    id: indice + 1,
    nome: nome,
    selecionado: false
  }));
}

  // Getter dinâmico que filtra apenas os atletas marcados para a lista inferior
  get atletasSelecionados(): AtletaPelotao[] {
    return this.atletas.filter(a => a.selecionado);
  }

toggleAtleta(atleta: AtletaPelotao) {
    if (!atleta.selecionado && this.atletasSelecionados.length >= 12) {
      Swal.fire({
        icon: 'warning',
        title: 'Limite Máximo',
        text: 'Você só pode selecionar no máximo 12 atletas por pelotão.',
        timer: 2500,
        showConfirmButton: false
      });
      return;
    }

    atleta.selecionado = !atleta.selecionado;
  }

  limpar() {
    this.nomePelotao = '';
    this.nivelDificuldade = '';
    this.atletas.forEach(a => a.selecionado = false);
    Swal.fire({
      icon: 'info',
      title: 'Formulário limpo',
      timer: 1200,
      showConfirmButton: false
    });
  }

enviar() {
  if (!this.nomePelotao.trim()) {
    this.exibirErroValidacao('Atenção', 'Insira o nome do pelotão ou responsável.');
    return;
  }
  if (!this.nivelDificuldade) {
    this.exibirErroValidacao('Atenção', 'Selecione o nível de intensidade.');
    return;
  }

  const totalSelecionados = this.atletasSelecionados.length;

  if (totalSelecionados < 6) {
    this.exibirErroValidacao('Pelotão Incompleto', 'Um pelotão precisa ter no mínimo 6 atletas selecionados.');
    return;
  }
  if (totalSelecionados > 12) {
    this.exibirErroValidacao('Pelotão Excedido', 'Um pelotão pode ter no máximo 12 atletas.');
    return;
  }

  this.carregando = true;

  const payload: any = {
    'Nome': this.nomePelotao,
    'Intensidade': this.nivelDificuldade
  };

  for (let i = 1; i <= 12; i++) {
    const atleta = this.atletasSelecionados[i - 1];
    payload[`Atleta${i}`] = atleta ? atleta.nome : '';
  }

  const body = { data: [payload] };

  this.http.post(this.apiUrl, body).subscribe({
    next: () => {
      // Usamos o NgZone e ChangeDetector para garantir que o Angular limpe a tela ANTES de qualquer pop-up abrir
      this.zone.run(() => {
        this.carregando = false;
        this.nomePelotao = '';
        this.nivelDificuldade = '';
        this.atletas.forEach(a => a.selecionado = false);

        // Força o HTML a sumir com o overlay "Salvando..." AGORA
        this.cdr.detectChanges();

        // Só depois que a tela limpou, abrimos o SweetAlert de sucesso
        Swal.fire({
          title: 'Sucesso!',
          text: `Pelotão salvo com sucesso na planilha!`,
          imageUrl: '/assets/img/cabeca-frangus-feliz.png',
          imageHeight: 250,
          icon: 'success',
          confirmButtonColor: 'rgb(48, 48, 132)',
          confirmButtonText: 'Sensacional!',
          heightAuto: false
        });
      });
    },
    error: (err) => {
      console.error('Erro ao enviar para o SheetDB:', err);

      this.zone.run(() => {
        this.carregando = false;
        this.cdr.detectChanges(); // Força sumir o loader mesmo no erro

        Swal.fire({
          title: 'Erro',
          text: 'Não foi possível salvar o pelotão na planilha.',
          imageUrl: '/assets/img/cabeca-frangus-triste.png',
          imageHeight: 250,
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'Fechar',
          heightAuto: false
        });
      });
    }
  });
}

  // Helper temático para exibir mensagens de erro idêntico ao cadastro
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
}
