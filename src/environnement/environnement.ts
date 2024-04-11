// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
  };
  
  const domain='http://localhost';
  const port='8081';
  const url = domain+':'+port+'/alfresco';
  export const API = {
    LOGIN: `${url}/s/api/login`,
    NODEROOT:`${url}/api/-default-/public/alfresco/versions/1/nodes/-root-/children?alf_ticket=`,
    NODEMYFILES:`${url}/api/-default-/public/alfresco/versions/1/nodes/-my-/children?alf_ticket=`,
    NODESHARED:`${url}/api/-default-/public/alfresco/versions/1/nodes/-shared-/children?alf_ticket=`,
    SPECIFICNODE:`${url}/api/-default-/public/alfresco/versions/1/nodes/`,
    NODETYPE:`${url}/service/api/dictionary`,
    AUTHENTICATION:`${url}/api/-default-/public/authentication/versions/1/tickets`,
    DOWNLOADFILE:`${url}/service/api/node/content/`,
    DOWNLOADFILEASZIP:`${url}/api/-default-/public/alfresco/versions/1/downloads`,
    DOWNLOADZIP:`${url}/api/-default-/public/alfresco/versions/1/nodes/`,
    FILEVERSIONHISTORY:`${url}/api/-default-/public/alfresco/versions/1/nodes/`,
    CHECKVALIDTICKET:`${url}/api/-default-/public/authentication/versions/1/tickets/-me-?alf_ticket=`,
    DOWNLOADVERSIONFILE:`${url}/api/-default-/public/alfresco/versions/1/nodes/`,
    SEARCHAPI:`${url}/api/-default-/public/search/versions/1/search`,
    TRASHCANAPI:`${url}/api/-default-/public/alfresco/versions/1/deleted-nodes`,
    PEOPLE:`${url}/api/-default-/public/alfresco/versions/1`,    
  };
  