import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AtletaService {

constructor(private http: HttpClient) {}

private apiUrl = 'https://sheetdb.io/api/v1/371w103tvq2i9';

  salvar(atleta: any) {
    return this.http.post(this.apiUrl, { data: atleta });
  }

  atualizar(cpf: string, atleta: any) {
  // O SheetDB espera que o valor do CPF na URL esteja limpo (sem a aspa simples de controle)
  //const cpfLimpo = cpf.replace("'", "");
  return this.http.patch(`${this.apiUrl}/cpf/${cpf}`, { data: atleta });
}

  buscarPorCpf(cpf: string) {
    return this.http.get<any[]>(`${this.apiUrl}/search?cpf=${cpf}`);
  }

}
