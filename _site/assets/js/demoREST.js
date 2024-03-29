const pageTitle = document.title;
let activeProject = 'allprojects';

const mstrInitProps = {
  host: 'localhost',
  port: 8080,
  loginMode: 1,
  restApiUrl: 'http://localhost:8080/Library111U2/api',
  libraryAppUrl: 'http://localhost:8080/Library111U2/app',
  persistLocalStorage: true 
};


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


function showTab(projectId){
  let allTabs = document.getElementsByClassName('tab-content');
  
  //allTabs.classList.add('is-invisible');
  for (const tab of allTabs) {
    tab.classList.add('is-hidden');
  }
  let visibleTab = document.getElementById(projectId);
  visibleTab.classList.remove('is-hidden');
}




function generateDivDosier(dossier){
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));

  let divDossierContainer = document.createElement("div");
  //let divDossierContainer = document.createElement("li");
  divDossierContainer.classList.add('dossier-card');
  divDossierContainer.classList.add('column');
  divDossierContainer.classList.add('is-one-quarter');
  let dossierDivLink = document.createElement('a');
  divDossierContainer.appendChild(dossierDivLink);
  let linktext = mstrInfo.libraryAppUrl + "/" + dossier.projectId + "/" + dossier.targetId;
  dossierDivLink.href = linktext;
  dossierDivLink.setAttribute("target", "_blank");
  dossierDivLink.setAttribute("title", dossier.name);
  


  let divDossier = document.createElement('div');
  dossierDivLink.appendChild(divDossier);
  divDossier.classList.add("card");

    //Dossier cover image.
    let dossierCoverImage  = document.createElement("div");
    let figureDossierCoverImage = document.createElement("div");
    figureDossierCoverImage.classList.add("card-image");
    figureDossierCoverImage.classList.add("image");
    figureDossierCoverImage.classList.add("is-4by3");
    dossierCoverImage.appendChild(figureDossierCoverImage);
    let dossierImageElement = document.createElement("img");
    dossierImageElement.setAttribute("src", dossier.coverUrl);
    dossierImageElement.setAttribute("alt", dossier.name);
    figureDossierCoverImage.appendChild(dossierImageElement);
    divDossier.appendChild(dossierCoverImage);


  //Link to dossier: dossierLink.
  // let dossierLink = document.createElement('a');
  // let linktext = mstrInfo.libraryAppUrl + "/" + dossier.projectId + "/" + dossier.targetId;
  // let dossierName = document.createTextNode(dossier.name);
  // dossierLink.href = linktext;
  // dossierLink.setAttribute('targe', "_blank'");
  // dossierLink.appendChild(dossierName);
  //divDossier.appendChild(dossierLink);

  //Dossier name:
  let dossierContentDiv = document.createElement("div");
  dossierContentDiv.classList.add("card-content");
  let dossierNameDiv = document.createElement("div");
  dossierNameDiv.classList.add("content");
  dossierContentDiv.appendChild(dossierNameDiv);
  let dossierName = document.createTextNode(dossier.name);
  dossierNameDiv.appendChild(dossierName);
  divDossier.appendChild(dossierContentDiv);


  //Dossier description.
  let dossierDescriptionDiv = document.createElement("div");
  dossierContentDiv.appendChild(dossierDescriptionDiv);
  let dossierDescriptionText = document.createTextNode(dossier.description);
  dossierDescriptionDiv.appendChild(dossierDescriptionText);
  dossierDescriptionDiv.classList.add("content");

  //Dossier footer.
  let dossierFooterDiv = document.createElement("footer");
  dossierFooterDiv.classList.add("card-footer");
  divDossier.appendChild(dossierFooterDiv);
  let dossierSpanOwner = document.createElement("span");
  let dossierOwnerText = document.createTextNode("Owner: " + dossier.owner);
  dossierSpanOwner.appendChild(dossierOwnerText);
  dossierSpanOwner.classList.add("card-footer-item");
  let dossierSpanLastUpdated = document.createElement("span");
  // let dossierLastUpdatedText = document.createTextNode("Last updated: " + dossier.lastUpdated);
  let dossierLastUpdatedText = document.createTextNode("Updated: " + formatDateTime(dossier.lastUpdated));
  dossierSpanLastUpdated.appendChild(dossierLastUpdatedText)
  dossierSpanLastUpdated.classList.add("card-footer-item");
  dossierFooterDiv.appendChild(dossierSpanOwner);
  dossierFooterDiv.appendChild(dossierSpanLastUpdated);

  //return divDossier;
  return divDossierContainer;
};

