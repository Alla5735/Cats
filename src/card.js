export class Card {
   

    constructor(dataCat, selectorTemplate, handleClickCatImage, handleCatTitle, handleDeleteCat) {
        this._data = dataCat;
        this._handleCatTitle = handleCatTitle;
        this._selectorTemplate =selectorTemplate;
        this._handleClickCatImage = handleClickCatImage;
        this._handleDeleteCat = handleDeleteCat;
    }
    _getTemplate(){
        const template = document.querySelector(this._selectorTemplate).content.querySelector('.card');
        return template
    }

    _updateViewLike () {
        if (this._data.favorite) {
            this.cardLikeElement.classList.add('cat-info_favorite_liked');
        } else {
          this.cardLikeElement.classList.remove('cat-info_favorite_liked')
        }
      }
    
      

    getElement() {
        this._element = this._getTemplate().cloneNode(true);
        this.cardTitleElement = this._element.querySelector('.card__name');
        this.cardImageElement = this._element.querySelector('.card__image');
        this.cardLikeElement = this._element.querySelector('.card__like');

        this.btnOpen = this._element.querySelector('.btn-open');
        this.btnDeleted = this._element.querySelector('.btn-delete');
           
        
        this.updateView();

        

        this.cardImageElement.addEventListener('click', () => {
        this._handleClickCatImage(this._data.image);
        })
        
        this.updateView()
        this.setEventListenerOpen();
        this.setEventListenerDelete();
        return this._element;
    }

    getData(){
        return this._data;
    }

    getID(){
        return this._data._id;
    }

    setData(newData) {
        this._data = newData;
    }

    updateView() {
        this.cardTitleElement.textContent = this._data.name;
        this.cardImageElement.src = this._data.image;
        this._updateViewLike();

    }

    deleteView() {
        this._element.remove();
        this._element = null;
    }
    
    setEventListenerOpen(){
        this.btnOpen.addEventListener('click', () => this._handleCatTitle(this))
    }

    setEventListenerDelete(){
        this.btnDeleted.addEventListener('click', () => this._handleDeleteCat(this))
    }

    }
