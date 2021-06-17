import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/classes/user';
import { NgForm } from '@angular/forms';
import { UiGraphicsService } from 'src/app/services/ui-graphics.service';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario : User = new User();

  constructor(private usuarioServ: UserService,
    private uiService: UiGraphicsService,
    private navController: NavController,
    private alertController: AlertController) { }
 
  async ngOnInit() {
    this.usuario = await this.usuarioServ.getUser();    
  }

   logout(){  
    this.usuarioServ.logout();
    this.uiService.presentToast('Debe iniciar sesión');      
  }

  actualizar(fActualizar: NgForm){
    let sinespacio = this.usuario.nombre.trim();
    this.usuario.nombre = this.usuario.nombre.trim();

    if(sinespacio.length != 0 ){
      const actualizado = this.usuarioServ
                        .actualizarUsuario(this.usuario);
      this.uiService.presentToast('Datos actualizados');
    }else{
      this.uiService.presentToast('El nombre no puede estar vacío');
    }

  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: '¿Está seguro que desea cerrar sesión?',
      message: 'Cerrar su sesión implica que las timbradas realizadas el día de hoy se perderán y deberá justificar en la Dirección de Talento Humano',
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
            this.logout();
          }
        }
      ]
    });

    await alert.present();
    
  }

  
}
