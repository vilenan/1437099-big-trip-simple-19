import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {remove, render, replace} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #listComponent = null;
  #editPointComponent = null;
  #pointComponent = null;
  #handleModeChange = null;
  #handleDataChange = null;
  #point = null;
  #destinationsList = null;
  #offers = null;
  #mode = Mode.DEFAULT;

  constructor({listComponent, destinations, offers, onModeChange, onDataChange}) {
    this.#listComponent = listComponent;
    this.#destinationsList = destinations;
    this.#offers = offers;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
  }

  init(point){
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destinations: this.#destinationsList,
      offers: this.#offers,
      onClick: this.#handleClick
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      destinations: this.#destinationsList,
      offers: this.#offers,
      onSubmit: this.#handleSubmit,
      onCloseClick: this.#handleCloseClick,
      onDeleteClick: this.#handleDeleteClick,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#listComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT){
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#editPointComponent );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleClick = () => {
    this.#replaceCardToForm();
  };

  #handleCloseClick = () => {
    this.#editPointComponent.reset(this.#point);
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point);
  };

  #handleSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point);
    this.#replaceFormToCard();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#editPointComponent.reset(this.#point);
    }
  };

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }
}

