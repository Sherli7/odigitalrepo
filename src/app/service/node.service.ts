import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API } from '../../environnement/environnement';
@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(private http: HttpClient) { }

  copyNode(nodeId: string, targetParentId: string) {
    const url = `${API.SPECIFICNODE}${nodeId}/copy?alf_ticket=${localStorage.getItem('token')}`;
    const body = { targetParentId: targetParentId };
    return this.http.post(url, body);
  }
  getFolderRoot(specNode:string): Observable<any> {
      return this.http.get(API.SPECIFICNODE+specNode+'/children?alf_ticket='+localStorage.getItem('token')+'&include=isFavorite,permissions,isLocked');
  }

  moveNode(nodeId: string, targetParentId: string): Observable<any> {
    const url = `${API.SPECIFICNODE}${nodeId}/move?alf_ticket=${localStorage.getItem('token')}`;
    let body = { targetParentId };
    return this.http.post(url, body);
  }

  getPeopleFavorite(): Observable<any> {
    return this.http.get(API.PEOPLE+'/people/-me-/favorites?alf_ticket='+localStorage.getItem('token')+"&include=path");
}

getPeople(): Observable<any> {
  return this.http.get(API.PEOPLE+'/people?alf_ticket='+localStorage.getItem('token'));
}
getPeopleFavoriteID(favoriteId:string): Observable<any> {
  return this.http.get(API.PEOPLE+'/people/-me-/favorites/'+favoriteId+'?alf_ticket='+localStorage.getItem('token')+"&include=path");
}
  
removeFavorite(favoriteId: string): Observable<any> {
  const url = `${API.PEOPLE}/people/-me-/favorites/${favoriteId}?alf_ticket=${localStorage.getItem('token')}`;
  return this.http.delete<any>(url);
}

favoriteID(guid: string,f:string): Observable<any> {
  const url = `${API.PEOPLE}/people/-me-/favorites`; // Constructing the endpoint URL
  let content='';
  if(f=='file'){
    content='file'
  }else{
    content='folder'
  }
  const body = {
    target: {
      [content]:{
        guid: guid
      }
    }
  };

  const params = new HttpParams().set('alf_ticket', localStorage.getItem('token')||'');

  return this.http.post(url, body, { params: params }); // Using HttpParams to include the token as query parameter
}



  getCurrentNode(event: string): Observable<any> {
    return this.http.get(`${API.SPECIFICNODE}${event}?alf_ticket=${localStorage.getItem('token')}&include=isFavorite,properties,permissions`);
  }

  getSpecificNode(event: string): Observable<any> {
    return this.http.get(`${API.SPECIFICNODE}${event}/children?alf_ticket=${localStorage.getItem('token')}&include=isFavorite`);
  }

  uploadFile(data: any): Observable<any> {
    return this.http.post(`${API.SPECIFICNODE}${localStorage.getItem('currentNodeId')}/children?alf_ticket=${localStorage.getItem('token')}`, data);
  }

  getNodeTypeDefinition(): Observable<any> {
    return this.http.get(`${API.NODETYPE}?alf_ticket=${localStorage.getItem('token')}&fields=nodeType`);
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
  

  downloadFileVersion(nodeId: string, versionId: string): Observable<HttpResponse<Blob>> {
    const url = `${API.DOWNLOADVERSIONFILE}${nodeId}/versions/${versionId}/content?alf_ticket=${localStorage.getItem('token')}`;
    return this.http.get(url, { observe: 'response', responseType: 'blob' });
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


  moveOrCopyNode(nodeId: string, targetParentId: string, newName?: string): Observable<any> {
    const moveUrl = `${API.SPECIFICNODE}/${nodeId}/move?alf_ticket='${localStorage.getItem('token')}`;

    const body = {
      targetParentId: targetParentId,
      name: newName ? newName : undefined
    };

    return this.http.post(moveUrl, body).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
  createNode(specNode:any,nodeData: any) {
    return this.http.post(API.SPECIFICNODE+specNode+'/children?alf_ticket='+localStorage.getItem('token'), nodeData);
  }

  updateNode(specNode:any,nodeData: any) {
    return this.http.put(API.SPECIFICNODE+specNode+'?alf_ticket='+localStorage.getItem('token'), nodeData);
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

  searchFullText(query: string): Observable<any> {
    const requestBody = {
      query: {
        query: `SELECT * FROM cmis:folder WHERE cmis:name LIKE '${query}%'`,
        language:'cmis'
      },
    };
    return this.http.post(API.SEARCHAPI+'?alf_ticket='+localStorage.getItem('token'), requestBody);
  }
  

  deleteNode(nodeId: string): Observable<any> {
    return this.http.delete(`${API.SPECIFICNODE}${nodeId}?alf_ticket=${localStorage.getItem('token')}`);
  }

  getDeleteNode(): Observable<any> {
    return this.http.get(`${API.TRASHCANAPI}?alf_ticket=${localStorage.getItem('token')}&include=path,permissions`);
  }


  restoreDeletedNode(nodeId:string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',// Remplacez par vos identifiants
    });
    return this.http.post(`${API.TRASHCANAPI}/${nodeId}/restore?alf_ticket=${localStorage.getItem('token')}`,headers);
  }

  permanentlyDelete(nodeId:string) {
    return this.http.delete(`${API.TRASHCANAPI}/${nodeId}?alf_ticket=${localStorage.getItem('token')}`);
  }

  getDeletedNodePath(nodeId:string) {
    return this.http.get(`${API.TRASHCANAPI}/${nodeId}/restore?alf_ticket=${localStorage.getItem('token')}`);
  }
  
  getAccountProperties(personId:String){
    return this.http.get(API.PEOPLE+'/people/'+localStorage.getItem('userId')+'?alf_ticket='+localStorage.getItem('token'));
  }

  getAccountAvatar(): Observable<any> {
    // Assuming API.PEOPLE is the correct endpoint and you have to replace '-me-' with the actual personId
    return this.http.get(`${API.PEOPLE}/people/`+localStorage.getItem('userId')+`/avatar?alf_ticket=${localStorage.getItem('token')}`,{ responseType: 'blob' });
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    const body = {
      oldPassword: oldPassword,
      password: newPassword
    };

    return this.http.put(API.PEOPLE+'/people/'+localStorage.getItem('userId')+'?alf_ticket='+localStorage.getItem('token'), body); // Replace with your API endpoint
  }

  getMyGroup(){
    return this.http.get(`${API.PEOPLE}/people/`+localStorage.getItem('userId')+`/groups?alf_ticket=${localStorage.getItem('token')}`);
  }

  getGroups(){
    return this.http.get(`${API.PEOPLE}/groups?alf_ticket=${localStorage.getItem('token')}&where=(isRoot=true)`);
  }

  getMyRelativePath(folder:string,relativePath:string){
    return this.http.get(`${API.SPECIFICNODE}${folder}/children?alf_ticket=${localStorage.getItem('token')}&relativePath=${relativePath}`);
  }
}
