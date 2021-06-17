import { Component, OnInit } from '@angular/core';
import { EmptyError } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';
import { UiGraphicsService } from '../../services/ui-graphics.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  codigo: string;
  clave: string;
  clave2: string;
  icon = 'eye-outline';
  iconSrc = '/assets/svg/monkey.svg'
  showPassword = false;
  codBDD: string;
  valido= true;
  user: User;

  constructor(private usrService: UserService,
    private uiServ: UiGraphicsService) { }


  async ngOnInit() {
    this.codBDD = await this.usrService.getCodigo();
    this.user = this.usrService.usuario;
  }

  async reset(fRegistro: NgForm) {   

    if(this.clave === this.clave2){
      if(this.codBDD.length === 0){
        this.codBDD = await this.usrService.getCodigo();
      }
  
      if(this.codigo === this.codBDD){
        
        this.user.clave = this.clave;
        this.usrService.actualizarPssw(this.user);
      }else{
        this.uiServ.alertaInfo('El código es incorrecto');
      }
    }else{
      this.uiServ.presentToast('Las claves no coinciden');
    }


  }

  show() {
    this.showPassword = !this.showPassword;
    if (this.icon === 'eye-outline') {
      this.icon = 'eye-off'
      this.iconSrc = '/assets/svg/monkey-off.svg'
    } else {
      this.icon = 'eye-outline'
      this.iconSrc = '/assets/svg/monkey.svg'
    }
  }


  verificarPssw(){
   if(this.clave === this.clave2){
      this.valido= true;
    }else{
      this.valido= false;
    }
  }

}