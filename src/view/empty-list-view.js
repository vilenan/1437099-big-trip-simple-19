import {createElement} from '../render.js';

function getEmptyListTemplate() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class EmptyListView {
  #element = null;

  get template() {
    return getEmptyListTemplate();
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement(){
    this.#element = null;
  }
}
