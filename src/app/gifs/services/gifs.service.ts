import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = 'iJ4hzb0dkGiLeOrxehKgjMsLwVAe336a';
  private servivioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  //TODO cambiar any por su tipo correspondiente
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || []; //  si borramos el storage no peta porque regresa un [] vacio
    this.resultados =
      JSON.parse(localStorage.getItem('ultimo_resultado')!) || []; //  si borramos el storage no peta porque regresa un [] vacio
    /* if (localStorage.getItem('historial')) { // equivalente a la linea de arriba
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    } */
  }

  buscarGifs(query: string) {
    query = query.trim().toLocaleLowerCase();
    if (!this._historial.includes(query)) {
      // no incluya repetidos
      this._historial.unshift(query); // que lo inserte al principio del array
      this._historial = this._historial.splice(0, 10); //  que me muestre solo 10 elementos
      localStorage.setItem('historial', JSON.stringify(this._historial)); //JSON.stringify convierte objeto a string
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '20')
      .set('q', query);
    console.log('parametros', params.toString());

    this.http
      .get<SearchGifsResponse>(`${this.servivioUrl}/search`, { params })
      .subscribe((resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem(
          'ultimo_resultado',
          JSON.stringify(this.resultados)
        ); //JSON.stringify convierte objeto a string
      });

    console.log(this._historial);
  }
}
