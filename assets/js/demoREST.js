const pageTitle = document.title;

const mstrInitProps = {
  host: 'localhost',
  port: 8080,
  loginMode: 1,
  restApiUrl: 'http://localhost:8080/Library111U2/api',
  persistLocalStorage: true 
};


function homePageActions(){
  console.log('page: ' + pageTitle);
  const loginForm = document.getElementById('mstrLoginForm');
  loginForm.addEventListener('submit', event => {
    event.preventDefault();
      let formData = new FormData(loginForm);
      let authInfo = {
        username: formData.get('username'),
        password: formData.get('password')
      };
      mstrInfo = new MSTRestJS(mstrInitProps);
      mstrInfo.doAuthenticate(authInfo)
        .then( token => console.log("Token: " + token))
        .catch( error => {
          console.log("Error"  + error);
        });

        // .then( authToken => {
        //   return mstrInfo.getProjects(authToken)
        //     .then( listProjects => {
        //       return authToken
        //     });
        //   })
        // .then( (authToken) => {
        //   return mstrInfo.getDossiers(authToken, "DEFAULT")
        //     .then( listDossiers => {
        //       //menuDossiers = listDossiers;
        //       window.location.replace(formAction);
        //       return authToken;
        //     });
        // })
        // .catch( error => {
        //   console.log("Error"  + error);
        // });
    // mstrInfo.doAuthenticate(authInfo)
  });
}//End homePageActions()


//Actions to perform in each page.
switch (pageTitle) {
  case 'Home':
    homePageActions();
    break;
  case 'Projects':
    projectsPageActions();
    break;
  case 'Dossiers':
    dossiersPageActions();
    break;
  default:
  
  break;
}

