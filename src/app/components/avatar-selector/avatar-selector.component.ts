import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
})
export class AvatarSelectorComponent implements OnInit {

  @Output() avatarSeleccionado = new EventEmitter();
  @Input() avatar ='av-1.png';
  avatars = [
    {
      img: 'av-1.png',
      seleccionado: true
    },
    {
      img: 'av-3.png',
      seleccionado: false
    },
    {
      img: 'av-5.png',
      seleccionado: false
    },
    {
      img: 'av-8.png',
      seleccionado: false
    }
  ];
  
  avatarSlide = {
    slidesPerView: 3.5
  }

  constructor(private userService: UserService) { }

  ngOnInit() {
    let cedula= this.userService.usuario.cedula;
    this.userService.getImg(`${this.userService.usuario.cedula}.png`).subscribe(
      result => {
        if(result['ok']){
          this.avatars.push({
              img: `${cedula}.png`,
              seleccionado: false
            });
        }
      }
    );


    this.avatars.forEach(av => av.seleccionado = false);
    for(const avatar of this.avatars){      
      if(avatar.img === this.avatar){
        avatar.seleccionado = true;
        break;
      }
    }
    
  }

  seleccionarAvatar(avatar) {
    this.avatars.forEach(av => av.seleccionado = false);
    avatar.seleccionado = true;
    this.avatarSeleccionado.emit( avatar.img);
    console.log('usuario ',avatar.img );
    
  }

}
