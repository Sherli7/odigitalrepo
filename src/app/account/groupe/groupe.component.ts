import { Component, OnInit } from '@angular/core';
import { NodeService } from '../../service/node.service';

@Component({
  selector: 'app-groupe',
  templateUrl: './groupe.component.html',
  styleUrl: './groupe.component.scss'
})
export class GroupeComponent implements OnInit{

  groups:any

  constructor(private node:NodeService){

  }

  ngOnInit(): void {
    this.node.getMyGroup().subscribe((grp:any)=>{
      console.log(grp['list'].entries);
      this.groups=grp['list'].entries;
    })
  }

}
