import { Routes } from '@angular/router';
import { PelotaoComponent } from './components/pelotao/pelotao';
import { CadastroComponent } from './components/cadastro/cadastro';
import { SugestaoComponent } from './components/sugestao/sugestao';

export const routes: Routes = [
  {
    path: '',
    component: CadastroComponent
  },
  {
    path: 'cadastro',
    component: CadastroComponent
  },
  { path: 'pelotao', component: PelotaoComponent },
  { path: 'sugestao', component: SugestaoComponent },
  // Rota curinga: se o usuário digitar qualquer coisa errada, volta para o início
  {
    path: '**',
    redirectTo: ''
  }
];
