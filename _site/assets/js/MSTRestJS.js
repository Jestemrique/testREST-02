class MSTRestJS{
  
  host = null;
  port = null;
  loginMode = null;
  restApiUrl = null; 
  libraryAppUrl = null;
  persistLocalStorage = true;
  token = null;
  projectsList = null;
  dossiersList = null;
  userInfo = {};


  constructor( options){
    this.host = options.host;
    this.port = options.port;
    this.loginMode = options.loginMode;
    this.restApiUrl = options.restApiUrl;
    this.libraryAppUrl = options.libraryAppUrl;
    if (options.persistLocalStorage){
      localStorage.setItem('mstrInfo', JSON.stringify(options)); 
    }
  }//End constructor().

  doAuthenticate(authInfo){
    let endPoint = this.restApiUrl + '/auth/login';
    let userInfo = {
         username: authInfo.username,
         password: authInfo.password,
         loginMode: this.loginMode
        };
    let fetchMethod = 'POST';
    let fetchHeaders = {
         'content-type': 'application/json',
         'accept': 'application/json',
        };
    return fetch(endPoint,{
                          credentials: 'include',
                          method: fetchMethod,
                          body: JSON.stringify(userInfo),
                          headers: fetchHeaders
                          })
          .then( response => {
            if (response.ok){
              this.token = response.headers.get('X-MSTR-AuthToken');
              if (this.persistLocalStorage) {
                localStorage.setItem('mstrInfo', JSON.stringify(this)); 
              }    
              return this.token;
            }
            else{
              thow("Error: " + response.status + '-' + response.statusText);
            }
          })
          .catch( error => {
            console.log("Error: " + error);
          });
  }//End doAuthenticate().


getSessionUserInfo(authToken){

  let endPoint = this.restApiUrl + '/sessions/userInfo';
  let fetchMethod = 'GET';
  let fetchHeaders = {
    'content-type': 'application/json',
    'X-MSTR-AuthToken': authToken
  };
  return fetch(endPoint, {
    credentials: 'include',
    method: fetchMethod,
    headers: fetchHeaders
  })
  .then( response => response.json() )
  .then( json => {
    this.userInfo.fullName = json.fullName;
    this.userInfo.userID = json.id;
    this.persistMstrInfoChanges('userInfo', this.userInfo);
    return this.userInfo.fullName;
  })
  .catch( (error) => {
    console.log("Error => " + error);
  });

}//End getSessionUserInfo()


getUserInfo(authToken, userID){
    let endPoint = this.restApiUrl + '/users/' + userID;
    let fetchMethod = 'GET';
    let fetchHeaders = {
      'content-type': 'application/json',
      'X-MSTR-AuthToken': authToken
    };
    return fetch(endPoint, {
      credentials: 'include',
      method: fetchMethod,
      headers: fetchHeaders
    })
    .then( response => response.json())
    .then( json => {
      this.userInfo.fullName = json.name;
      this.userInfo.dateCreated = json.dateCreated;
      this.userInfo.groups = json.memberships.map( group => {return {"name": group.name} });
      this.persistMstrInfoChanges('userInfo', this.userInfo);
      return this.userInfo;
    })
    .catch( error => {
      console.log("Error => " + error);
    });

}


getProjects(authToken){
    let endPoint = this.restApiUrl + '/projects';
    let fetchMethod = 'GET';
    let fetchHeaders = {
        'content-type': 'application/json',
        'X-MSTR-AuthToken': authToken,
      };
     return fetch(endPoint, {
        credentials: 'include',
        method: fetchMethod,
        headers: fetchHeaders
      })
    .then( response => response.json()) 
    .then( json => {
        this.projectsList = json.map( project => { return {"id":project.id, "name":project.name} });
        this.persistMstrInfoChanges('projectsList', this.projectsList);
        return this.projectsList;
    })
    .catch( (error) => {
        console.log("Error=>" + error);
    });
   
}//End getProjects();


getDossiers(authToken, flagDossierInfo = 'DEFAULT'){
    let endPoint = this.restApiUrl + '/library?outputFlag=' + flagDossierInfo ;
    let fetchOptions= {
            credentials: 'include',
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-mstr-authToken': authToken
            }
    };
    return fetch(endPoint, fetchOptions)
      .then( response => response.json() )
      .then( data => {
        this.dossiersList = data.map( dossier => { return { "id": dossier.id, 
                                                            "name": dossier.name, 
                                                            "projectId": dossier.projectId, 
                                                            "targetId": dossier.target.id, 
                                                            "owner": dossier.target.owner.name, 
                                                            "coverUrl": dossier.target.coverPageURL !== "" ? dossier.target.coverPageURL : "https://via.placeholder.com/350x150.png?text=Default+Dossier+Cover+Image", 
                                                            "description": dossier.description, "lastUpdated": dossier.lastModifiedTime 
                                                          }})
        this.persistMstrInfoChanges('dossiersList', this.dossiersList);
        return this.dossiersList;
      })
      .catch( (error) => {
        console.log("[jslibrary.js::getDossiersList][Error]: " + error);
      });
}//End getDossiersList()



  persistMstrInfoChanges(property, value){
    let tempMstr = JSON.parse(localStorage.getItem('mstrInfo'));
    
    switch (property) {
      case 'projectsList':
        console.log("Persisting projects");
        tempMstr['projectsList'] = value;
        break;
      case 'dossiersList':
        console.log("Persisting dossiers");
        tempMstr['dossiersList'] = value;
        break;
      case 'userInfo':
        console.log('Persisting userinfo');
        tempMstr['userInfo'] = value;
        break;
      default:
        console.log("Any other option to persist.");
        break;
    }
    localStorage.setItem('mstrInfo', JSON.stringify(tempMstr));
  }//End persistMstrInfoChanges()





}//End MSTRestJS

















