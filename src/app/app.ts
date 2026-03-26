import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CadastroComponent } from "./components/cadastro/cadastro";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CadastroComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frangus-cadastro');
}
