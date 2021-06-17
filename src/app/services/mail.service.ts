import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Mail } from '../classes/mail';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


const URL_BIO = environment.URL_BIO;

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient) { }
 
  enviarMail(mail: Mail): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
  
    return  this.http 
    .post(`${URL_BIO}/mail/envioMail`, mail, {headers}); 

  }
}
