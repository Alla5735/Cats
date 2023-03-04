import { api } from './api.js';
import { Card } from './card.js';
import { CatsInfo } from './cats-info.js';
import { PopupWithImage } from './popup-image.js';
import { Popup } from './popup.js';

const cardsContainer = document.querySelector(".cards");
const btnOpenPopup = document.querySelector("#add");
const btnOpenPopupLogin = document.querySelector("#login");
const formCatAdd = document.querySelector("#popup-form-add");
const formLogin = document.querySelector("#popup-form-login");
const isAuth = Cookies.get("email");
const MAX_LIVE_STORAGE = 10;


const popupAdd = new Popup("popup-add");
const popupImage = new PopupWithImage("popup-cat-image");
const popupLogin = new Popup("popup-login");
const popupCatInfo = new Popup("popup-cat-info");

const CatsInfoInstance = new CatsInfo (
  '#cats-info-template',
  handleEditCatInfo,
   )

const CatsInfoElement = CatsInfoInstance.getElement()

function serializeForm(elements) {
  const formData = {};

  elements.forEach((input) => {
    if (input.type === "submit" || input.type === "button") return;
    if (input.type === "checkbox") {
      formData[input.name] = input.checked;
    }
    if (input.type !== "checkbox") {
      formData[input.name] = input.value;
    }
  });

  return formData;
}

function createCat(dataCat){
  const newElement = new Card(
    dataCat, 
    "#card-template", 
    handleClickCatImage, 
    handleCatTitle,
    handleCatDelete,
    );
  cardsContainer.prepend(newElement.getElement());
}

function handleFormAddCat(e) {
  e.preventDefault();
  const elementsFormCat = [...formCatAdd.elements];
  const formData = serializeForm(elementsFormCat);
  api.addNewCat(formData)
    .then(function() {
      createCat(formData);
      updateLocalStorage(formData, {type: 'ADD_CAT'});
      popupAdd.close();
      formCatAdd.reset();
    })
    .catch(function(err){
      console.log(err);
      alert("Данный id занят");
    })
}

function handleClickCatImage(dataSrc) {
  popupImage.open(dataSrc);
}

function handleFormLogin(e){
  e.preventDefault();
  const elementsFormLogin = [...formLogin.elements];
  const formData = serializeForm(elementsFormLogin);
  Cookies.set("email", formData.email, {expires: 7});
  btnOpenPopup.classList.remove('visual-hidden');
  btnOpenPopupLogin.classList.add('visual-hidden');
  popupLogin.close()
}

btnOpenPopup.addEventListener("click", (e) => {
  e.preventDefault();
  popupAdd.open();
});

btnOpenPopupLogin.addEventListener("click", (e) => {
  e.preventDefault();
  popupLogin.open();
});

function setDataRefresh(minute, key){
  const setTime = new Date(new Date().getTime() + minute*60000)
  localStorage.setItem(key, setTime);
  return setTime;
}

function updateLocalStorage(data, action) { // {type: 'ADD_CAT'} {type: 'ALL_CATS'}
  const oldStorage = JSON.parse(localStorage.getItem('cats'));

  switch (action.type) {
    case 'ADD_CAT':
      oldStorage.push(data);
      localStorage.setItem('cats', JSON.stringify(oldStorage));
      return;
    case 'ALL_CATS':
      setDataRefresh(MAX_LIVE_STORAGE, 'catsRefresh');
      localStorage.setItem('cats',  JSON.stringify(data));
      return;
    case 'DELETE_CAT':
      const newStorage = oldStorage.filter(cat => cat.id !== data.id) 
      localStorage.setItem('cats',  JSON.stringify(newStorage));
      return;
    case 'EDIT_CAT':
      const updateStorage = oldStorage.map(cat => cat.id !== data.id ? cat : data) 
      localStorage.setItem('cats',  JSON.stringify(updateStorage));
      return;
    default:
      break;
  }
}


function checkLocalStorage() {
  const localData = JSON.parse(localStorage.getItem('cats')); //null
  const getTimeExpires = localStorage.getItem('catsRefresh');

  if(localData && localData.length && new Date() < new Date(getTimeExpires)){
    localData.forEach((catData) => {
      createCat(catData);
    });
  } else {
    api.getAllCats()
      .then(dataCats => {
          dataCats.forEach((catData) => {
            createCat(catData);
          });
          updateLocalStorage(dataCats, {type: 'ALL_CATS'});
      })
      .catch(function(err){
        console.log(err);
      })
  }
}

function handleCatTitle(cardInstance) {
  CatsInfoInstance.setData(cardInstance)
  popupCatInfo.setContent(CatsInfoElement)
  popupCatInfo.open()
}

function handleCatDelete (cardInstance) {
   api.deleteCatById(cardInstance._data.id)
   .then(function() {
    cardInstance.deleteView()
    updateLocalStorage(cardInstance._data, {type: 'DELETE_CAT'})
   })
   .catch(function(err){
    console.log(err);
  })
   }

function handleEditCatInfo(data) {
  const {age, description, name, rate, favorite, id} = data;

  api.updateCatById(id, {age, description, name, rate, favorite})
   .then(() =>
      updateLocalStorage(data, {type: 'EDIT_CAT'}),
      popupCatInfo.close()
   )
}

formCatAdd.addEventListener("submit", handleFormAddCat);
formLogin.addEventListener("submit", handleFormLogin);


if(!isAuth) {
  btnOpenPopupLogin.classList.remove('visual-hidden');
} else {
  btnOpenPopupLogin.classList.add('visual-hidden');
}


popupAdd.setEventListener();
popupImage.setEventListener();
popupLogin.setEventListener();
popupCatInfo.setEventListener();

checkLocalStorage()



