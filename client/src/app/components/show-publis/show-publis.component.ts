import { Component, DoCheck, inject, OnInit } from '@angular/core';
import { PubliService } from '../../services/publi.service';
import { publi } from '../../models/publicacion';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgArrayPipesModule } from 'ngx-pipes';

@Component({
  selector: 'app-show-publis',
  standalone: true,
  imports: [RouterLink, FormsModule,  NgxPaginationModule, NgArrayPipesModule],
  templateUrl: './show-publis.component.html',
  styleUrl: './show-publis.component.scss'
})
export class ShowPublisComponent implements OnInit, DoCheck{

  private publiService = inject(PubliService); 
  public publis : Array<publi> = [];
  public p: number = 1;
  public search : string = '';
  private route = inject(ActivatedRoute);
  public url: string = 'http://localhost:3800/publi/fotoPortada/';
  public urlUser: string = 'http://localhost:3800/user/fotoPerfil/';

  ngDoCheck(): void {
    if(this.route.snapshot.params['search']){
      if(this.search != this.route.snapshot.params['search']){
        this.search = this.route.snapshot.params['search'];
        this.lista();
      }
    }
  }

  ngOnInit(): void {
    if(this.route.snapshot.params['search']){
      this.search = this.route.snapshot.params['search'];
      this.lista();
    }
    else{
      this.lastPublis();
    }
  }

  lista(): void {
    let wordSearch = this.search;
  setTimeout(() => {
      if (wordSearch == this.search) {
        if(this.search.length > 0){
          this.getPublis(this.search);
        }
        else if(this.search.length == 0){
          this.lastPublis();
        }
      }
  }, 700);
  }

  lastPublis(){
    this.publiService.lastPublis().subscribe(
      {next: (response) => {
        if(response != undefined){
          this.publis = response;
        }
      },
      error: (e) => console.error(e)
      }
    )
  }

  getPublis(search : string){
    this.publiService.getPublis(search).subscribe(
      {next: (response) => {
        if(response != undefined){
          this.publis = response;
        }
      },
      error: (e) => console.error(e)
      }
    )
  }

  pageChanged(e:any){
    this.p = e;
  }

}
