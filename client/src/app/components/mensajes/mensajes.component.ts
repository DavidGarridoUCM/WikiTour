import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.scss'
})
export class MensajesComponent implements OnInit {
  
  private idConv : string = "";
  private route = inject(ActivatedRoute);
  public mensajes : Array<{texto : string, tipo : string}> = [];
  public nick : string = '';
  public fotoPerfil : string = '';
  
  ngOnInit(): void {
    this.idConv = this.route.snapshot.params['id'];
    this.loadPage();
  }

  loadPage(){

  }

}
