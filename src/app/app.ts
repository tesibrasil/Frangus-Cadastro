import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CadastroComponent } from "./components/cadastro/cadastro";

// @Component({
//   selector: 'app-root',
//   imports: [CadastroComponent],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frangus-cadastro');
}
