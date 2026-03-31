import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AtletaService {

constructor(private http: HttpClient) {}

private apiAtletaUrl = { main :'https://sheetdb.io/api/v1/371w103tvq2i9', second: 'https://sheetdb.io/api/v1/dxwpt0kuljaou'};

private apiIncricaoUrl = {main: 'https://sheetdb.io/api/v1/0va3zdpi7uwy1', second: 'https://sheetdb.io/api/v1/2w7pyejl8jjw1'}  ;

buscarPorCpf(cpf: string) {
    // Tenta a primeira URL
    return this.http.get<any[]>(`${this.apiAtletaUrl.main}/search?cpf=${cpf}`).pipe(
      catchError((error) => {
        console.warn('Main API falhou ou atingiu limite, tentando a Second...', error);

        // Se der erro (como limite excedido), tenta a URL secundária
        return this.http.get<any[]>(`${this.apiAtletaUrl.second}/search?cpf=${cpf}`);
      })
    );
  }

  // MÉTODO DE SALVAR COM FALLBACK
  salvar(atleta: any) {
    return this.http.post(this.apiAtletaUrl.main, { data: atleta }).pipe(
      catchError(() => {
        return this.http.post(this.apiAtletaUrl.second, { data: atleta });
      })
    );
  }

  // MÉTODO DE ATUALIZAR COM FALLBACK
  atualizar(cpf: string, atleta: any) {
    return this.http.patch(`${this.apiAtletaUrl.main}/cpf/${cpf}`, { data: atleta }).pipe(
      catchError(() => {
        return this.http.patch(`${this.apiAtletaUrl.second}/cpf/${cpf}`, { data: atleta });
      })
    );
  }

/*
salvar(atleta: any) {
    return this.http.post(this.apiAtletaUrl.main, { data: atleta });
  }

  atualizar(cpf: string, atleta: any) {
  // O SheetDB espera que o valor do CPF na URL esteja limpo (sem a aspa simples de controle)
  //const cpfLimpo = cpf.replace("'", "");
  return this.http.patch(`${this.apiAtletaUrl.main}/cpf/${cpf}`, { data: atleta });
}
  */
/*
  buscarPorCpf(cpf: string) {
    return this.http.get<any[]>(`${this.apiAtletaUrl}/search?cpf=${cpf}`);
  }
*/
    salvarProva(prova: any) {
    return this.http.post(this.apiIncricaoUrl.main, { data: prova });
  }

}
