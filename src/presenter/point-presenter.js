import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {render, replace} from '../framework/render.js';

export default class PointPresenter {
  #listComponent = null;
  #editPointComponent = null;
  #pointComponent = null;
  #point = null;

  constructor({listComponent}) {
    this.#listComponent = listComponent;
  }

  init(point){
    this.#point = point;

    this.#pointComponent = new PointView({
      point: this.#point,
      onClick: this.#handleClick
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      onSubmit: this.#handleSubmit
    });

    render(this.#pointComponent, this.#listComponent);
  }

  #replaceCardToForm() {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#editPointComponent );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleClick = () => {
    this.#replaceCardToForm();
  };

  #handleSubmit = () => {
    this.#replaceFormToCard();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

}

