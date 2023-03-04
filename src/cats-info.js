export class CatsInfo {
  constructor(
    selectorTemplate,
    handleEditCatInfo,
     ) {
    this._selectorTemplate = selectorTemplate;
    this._handleEditCatInfo = handleEditCatInfo;  
    this._data = {};
  }
    _updateViewLike () {
    if (this._data.favorite) {
        this.buttonLiked.classList.add('cat-info_favorite_liked');
    } else {
      this.buttonLiked.classList.remove('cat-info_favorite_liked')
    }
  }

  _setLikeCat =() => {
    this._data.favorite = !this._data.favorite;
    this._updateViewLike();
  }

  
  setData(cardInstance, _data) {   
    this._cardInstance =cardInstance;
    this._data= this._cardInstance._data;
    
    this.CatImage.src = this._data.image;
    this.CatDesc.textContent = this._data.description;
    this.CatName.textContent = this._data.name;
    this.CatAge.textContent = this._data.age;
    this.CatId.textContent = this._data.id;
    this.CatRate.textContent = this._data.rate;

    this._updateViewLike()
  }

 _getTemplate(){
    const template = document.querySelector(this._selectorTemplate).content.children[0];
    return template
   }

  _toggleContentEditable = () => {
        
    this.buttonEdited.classList.toggle('visual-hidden');
    this.buttonSaved.classList.toggle('visual-hidden');
    this.buttonLiked.removeAttribute('disabled');
    this.CatName.contentEditable="true";
    this.CatRate.contentEditable="true";
    this.CatAge.contentEditable="true";
    this.CatName.contentEditable="true";
    this.CatDesc.contentEditable="true";  
   }

  _savedDataCats = () => {
    this.buttonEdited.classList.toggle('visual-hidden');
    this.buttonSaved.classList.toggle('visual-hidden');

    this.buttonLiked.setAttribute('disabled', "true");
    this.CatName.contentEditable="false";
    this.CatRate.contentEditable="false";
    this.CatAge.contentEditable="false";
    this.CatName.contentEditable="false";
    this.CatDesc.contentEditable="false";

    this._data.description = this.CatDesc.textContent;
    this._data.name = this.CatName.textContent;
    this._data.age = Number(this.CatAge.textContent);
    this._data.rate = Number(this.CatRate.textContent);

    this._cardInstance.setData(this._data);
    this._cardInstance.updateView();
    
    this._handleEditCatInfo(this._data)

     }

  getElement() {
    this.element = this._getTemplate().cloneNode(true);

    this.buttonEdited = this.element.querySelector(".cat-info_edited");
    this.buttonSaved = this.element.querySelector(".cat-info_saved");
    this.buttonLiked = this.element.querySelector(".cat-info_favorite");
    this.buttonDeleted = this.element.querySelector(".cat-info_deleted");

    this.CatImage = this.element.querySelector('.cat-info__image');
    this.CatId = this.element.querySelector('.cat-info__id');
    this.CatName = this.element.querySelector('.cat-info__name');
    this.CatRate = this.element.querySelector('.cat-info__rate');
    this.CatAge = this.element.querySelector('.cat-info__age-val');
    this.CatDesc = this.element.querySelector('.cat-info__desc');

    this.setEventListenerEdit();
    this.setEventListenerSaved();
    this.setEventListenerLike();

    
    return this.element;
   }

   
   setEventListenerEdit() {
    this.buttonEdited.addEventListener('click', this._toggleContentEditable);
   }

   setEventListenerSaved() {
    this.buttonSaved.addEventListener('click', this._savedDataCats);
     }
   setEventListenerLike() {
    this.buttonLiked.addEventListener('click', this._setLikeCat);
   }

     }

