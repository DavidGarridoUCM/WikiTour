import { Component, inject, OnInit } from '@angular/core';
import { PubliService } from '../../services/publi.service';
import { publi } from '../../models/publicacion';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-show-publis',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-publis.component.html',
  styleUrl: './show-publis.component.scss'
})
export class ShowPublisComponent implements OnInit{

  private publiService = inject(PubliService); 
  public publis : Array<publi> = [];

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(){
    this.publiService.getPublis().subscribe(
      {next: (response) => {
        if(response != undefined){
          this.publis = response; 
          console.log(response);
        }
      },
      error: (e) => console.error(e)
      }
    )
  }

}
