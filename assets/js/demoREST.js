const pageTitle = document.title;

const mstrInitProps = {
  host: 'localhost',
  port: 8080,
  loginMode: 1,
  restApiUrl: 'http://localhost:8080/Library111U2/api',
  persistLocalStorage: true 
};







function generateProjectLi(project){
  let projectItem = document.createElement('li');
  let projectLink = document.createElement('a');
  let projectName = document.createTextNode(project.name);
  projectLink.appendChild(projectName);
  projectItem.appendChild(projectLink);

  projectItem.classList.add("tab");
  projectItem.addEventListener('click', event => {
    setActiveProject(projectItem);
    showTab(project.id);
  });

  return projectItem;
}


function setActiveProject(projectItem){
  //remove "is-active from rest of projects"
  let projectElements = document.getElementsByClassName("tab");
  for (const project of projectElements) {
    project.classList.remove("is-active");
  }
  projectItem.classList.add('is-active');
}

function setInactiveProject(projectItem){
  projectItem.classList.remove('is-active');
}




function generateProjectsContent(projectsList){
  let ulElement = document.createElement('ul');

  for (const project of projectsList) {
    let liProject = generateProjectLi(project);
    ulElement.appendChild(liProject);
  }
  
  setActiveProject(ulElement.firstChild);
  
  return ulElement;
}

function showTab(projectId){
  let allTabs = document.getElementsByClassName('tab-content');
  
  //allTabs.classList.add('is-invisible');
  for (const tab of allTabs) {
    tab.classList.add('is-hidden');
  }
  let visibleTab = document.getElementById(projectId);
  visibleTab.classList.remove('is-hidden');
  //visibleTab.classList.add('is-invisible');

}


function generateDivDosier(dossier){
  let divDossier = document.createElement('div');
  
  let dossierName = document.createTextNode(dossier.name);
  divDossier.appendChild(dossierName);
  return divDossier;
};


function generateDossiersTab(dossiersList, projectId){
  let dossiersTab = document.createElement('div');
  dossiersTab.classList.add('tab-content');
  dossiersTab.id = projectId;

  if (projectId === 'allprojects') {
    for (const dossier of dossiersList) {
      let divDossier = generateDivDosier(dossier);
      dossiersTab.appendChild(divDossier);
    }
    return dossiersTab;
  } else {
    let filteredDossiers = dossiersList.filter( dossier => dossier.projectId === projectId);
    for (const dossier of filteredDossiers) {
      let divDossier = generateDivDosier(dossier);
      dossiersTab.appendChild(divDossier);
    }
    console.log(projectId);
  }
  
  return dossiersTab;
}


function LibraryPageActions(){
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  let projectsList = mstrInfo.projectsList;
  //Assign special projectsList item to present all Dossiers.
  let allProject = {
    id: 'allprojects',
    name:"All projects"
  };
  projectsList.unshift(allProject);
  let dossiersList = mstrInfo.dossiersList;
  
  let projectsContent = generateProjectsContent(projectsList);

  let projectsTabs = document.getElementById("projectsPanel");
  projectsTabs.appendChild(projectsContent);
  let dossiersContainer = document.getElementById("dossiersContainer");

  for (const project of projectsList) {
    let projectTab = generateDossiersTab(dossiersList, project.id);
    dossiersContainer.appendChild(projectTab);
  }
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

