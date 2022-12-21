import { createElement } from '../render.js';
import { getOffersArray } from '../mock/point.js';
import { formattingShortDate } from '../utils.js';

function createOffersTemplate(offers) {
  return offers.map((offer) => `<li class="event__offer">
          <span class="event__offer-title">${getOffersArray[offer].title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${getOffersArray[offer].price}</span>
        </li>`).join('');
}

function createPointTemplate(point) {
  const {type, destination, offers, basePrice, dateFrom, dateTo} = point;
  const offersTemplate = createOffersTemplate(offers);
  return (
    `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">MAR 18</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="2019-03-18T12:25">${formattingShortDate(dateFrom)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="2019-03-18T13:35">${formattingShortDate(dateTo)}</time>
                  </p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${offersTemplate}
                </ul>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`
  );
}

export default class PointView {
  #point = null;
  #element = null;

  constructor({point}) {
    this.#point = point;
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }

}
