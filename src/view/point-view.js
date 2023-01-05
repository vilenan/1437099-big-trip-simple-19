import AbstractView from '../framework/view/abstract-view.js';
import { getOffersArray } from '../mock/point.js';
import { formattingShortDate, formattingDayDate } from '../utils.js';

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
                <time class="event__date" datetime="${dateFrom}">${formattingDayDate(dateFrom)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom}">${formattingShortDate(dateFrom)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo}">${formattingShortDate(dateTo)}</time>
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

export default class PointView extends AbstractView {
  #point = null;
  #handleClick = null;

  constructor({point, onClick}) {
    super();
    this.#point = point;
    this.#handleClick = onClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  #clickHandler = () => {
    this.#handleClick();
  };
}
