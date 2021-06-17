import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../classes/user';
import { IonSlides, NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UiGraphicsService } from '../../services/ui-graphics.service';
import { MailService } from '../../services/mail.service';
import { Mail } from 'src/app/classes/mail';
import { MaxLengthValidator } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal', { static: true }) slides: IonSlides;
  user: User = new User();

  registerUser: User = new User();
  avatar: string;
  inputCedula: string;
  loading: any;
  cedulaPass: string;
  userPss: User = new User();
  mail: Mail= new Mail();

  constructor(private navCtrl: NavController,
    private userService: UserService,
    private uiService: UiGraphicsService,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private mailService: MailService) { }

  ngOnInit() {
    this.slides.lockSwipes(true);

  }

  async crearLoading(message: string) {
    this.loading = await this.loadingController.create({
      message
    });
    this.loading.present();
  }

  async send() {

    const ok = await this.userService.login(this.user.cedula, this.user.clave);
    if (ok) {
      this.navCtrl.navigateRoot('/tabs/jornada', { animated: true });

    } else {
      this.uiService.alertaInfo('Credenciales incorrectas');
    }
  }

  mostrarLogin() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

  mostrarRegistro() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }


  consultarCedula() {

    let existe: boolean = false;
    this.userService.existeUsrBDD(this.inputCedula).subscribe(res => {
      existe = res['ok'];
      if (existe) {
        this.uiService.presentToast('Usuario ya existe');
        return;
      }
      this.registerUser = this.userService.getMailFromDist(this.inputCedula);
    });

  }

  async registrar(fRegistro: NgForm) {
    let cedula = '';
    if (this.registerUser.cedula.startsWith('0')) {
      cedula = this.registerUser.cedula.substr(1);
    } else {
      cedula = this.registerUser.cedula;
    }

    const existe = await this.userService.existeUsrBiometrico(cedula);
    this.registerUser.avatar = this.avatar;
    if (!existe) {
      //this.crearLoading('Creando usuario en biométrico');
      this.userService.crearUsuarioBiometrico(this.registerUser)
        .subscribe(async res => {
          
          if (res['status'] === 201) {
            this.uiService.presentToastTOP('Usuario creado en biométrico');
            const ok = await this.userService.crearUsuario(this.registerUser)
            if (ok) {
              this.mostrarLogin();
              this.uiService.presentToast('Usuario creado')
              this.user = this.userService.usuario;
            } else {
              this.uiService.presentToast('No se pudo registrar')
            }
          }
        }, error => {
          console.log(error);
          this.uiService.presentToastTOP('No se pudo crear usuario en biométrico');
        });
      this.loading.dismiss();
    }
    //this.uiService.presentToast('creando...')
    const ok = await this.userService.crearUsuario(this.registerUser)
    if (ok) {
      this.mostrarLogin();
      this.uiService.presentToast('Usuario creado')
      this.user = this.userService.usuario;
    } else {
      this.uiService.presentToast('No se pudo registrar')
    }

  }

 
    async reset() {
      const alert = await this.alertController.create({
        header: 'Resetear contraseña',  
        inputs: [
          {
            name: 'ced',
            type: 'text',
            placeholder: 'Ingrese su cédula'
          },
        ],
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
              let resultado: any;
              this.cedulaPass=data.ced;
               this.userService.findByCed(this.cedulaPass).subscribe( async res=>{             
                resultado = await res;
                
                if(res['ok']){
                  this.userPss = res['user'];
                  this.mail.cedula = (this.userPss.cedula);                  
                  this.mail.codigo = this.userService.generarCod();
                  this.mail.nombre = this.userPss.nombre;
                  this.mail.mail = this.userPss.email;
                  this.userService.usuario = this.userPss;
                  this.mailService.enviarMail(this.mail).subscribe(res=>{
                    console.log(res);
                    
                  });
                  this.navCtrl.navigateRoot('/reset');
                }else{
                  this.uiService.presentToast(`No existe usuario con cédula ${this.cedulaPass}`);
                }
               });
            }
          }
        ]
      });
  
      await alert.present();
      
    }


}
