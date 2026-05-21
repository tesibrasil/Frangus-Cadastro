import { Routes } from '@angular/router';
import { PelotaoComponent } from './components/pelotao/pelotao';
import { CadastroComponent } from './components/cadastro/cadastro';

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
  // Rota curinga: se o usuário digitar qualquer coisa errada, volta para o início
  {
    path: '**',
    redirectTo: ''
  }
];
