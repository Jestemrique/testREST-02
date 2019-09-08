const pageTitle = document.title;

const mstrInitProps = {
  host: 'localhost',
  port: 8080,
  loginMode: 1,
  restApiUrl: 'http://localhost:8080/Library111U2/api',
  persistLocalStorage: true 
};

function appendDossierToProject(dossier, projectLiElement){
  let dossierItem = document.createElement('div');
  let dossierItem__text = document.createElement('p');
  dossierItem__text.innerHTML = dossier.name;
  dossierItem.appendChild(dossierItem__text);
  projectLiElement.appendChild(dossierItem);
  
}

function generateProjectsStructure(projectsList, dossiersList){
  let ulElement = document.createElement('ul');
  let allLiElement = document.createElement('li');
  let allLinkElement = document.createElement('a');
  let allLinkText = document.createTextNode('All');

  allLinkElement.appendChild(allLinkText);
  allLiElement.appendChild(allLinkElement)
  ulElement.appendChild(allLiElement);
  for (const dossier of dossiersList) {
    appendDossierToProject(dossier, allLiElement);
  }


  for (const project of projectsList) {
    console.log(project.id);
    let projectLiElement = document.createElement('li');
    let linkElement = document.createElement('a');
    let linkText = document.createTextNode(project.name);
    
    linkElement.appendChild(linkText);
    linkElement.title = project.name;
    linkElement.setAttribute('projectIdData', project.id);
    projectLiElement.appendChild(linkElement);
    let projectDossiers = dossiersList.filter( dossier => dossier.projectId === project.id);
    for (const dossier of projectDossiers) {
      appendDossierToProject(dossier, projectLiElement);
    }
    ulElement.appendChild(projectLiElement);
  }
  return ulElement;
}

function LibraryPageActions(){
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  let projectsList = mstrInfo.projectsList;
  let dossiersList = mstrInfo.dossiersList;

  let projectsTabs = document.getElementById("projectsPanel");
  //let projectsContent = generateProjectsContent(projectsList);
  let projectsContent = generateProjectsStructure(projectsList, dossiersList);
  projectsTabs.appendChild(projectsContent);
  

}


function homePageActions(){
  let loginForm = document.getElementById('mstrLoginForm');
  loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let formAction = loginForm.action;
      let formData =  new FormData(loginForm);
      let authInfo = {
          username: formData.get('username'),
          password: formData.get('password')
      };
      
  let mstrRestJs = new MSTRestJS(mstrInitProps);
  mstrRestJs.doAuthenticate(authInfo)
        .then( authToken => {
            Promise.all([mstrRestJs.getProjects(authToken), mstrRestJs.getDossiers(authToken)])
              .then( values => {
                            console.log(values);
                            window.location = 'library.html';
                        });
                      })
         .catch( error => {
           console.log("Error"  + error);
         });
  });
}//End homePageActions()


//Actions to perform in each page.
switch (pageTitle) {
  case 'Home':
    homePageActions();
    break;
  case 'Library':
    LibraryPageActions();
    break;
  default:
  
  break;
}

