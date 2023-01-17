import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {remove, render, replace} from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #listComponent = null;
  #editPointComponent = null;
  #pointComponent = null;
  #handleModeChange = null;
  #point = null;
  #mode = Mode.DEFAULT;

  constructor({listComponent, onModeChange}) {
    this.#listComponent = listComponent;
    this.#handleModeChange = onModeChange;
  }

  init(point){
    this.#point = point;

    this.#pointComponent = new PointView({
      point: this.#point,
      onClick: this.#handleClick
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      onSubmit: this.#handleSubmit,
      onCloseClick: this.#handleCloseClick
    });

    render(this.#pointComponent, this.#listComponent);
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

  #handleSubmit = () => {
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

