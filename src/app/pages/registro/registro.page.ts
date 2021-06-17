import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../classes/user';
import { UserService } from '../../services/user.service';
import { Asistencia } from '../../classes/asistencia';
import { AsistenciaService } from '../../services/asistencia.service';
import { UiGraphicsService } from '../../services/ui-graphics.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
//import { Server } from 'http';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  user: User = new User();
  asistencia: Asistencia = new Asistencia();
  iniciado: boolean = false;
  inicioDate: Date = null;
  registrando: boolean = false;
  iniciadoAlm: boolean = false;
  iniciadoRean: boolean = false;
  reg: number = 0;
  insertado: boolean = false;
  loading: any;


  constructor(private userService: UserService,
    private asistenciaServ: AsistenciaService,
    private uiService: UiGraphicsService,
    private geolocation: Geolocation,
    public loadingController: LoadingController,
    private alertController: AlertController) { }

  async ionViewWillEnter() {
    this.user = await this.userService.getUser();
  }

  async ngOnInit() {
    this.validarBotones();
    if (!this.user.avatar) {
      this.user.avatar = 'av-1.png';
    }
    this.loading = await this.loadingController.create({
      message: 'Guardando en biométrico'
    });

  }

  getPosicion() {
    return new Promise(resolve => {
      this.registrando = true;
      this.geolocation.getCurrentPosition({ maximumAge: 60000, timeout: 6000, enableHighAccuracy: true})
      .then((resp) => {
        this.asistencia.latitud = resp.coords.latitude;
        this.asistencia.longitud = resp.coords.longitude;
        this.registrando = false;
        resolve();
      }).catch((error) => {
        this.uiService.alertaInfo('No se puede obtener su ubicación');
        this.registrando = false;
        return;
      });
    });

  }

  async iniciar() {
    await this.getPosicion();
    this.asistenciaServ.resetAsistencias();
    this.reg = 1;
    if (this.asistencia.longitud && this.asistencia.latitud) {
      this.inicioDate = new Date();
      this.asistencia.tipo = 'I';
      this.asistencia.obs = 'Inicio'
      this.insertado = await this.registrar(this.asistencia);

      if (this.insertado) {
        this.asistencia.ord = 1;
        this.asistenciaServ.guardarAsistencia(this.asistencia);
        this.inicioOK();
        this.asistencia = new Asistencia();
      }
    } else {
      this.uiService.alertaInfo('No se puede obtener su ubicación');
      return;
    }
  }

  inicioOK() {
    this.iniciado = true
    this.iniciadoAlm = true;
  }

  async salirBreak() {
    await this.getPosicion();
    if (this.asistencia.longitud && this.asistencia.latitud) {
      this.asistencia.tipo = 'O';
      this.asistencia.obs = 'Salida a Almuerzo'
      this.insertado = await this.registrar(this.asistencia);

      if (this.insertado) {
        this.asistencia.ord = 2;
        this.asistenciaServ.guardarAsistencia(this.asistencia);
        this.uiService.delayed_notification();
        this.salidaBreak();
        this.asistencia = new Asistencia();
      }
    } else {
      this.uiService.alertaInfo('No se puede obtener su ubicación');
      return;
    }
  }

  salidaBreak() {
    this.iniciadoAlm = false;
    this.iniciadoRean = true;
    this.iniciado = true;
  }

  async reanudar() {
    await this.getPosicion();
    if (this.asistencia.longitud && this.asistencia.latitud) {
      this.asistencia.tipo = 'I';
      this.asistencia.obs = 'Regreso a Actividades'
      this.insertado = await this.registrar(this.asistencia);

      if (this.insertado) {
        this.asistencia.ord = 3;
        this.asistenciaServ.guardarAsistencia(this.asistencia);
        this.reanudarOK();
        this.asistencia = new Asistencia();
      }
    } else {
      this.uiService.alertaInfo('No se puede obtener su ubicación');
      return;
    }
  }


  reanudarOK() {
    this.iniciado = true;
    this.iniciadoAlm = false;
    this.iniciadoRean = false;
  }

  async finalizar() {
    await this.getPosicion();
    if (this.asistencia.longitud && this.asistencia.latitud) {
      this.asistencia.tipo = 'O';
      this.asistencia.obs = 'Finaliza Actividades'
      this.insertado = await this.registrar(this.asistencia);

      if (this.insertado) {
        this.asistencia.ord = 4;
        this.asistenciaServ.guardarAsistencia(this.asistencia);
        this.finalizarOK();
        this.asistencia = new Asistencia();
      }
    } else {
      this.uiService.alertaInfo('No se puede obtener su ubicación');
      return;
    }
  }

  finalizarOK() {
    this.iniciado = false;
    this.iniciadoRean = false;
    this.iniciadoAlm = false;
  }


  async presentLoading() {
    await this.loading.present();
  }

  registrar(asist: Asistencia): Promise<boolean> {
    
    let fecha = moment().format('MM/DD/YYYY HH:mm:ss');
    return new Promise(async resolve => {
      this.presentLoading();
      asist.fecha = new Date();

      this.asistencia.usuario = this.user.cedula;
      await this.asistenciaServ.registrarAsistencia(asist)
        .subscribe(res => {
          if (res['ok']) {
            this.asistenciaServ.insertarAsis(asist, fecha).then(res => {
              if (res['ok']) {
                this.uiService.alertaInfo('Registro Almacenado');
                this.loading.dismiss();
                resolve(true);
              } else {
                this.uiService.alertaInfo('Ocurrió un error al insertar');
                this.loading.dismiss();
                resolve(false);
              }

            });

          } else {
            this.uiService.presentToast(res['mensaje']);
            this.loading.dismiss();
          }

        });
    });


  }

  async validarBotones() {
    let asist: Asistencia[] = await this.asistenciaServ.cargarAsistencias();
    let ord: number = asist[0].ord || 0;
    for (let item of asist) {
      if (item.ord === 1) {
        this.inicioDate = item.fecha;
      }
    }

    switch (ord) {
      case 1:
        this.inicioOK();
        break;
      case 2:
        this.salidaBreak();
        break;
      case 3:
        this.reanudarOK();
        break;
      case 4:
        this.finalizarOK();
        break;
    }

  }


  async showAlert() {
    const alert = await this.alertController.create({
      header: '¿Está seguro que desea registrar Fin de Jornada?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'err',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, 
        {
          text: 'OK',
          handler:  (data) => {
            this.finalizar();
          }
        }
      ]
    });

    await alert.present();
    
  }

}
