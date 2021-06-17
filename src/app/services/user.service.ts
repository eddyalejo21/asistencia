import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { User } from '../classes/user';
import { UiGraphicsService } from './ui-graphics.service';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Asistencia } from '../classes/asistencia';


const URL_DIST = environment.URL_DIS;
const mailPath = environment.path_mail;
const noExiste = environment.noExists;
const URL_USR = environment.URL_USR;
const URL_BIO = environment.URL_BIO;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  token: string = '';
  usuario: User = new User();

  constructor(private http: HttpClient,
    private uiServ: UiGraphicsService,
    private storage: Storage,
    private navController: NavController) { }

  getMailFromDist(cedula: string): User {
    let resultado: User = new User();
    let params: HttpParams = new HttpParams();
    params = params.append('cedula', cedula);
    this.http.get<any>(`${URL_DIST}${mailPath}`, { params })
      .subscribe(result => {

        if (result.nombres === null) {
          this.uiServ.presentToast(`No existe usuario con cédula ${cedula}`);
          return;
        }

        if (result.mail) {
          resultado.cedula = cedula;
          resultado.email = result.mail;
          resultado.nombre = result.nombres;
        } else {
         this.uiServ.presentAlert();
        }

      });
    return resultado;
  }

  login(cedula: string, password: string) {
    return new Promise(resolve => {
      const data = { cedula, password };
      this.http.post(`${URL_USR}/login`, data)
        .subscribe(async result => {
          if (result['ok']) {
            await this.guardarToken(result['token']);

            resolve(true);
          } else {
            this.storage.clear();
            resolve(false);
          }

        });
    });
  }

  //Guardar TOken
  async guardarToken(token: string) {
    this.token = token;
    await this.storage.set('token', this.token);
    await this.verificarToken();
  }

  async guardarUsuario() {
    await this.storage.set('user', this.usuario);
  }

  async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }

  async verificarToken(): Promise<boolean> {
    await this.cargarToken();
    if (!this.token) {
      this.navController.navigateRoot('/login');
      this.uiServ.presentToast('Debe iniciar sesión');
      return Promise.resolve(false);
    }
    return new Promise<boolean>(resolve => {
      const headers: HttpHeaders = new HttpHeaders({
        'h-token': this.token
      });

      this.http.get(`${URL_USR}/validate`, { headers })
        .subscribe(respuesta => {
          if (respuesta['ok']) {
            this.usuario = respuesta['usuario'];
            resolve(true);
          } else {
            this.navController.navigateRoot('/login');
            resolve(false);
          }
        }, (error) => {
          console.log(error);
          this.uiServ.alertaInfo('Ocurrió un problema de red. No se puede validar tu usuario en los servidores');
          this.navController.navigateRoot('/login');
        })
    });

  }


  async getUser() {
    if (!this.usuario._id) {
      await this.verificarToken();
    }
    return { ...this.usuario };
  }


  existeUsrBiometrico(cedula: string) {
    return new Promise(resolve => {
      let params: HttpParams = new HttpParams();
      params = params.append('cedula', cedula);
      this.http.get<boolean>(`${URL_BIO}/consultas/existe`, { params })
        .subscribe(res => {
          resolve(res);
        });

    });

  }


  crearUsuario(usuario: User) {
    return new Promise((resolve) => {
      this.http.post(`${URL_USR}/create`, usuario).subscribe(async res => {
        if (res['ok']) {
          await this.guardarToken(res['token']);
          resolve(true);
        } else {
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  existeUsrBDD(cedula: string) {

    let params: HttpParams = new HttpParams();
    params = params.append('cedula', cedula);
    return this.http.get(`${URL_USR}/cedula`, { params });
  }

  logout() {
    this.token = null;

    this.storage.clear();
    this.navController.navigateRoot('/login', { animated: true });

  }

  actualizarUsuario(usuario: User) {
    const headers: HttpHeaders = new HttpHeaders({
      'h-token': this.token
    });

    return new Promise(resolve => {
      this.http.post(`${URL_USR}/update`, usuario, { headers })
        .subscribe(resp => {
          if (resp['ok']) {
            this.guardarToken(resp['token']);
            resolve(true);
          } else {
            this.uiServ.presentToast('Debe iniciar sesión');
            this.navController.navigateRoot('/login', { animated: true });
            resolve(false);
          }
        });
    });
  }

  getImg(cedula: string) {
    let params: HttpParams = new HttpParams();
    params = params.append('name', cedula);
    return this.http.get(`${URL_USR}/imagen`, { params }); 
  }


  crearUsuarioBiometrico(usuario: User) {
    const data = {
      id: usuario.cedula,
      name: usuario.nombre
    }
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(`${URL_BIO}/procesos/post`, data, { headers });

  }

  findByCed(cedula: string) {

    let params: HttpParams = new HttpParams();
    params = params.append('cedula', cedula);
    return this.http.get<User>(`${URL_USR}/findByCed`, { params });
  }


   generarCod() {
    let codigo = Math.random().toString(4).substring(5, 10);
     this.storage.set('codigo', codigo);
    return codigo;
  }

  getCodigo(){
    return this.storage.get('codigo');
  }

  deleteCod(){
    this.storage.set('codigo', '');
  }

  actualizarPssw(usuario: User) {
      this.http.post(`${URL_USR}/resetPssw`, usuario)
        .subscribe(resp => {
          if (resp['ok']) {
            this.uiServ.presentToast('Clave actualizada');
            this.navController.navigateRoot('/login', { animated: true });
            this.storage.clear();
          } else {
            this.uiServ.presentToast('No se pudo actualizar');
            
          }
        });

  }



}