import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private http: HttpClient) { }

  getFolderRoot(): Observable<any> {
    return this.http.get(`${API.NODEROOT}${localStorage.getItem('token')}`);
  }
  getFolderShared(): Observable<any> {
    return this.http.get(`${API.NODESHARED}${localStorage.getItem('token')}`);
  }

  getFolderMyFiles(): Observable<any> {
    return this.http.get(`${API.NODEMYFILES}${localStorage.getItem('token')}`);
  }

  getSpecificNode(event: string): Observable<any> {
    return this.http.get(`${API.SPECIFICNODE}${event}/children?alf_ticket=${localStorage.getItem('token')}`);
  }

  uploadFile(data: any): Observable<any> {
    return this.http.post(`${API.SPECIFICNODE}${localStorage.getItem('currentNodeId')}/children?alf_ticket=${localStorage.getItem('token')}`, data);
  }

  getNodeTypeDefinition(): Observable<any> {
    return this.http.get(`${API.NODETYPE}?alf_ticket=${localStorage.getItem('token')}`);
  }
  

  downloadFile(nodeId: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${API.DOWNLOADFILE}workspace/SpacesStore/${nodeId}?alf_ticket=${localStorage.getItem('token')}`, { observe: 'response', responseType: 'blob' });
  }

  downloadFileAsZip(nodeId: string): Observable<Blob>  {
    return this.http.get(`${API.DOWNLOADZIP}${nodeId}/content?alf_ticket=${localStorage.getItem('token')}`, {responseType: 'blob' });
  }

  multipleFilesAsZip(body: any): Observable<HttpResponse<any>> {
    const url = `${API.DOWNLOADFILEASZIP}?alf_ticket=${localStorage.getItem('token')}`;
    return this.http.post(url, body, { observe: 'response' });
  }
  
  checkZipStatus(nodeId: string): Observable<HttpResponse<any>> {
    return this.http.get(`${API.DOWNLOADFILEASZIP}/${nodeId}?alf_ticket=${localStorage.getItem('token')}`, { observe: 'response' });
  }
  

  getmultipleFilesAsZip(nodeId:string) {
    return this.http.get(`${API.DOWNLOADFILEASZIP}/${nodeId}?alf_ticket=${localStorage.getItem('token')}`);
  }
  getVersionHistory(nodeId: string): Observable<any> {
    return this.http.get(`${API.FILEVERSIONHISTORY}${nodeId}/versions?alf_ticket=${localStorage.getItem('token')}`);
  }
  
  downloadFileVersion(nodeId: string, versionId: string): Observable<Blob> {
    return this.http.get(`${API.FILEVERSIONHISTORY}${nodeId}/versions/${versionId}/content?alf_ticket=${localStorage.getItem('token')}`, { responseType: 'blob' });
  }

  updateFileContent(nodeId: string, file: File, majorVersion: boolean, comment: string) {
    const headers = new HttpHeaders({
      'Content-Type': file.type,
      'Accept': 'application/json',
      // Include other headers like Authorization if needed
    });
    const formData = new FormData();
    formData.append('file', file, file.name);
    
    const queryParams = {
      majorVersion: majorVersion.toString(),
      comment: comment,
      // Include other query parameters if needed
    };
    const url = API.FILEVERSIONHISTORY+nodeId+'/content?majorVersion='+queryParams.majorVersion+'&comment='+queryParams.comment+'&alf_ticket='+localStorage.getItem('token');
    return this.http.put(url, formData,{headers});
  }


  createNode(nodeData: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',// Remplacez par vos identifiants
    });
    return this.http.post(API.NODEMYFILES+localStorage.getItem('token'), nodeData, { headers });
  }

  addComment(nodeId:string,comment: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',// Remplacez par vos identifiants
    });
    return this.http.post(API.SPECIFICNODE+nodeId+'/comments?alf_ticket='+localStorage.getItem('token'), comment, { headers });
  }

  getComment(nodeId: any) {
    return this.http.get(API.SPECIFICNODE+nodeId+'/comments?alf_ticket='+localStorage.getItem('token'));
  }
  
}
