import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { UiGraphicsService } from 'src/app/services/ui-graphics.service';
import { Asistencia } from 'src/app/classes/asistencia';
import { AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  usuario : User = new User();
  asistencias: Asistencia[] =[];
  @Output() numReg = new EventEmitter<number>();

  constructor(private usuarioServ: UserService,
    private uiService: UiGraphicsService,
    private asistServ: AsistenciaService) { }
 
  async ngOnInit() {   
    
    this.usuario = await this.usuarioServ.getUser(); 
    this.asistServ.getAsistencias(this.usuario.cedula).subscribe( res => {
      this.asistencias = res; 
      this.usuarioServ.crearUsuarioBiometrico(this.usuario);     
    });
    this.asistServ.registroInsertado.subscribe(res => {
      this.asistencias.unshift( res ); 
    }
    );
    
  }

  doRefresh(event){
    this.asistServ.getAsistencias(this.usuario.cedula).subscribe( res => {
      this.asistencias = res;  
      event.target.complete();    
    });
  }

}

