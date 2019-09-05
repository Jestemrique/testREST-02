
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
      let mstrInfo = new MSTRestJS(mstrInitProps);
      
      mstrInfo.doAuthenticate(authInfo)
        .then( authToken => {
                console.log("Token: " + authToken);
                mstrInfo.getProjects(authToken)
                    .then( projectsList => {
                                            console.log(JSON.stringify(projectsList));
                                            return projectsList;
                                           });
                window.location.replace(formAction);
                })
        .catch( error => {
                  console.log("Error: " + error);
                });
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

