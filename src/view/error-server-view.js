import AbstractView from '../framework/view/abstract-view.js';

function getErrorServerTemplate (){
  return '<p class="trip-events__msg">Server connection failed</p>';
}

export default class ErrorServerView extends AbstractView {

  get template() {
    return getErrorServerTemplate();
  }
}
