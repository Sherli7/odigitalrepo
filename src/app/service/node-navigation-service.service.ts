import { Injectable } from '@angular/core';
import { NodeService } from './node.service';

@Injectable({
  providedIn: 'root'
})
export class NodeNavigationService {
  // Logique partagée ou données ici

  constructor(private nodeService: NodeService) {}

  findChildren(nodeid: string): void {
    this.nodeService.getSpecificNode(nodeid).subscribe(
      (data: any) => {
      }
    );
  }
}