function formatDateTime(dateTime){
  let tempDateTime = new Date(dateTime);
  // let    formattedDateTime = tempDateTime.toUTCString();
  let    formattedDateTime = tempDateTime.toLocaleString();
  return formattedDateTime;
}



function generateDossiersTab(dossiersList, projectId){
  let dossiersTab = document.createElement('div');
  //let dossiersTab = document.createElement('ul');
  dossiersTab.classList.add('tab-content');
  dossiersTab.classList.add('columns');
  dossiersTab.classList.add('is-multiline');
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


function generateProjectsContent(projectsList){
  
  let ulElement = document.createElement('ul');

  for (const project of projectsList) {
    let liProject = generateProjectLi(project);
    ulElement.appendChild(liProject);
  }
  setActiveProject(ulElement.firstChild);
  return ulElement;
}


function generateGroupsContent(groups){
  let returnedElement = document.createElement('div');

  let groupsTitleHtml = document.createElement("div");
  groupsTitleHtml.innerHTML = '<b>Groups:</b> ';
   

  let groupsContent = document.createElement('div');
  groupsContent.classList.add("tags");
  

  for (const group of groups) {
    let groupItem = document.createElement('span');
    groupItem.classList.add('tag');
    let groupText = document.createTextNode(group.name);
    groupItem.appendChild(groupText);
    groupsContent.appendChild(groupItem);
  };

  returnedElement.appendChild(groupsTitleHtml);
  returnedElement.appendChild(groupsContent);
  
  return returnedElement;
}


function generateUserNameContent(userName){
  let returnedElement = document.createElement("div");
  let userNameContent = document.createElement('div');
  userNameContent.innerHTML = "<b>User: </b>" + userName ;

  returnedElement.appendChild(userNameContent);
  //returnedElement.appendChild(userNameTitleHtml);
  return returnedElement;
};

function generateUserCreated(dateCreated){
  let returnedElement = document.createElement('div');

  let userCreatedContent = document.createElement('div');
  userCreatedContent.innerHTML = '<b>Created:</b> ' + dateCreated;
  returnedElement.appendChild(userCreatedContent);


  return returnedElement;

}


function generateUserContent(userDetails){
  let userContent = document.createElement("div");
  
  // let userFullName = document.createTextNode(userDetails.fullName);
  // userContent.appendChild(userFullName);
  let userFullName = generateUserNameContent(userDetails.fullName);
  userContent.appendChild(userFullName);

  // let userCreated = document.createTextNode(formatDateTime(userDetails.dateCreated));
  // userContent.appendChild(userCreated);
  let userCreated = generateUserCreated(userDetails.dateCreated);
  userContent.appendChild(userCreated);

  let groups = generateGroupsContent(userDetails.groups);
  userContent.appendChild(groups);

  return userContent;
}



function LibraryPageActions(){
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));

  //Generate User info header.
  let userDetails = mstrInfo.userInfo;
  let userContent = generateUserContent(userDetails);
  let userContainer = document.getElementById("userDetails");
  userContainer.appendChild(userContent);


  //Generate projects content.
  let projectsList = mstrInfo.projectsList;
  //Assign special projectsList item to present all Dossiers.
  let allProject = {
    id: 'allprojects',
    name:"All projects"
  };
  projectsList.unshift(allProject);
  let dossiersList = mstrInfo.dossiersList;
  let projectsContent = generateProjectsContent(projectsList);

  //Generate Dossiers containers.
  let projectsTabs = document.getElementById("projectsPanel");
  projectsTabs.appendChild(projectsContent);
  let dossiersContainer = document.getElementById("dossiersContainer");

  for (const project of projectsList) {
    let projectTab = generateDossiersTab(dossiersList, project.id);
    dossiersContainer.appendChild(projectTab);
  }

  activeProject = 'allprojects';
  showTab(activeProject);

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
          mstrRestJs.getSessionUserInfo(authToken);
          return authToken;
        })
        .then( authToken => {
            Promise.all([/*mstrRestJs.getSessionUserInfo(authToken),*/mstrRestJs.getProjects(authToken), mstrRestJs.getDossiers(authToken)])
              .then( values => {
                            let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
                            let userID = mstrInfo.userInfo.userID;
                            mstrRestJs.getUserInfo(authToken, userID)
                              .then( userInfo => {
                                console.log("userInfo: " + userInfo);
                                console.log(values);
                                window.location = 'library.html';
                              })
                            // console.log(values);
                            // debugger;
                            // window.location = 'library.html';
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

