import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { NodeService } from '../service/node.service';

@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrl: './version-history.component.scss'
})
export class VersionHistoryComponent implements OnInit{
constructor(@Inject(MAT_DIALOG_DATA) public data: any,private node:NodeService){}
versions:any;
displayedColumns: string[] = ['name', 'title', 'created', 'modified', 'mimeTypeName','version','action'];
selectedFile: File | null = null;
  majorVersion = false;
  comment = '';
 
ngOnInit(): void {
  this.node.getVersionHistory(this.data.nodeid).subscribe((res:any)=>{
    this.versions=res['list'].entries;
    console.log(res['list'].entries);
  });
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  onSubmit() {
    if (this.selectedFile) {
      this.node.updateFileContent(this.data.nodeid, this.selectedFile, this.majorVersion, this.comment)
        .subscribe(response => {
          console.log(response);
          // Handle the response
        }, error => {
          console.error(error);
          // Handle the error
        });
    }
  }

}
