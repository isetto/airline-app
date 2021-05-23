import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { ErrorResponse } from '../model/error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public toastController: ToastController) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        const errors: ErrorResponse[] = error.error.errors
        if(errors.length > 0){
          errors.forEach((err: ErrorResponse)=>{
            this.presentToast(err.description)
          })
          
        }
        return throwError(errors)
      })
    )
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
