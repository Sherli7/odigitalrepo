import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NodeService } from '../service/node.service';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-copyandmove',
  templateUrl: './copyandmove.component.html',
  styleUrls: ['./copyandmove.component.scss']
})
export class CopyandmoveComponent implements OnInit {
  selectedNode: any = null; // Le noeud sélectionné pour la copie ou le déplacement
  targetParentId: string = ''; // L'ID du dossier cible où le noeud sera copié ou déplacé
  currentNode: any[] = [];
  parentStack: string[] = []; // Pour stocker les ID des noeuds
  parentNameStack: string[] = []; // Pour stocker les noms des noeuds
  currentName: string = ''; // Nom du noeud courant

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private nodeService: NodeService,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.data.node) {
      this.selectedNode = this.data.node; // Utiliser les données injectées
    }
    this.navigateToNode(this.specNode());
  }

  copyTo(): void {
    // Assurer que selectedNode et targetParentId sont définis
    if (this.selectedNode?.entry?.id && this.targetParentId) {
      this.nodeService.copyNode(this.selectedNode.entry.id, this.targetParentId).subscribe({
        next: (response) => console.log('Node copied successfully:', response),
        error: (error) => console.error('Error copying node:', error)
      });
    } else {
      console.warn('No node selected or target parent ID not set.');
    }
  }   

  moveTo(): void {
    // Assurer que selectedNode et targetParentId sont définis
    if (this.selectedNode?.entry?.id && this.targetParentId) {
      this.nodeService.moveNode(this.selectedNode.entry.id, this.targetParentId).subscribe({
        next: (response) => console.log('Node moved successfully:', response),
        error: (error) => console.error('Error moving node:', error)
      });
    } else {
      console.warn('No node selected or target parent ID not set.');
    }
  }

  specNode(): string {
    let specNode = '';
    switch (localStorage.getItem('lastRoute')) {
      case '/dashboard/repository':
        specNode = '-root-';
        break;
      case '/dashboard/shared':
        specNode = '-shared-';
        break;
      case '/dashboard/myfiles':
        specNode = '-my-';
        break;
      default:
        break;
    }
    return specNode;
  }

  navigateToNode(nodeId: string): void {
    this.nodeService.getSpecificNode(nodeId).pipe(
      tap(data => {
        this.currentNode = data['list'].entries;
        this.currentName = this.extractNodeName(data);
        if (!this.parentStack.includes(nodeId)) {
          this.parentStack.push(nodeId);
          this.parentNameStack.push(this.currentName);
          localStorage.setItem("currentNodeIdCM", nodeId);
        }
      }),
      catchError(error => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
          this.authService.logout();
        } else {
          console.error('An error occurred:', error);
        }
        return of([]);
      })
    ).subscribe();
  }

  extractNodeName(data: any): string {
    if (data['list'].entries.length > 0) {
      return data['list'].entries[0].entry.name;
    }
    return "Root";
  }

  selectNode(node: any): void {
    this.targetParentId = node.entry.id; // Définition de la cible pour la copie ou le déplacement
  }

  findChildren(node: any): void {
    this.navigateToNode(node.entry.id);
    this.selectedNode = node; // Met à jour le noeud sélectionné pour l'action
  }

  previous(): void {
    if (this.parentStack.length > 1) {
      this.parentStack.pop();
      this.parentNameStack.pop();
      const newParentId = this.parentStack[this.parentStack.length - 1];
      this.currentName = this.parentNameStack[this.parentNameStack.length - 1];
      this.navigateToNode(newParentId);
    } else if (this.parentStack.length === 1) {
      this.navigateToNode(this.specNode());
    } else {
      console.warn('No parent node or already at root.');
    }
  }
}
