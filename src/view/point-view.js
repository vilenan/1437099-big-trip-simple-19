import AbstractView from '../framework/view/abstract-view.js';
import { formattingShortDate, formattingDayDate, getOffersByType } from '../utils/utils.js';

function createOffersTemplate(offers) {
  return offers.map(({title, price}) => `<li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </li>`).join('');
}

function createPointTemplate(point, destinations, offersByType) {
  const {type, destination, offers, basePrice, dateFrom, dateTo} = point;

  const offersByPointType = getOffersByType(type, offersByType).offers;
  const checkedOffersByPointType = offersByPointType.filter((offer) => offers.includes(offer.id));

  const offersTemplate = createOffersTemplate(checkedOffersByPointType);
  return (
    `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dateFrom}">${formattingDayDate(dateFrom)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${(destination === undefined ) ? '' : destinations.find((item) => item.id === destination).name}</h3>
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
  #destinations = null;
  #offersByType = null;

  constructor({point, destinations, offers, onClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offers;
    this.#handleClick = onClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations, this.#offersByType,);
  }

  #clickHandler = () => {
    this.#handleClick();
  };
}
