import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MensagemService } from '../services/mensagem.service';

@Injectable()
export class ErrosInterceptor implements HttpInterceptor {

  constructor(private mensagemService: MensagemService) {}

  intercept(
    request: HttpRequest<HttpErrorResponse>,
    next: HttpHandler): Observable<HttpEvent<HttpErrorResponse>> {

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ocorreu um erro desconhecido';

            if (error.error instanceof ErrorEvent) {
                // Erro do lado do cliente, como uma rede interrompida
                errorMessage = `Erro do cliente: ${error.error.message}`;
            } else if (error.status === 404) {
                // Recurso não encontrado (erro 404)
                errorMessage = 'Recurso não encontrado';
            } else if (error.status === 500) {
                // Erro interno do servidor (erro 500)
                errorMessage = 'Erro interno do servidor';
            } else if (error.status === 401) {
                // Não autorizado (erro 401)
                errorMessage = 'Você não está autorizado a acessar este recurso';
            }

            this.mensagemService.openSnackBar(errorMessage);

            return throwError (() => new Error('Ops, ocorreu um erro!'));
        })
      )
  }
}
