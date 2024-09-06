import { Component, DoCheck, inject, OnInit } from '@angular/core';
import { PubliService } from '../../services/publi.service';
import { publi } from '../../models/publicacion';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgArrayPipesModule } from 'ngx-pipes';
import { UsersService } from '../../services/users.service';
@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [RouterLink, FormsModule,  NgxPaginationModule, NgArrayPipesModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements OnInit{
  private publiService = inject(PubliService); 
  private usersService = inject(UsersService);
  public publis : Array<publi> = [];
  public p: number = 1;
  public id: any;
  public search : string = '';
  private route = inject(ActivatedRoute);
  public url: string = 'http://localhost:3800/publi/fotoPortada/';
  public urlUser: string = 'http://localhost:3800/user/fotoPerfil/';

  ngOnInit(): void {
    this.id = this.usersService.getIdentity()._id;
    this.getPublis(this.id);
  }

  getPublis(id: any){
    this.publiService.getPublisFoll(id).subscribe(
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
