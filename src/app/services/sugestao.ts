import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Garante que o service esteja disponível na aplicação toda
})
export class SugestaoService {
  // Centraliza a URL aqui. Se mudar no futuro, fica fácil corrigir.
  private readonly apiUrl = 'https://sheetdb.io/api/v1/jd03dpju0vz2o';

  constructor(private http: HttpClient) {}

  /**
   * Envia a sugestão formatada para a API
   * @param identificacao Nome ou apelido de quem sugeriu
   * @param texto A mensagem/ideia detalhada
   */
  enviarSugestao(identificacao: string, texto: string): Observable<any> {
    const payload = {
      data: [{
        'nome': identificacao,
        'sugestao': texto
      }]
    };

    return this.http.post(this.apiUrl, payload);
  }
}
