import AddNewPointView from '../view/add-new-point-view.js';
import {render, remove, RenderPosition} from '../framework/render';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #listComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #destinationsList = null;
  #offers = null;

  #pointEditComponent = null;

  constructor({destinations, offers, listComponent, onDataChange, onDestroy}) {
    this.#listComponent = listComponent;
    this.#destinationsList = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new AddNewPointView({
      destinations: this.#destinationsList,
      offers: this.#offers,
      onSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick,
    });

    render(this.#pointEditComponent, this.#listComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }
    this.#handleDestroy();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(UserAction.ADD_TASK, UpdateType.MINOR, {id: nanoid(), ...point});
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
