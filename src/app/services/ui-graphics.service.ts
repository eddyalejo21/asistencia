import { Attribute, Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { MaxLengthValidator } from '@angular/forms';
import { kMaxLength } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class UiGraphicsService {

  cedula:string;

  constructor(public alertController: AlertController,
    private toastController: ToastController,
    private localNotifications: LocalNotifications) { }

    async alertaInfo(message: string) {
      const alert = await this.alertController.create({
        message,
        buttons: ['OK']
      });
  
      await alert.present();
    }
  
    async presentToast(message : string) {
      const toast = await this.toastController.create({
        message,
        position: 'bottom',
        duration: 2000,
        animated: true,
        mode: 'ios',
        cssClass: 'toast'
      });
      toast.present();
    }


    async presentToastTOP(message : string) {
      const toast = await this.toastController.create({
        message,
        position: 'top',
        duration: 8000,
        animated: true,
        mode: 'ios',
        cssClass: 'toast'
      });
      toast.present();
    }

    async presentAlert() {
      const alert = await this.alertController.create({
        header: 'No tiene correo registrado',
        message: 'Comuníquese con la Dirección de Talento Humano para registrar su correo electrónico',
        buttons: ['OK']
      });
  
      await alert.present();
    }



    single_notification() {
      this.localNotifications.schedule({
        id: 1,
        title: 'Timbrar',
        foreground: true,
        text: 'Es hora de regresar al trabajo ',
        attachments: ['file://assets/logos/epmmop.png'],
        smallIcon: 'res:'
      });
    }
  
        
    delayed_notification() {
     let registro = new Date();
      

      this.localNotifications.schedule({
        title: 'Timbrar',
        foreground: true,
        text: `Es hora de regresar al trabajo, ud. registró su salida a almorzar :${new Date()}`,
        trigger: { at: new Date(new Date().getTime() + 1680000) },
        led: 'FF0000',
        sound: null,
        wakeup: true
      });
    }
     
}
