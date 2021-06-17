import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  numRegistros:number=0;

  constructor( private asistServ: AsistenciaService) { }

  ngOnInit() {
  
  }


}
