import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { Asistencia } from '../classes/asistencia';
import * as moment from 'moment';
import { UserService } from './user.service';

const URL_ASIST = environment. URL_ASIST;
const URL_BIO = environment.URL_BIO;
const pathCreate = environment.path_createAsis;

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  @Output() registroInsertado = new EventEmitter<Asistencia>();
  token:string='';
  asistencias: Asistencia[]=[];
  
  constructor(private http: HttpClient,
    private storage: Storage,
    private usrService: UserService) { 
      if(!this.token){
        this.token = this.usrService.token;
       }
    }


  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }

 registrarAsistencia(asistencia: Asistencia){
   if(!this.token){
    this.cargarToken();
   }
   
  const headers: HttpHeaders = new HttpHeaders({
    'h-token': this.token
  }); 
  
  this.registroInsertado.emit(asistencia);
  return this.http.post(`${URL_ASIST}/`, asistencia, { headers });
}

insertarSQLAsistencia(asistencia: Asistencia){
  return this.http.post(`${URL_BIO}${pathCreate}`,{'registroIO':asistencia});
}


// async guardarUsuario() {
//   await this.storage.set('asistencia', this.usuario);
// }

insertarAsis(asistencia: Asistencia, fecha:string){
  return new Promise( resolve => {
    let params: HttpParams = new HttpParams();
    params = params.append('userId', asistencia.usuario);
    params = params.append('type', asistencia.tipo);
    params = params.append('checkTime', fecha);
    this.http.get<boolean>(`${URL_BIO}/consultas/crear`, { params })
            .subscribe( res => {
              resolve(res);
            });

  });
}

getAsistencias(cedula: string){
  let params: HttpParams = new HttpParams();
    params = params.append('cedula', cedula);
    params = params.append('mes', `${new Date().getMonth()+1}`);
    params = params.append('anio', `${new Date().getFullYear()}`);
 
  return this.http.get<Asistencia[]>(`${URL_BIO}/consultas/asistFecha`, { params });
  
}

async cargarAsistencias() {
  this.asistencias = await this.storage.get('asistencias') || [];
  return this.asistencias;
}

async guardarAsistencia(asistencia: Asistencia) {
  await this.cargarAsistencias();
  this.asistencias.unshift(asistencia); 
  await this.storage.set('asistencias', this.asistencias);
}

async resetAsistencias(){
  this.asistencias= [];
  await this.storage.set('asistencias', this.asistencias);
}


}