//   persistMstrInfoChanges(property, value){
//     let tempMstr = JSON.parse(localStorage.getItem('mstrInfo'));
    
//     switch (property) {
//       case 'projectsList':
//         console.log("Persisting projects");
//         tempMstr['projectsList'] = value;
//         break;
//       case 'dossiersList':
//         console.log("Persisting dossiers");
//         for (let  project of tempMstr.projectsList) {
//           let dossiersToInsert = value.filter( dossierElement => dossierElement.projectId === project.id);
//           project.dossiersList = dossiersToInsert;
//         }
//         break;
//       default:
//         console.log("Any other option to persist.");
//         break;
//     }
//     localStorage.setItem('mstrInfo', JSON.stringify(tempMstr));
//   }//End persistMstrInfoChanges()

//   doAuthenticate(authInfo){
//     let endPoint = this.baseURL + '/auth/login';
//     let userInfo = {
//         username: authInfo.username,
//         password: authInfo.password,
//         loginMode: this.loginMode
//     };
//     let fetchMethod = 'POST';
//     let fetchHeaders = {
//         'content-type': 'application/json',
//         'accept': 'application/json',
//       };

//     return fetch ( endPoint, {
//         credentials: 'include',
//         method: fetchMethod,
//         body: JSON.stringify(userInfo),
//         headers: fetchHeaders
//         })
//     .then( (response) => {
//         if (response.ok){
//             this.token = response.headers.get('X-MSTR-AuthToken');
//             localStorage.setItem('mstrInfo', JSON.stringify(this));
//             return this.token;
//         }
//         else{
//             throw("Error: " + response.status + response.statusText);
//         }
//     })
//     .catch( (error) => {
//           console.log("Error: " + error)
//     }  );
// }//End Authenticate.



// getProjects(authToken){
//     let endPoint = this.baseURL + '/projects';
//     let fetchMethod = 'GET';
//     let fetchHeaders = {
//         'content-type': 'application/json',
//         'X-MSTR-AuthToken': authToken,
//       };
    
//      return fetch(endPoint, {
//         credentials: 'include',
//         method: fetchMethod,
//         headers: fetchHeaders
//       })
//     .then( response => response.json() ) 
//     .then( json => {
//         this.projectsList = json.map( project => { return {"id":project.id, "name":project.name} });
//         this.persistMstrInfoChanges('projectsList', this.projectsList);
//         return this.projectsList;
//     })
//     .catch( (error) => {
//         console.log("Error" + error);
//     });
   
// }//End getProjects();



// getDossiers(authToken, flagDossierInfo = 'DEFAULT'){
//     let endPoint = this.baseURL + '/library?outputFlag=' + flagDossierInfo ;
//     let fetchOptions= {
//             credentials: 'include',
//             method: 'GET',
//             headers: {
//                 'accept': 'application/json',
//                 'x-mstr-authToken': authToken
//             }
//     };
//     return fetch(endPoint, fetchOptions)
//       .then( response => response.json() )
//       .then( data => {
//         this.dossiersList = data.map( dossier => { return {"id": dossier.id, "name": dossier.name, "projectId": dossier.projectId, "targetId": dossier.target.id}})
//         this.persistMstrInfoChanges('dossiersList', this.dossiersList);
//         return this.dossiersList;
//       })
//       .catch( (error) => {
//         console.log("[jslibrary.js::getDossiersList][Error]: " + error);
//       });

// }//End getDossiersList()





// }//End MStrREST.

