import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_TYPE, getOffersByType} from '../mock/point.js';
import {CITIES} from '../mock/const.js';
import {formattingFullDate} from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createOffersTemplate(point, offersArr) {
  const {type, offers} = point;

  const offersByPointType = getOffersByType(type, offersArr).offers;

  if (offersByPointType.length !== 0) {
    return offersByPointType.map((offer) => {
      const isOfferChecked = (offers.includes(offer.id)) ? 'checked' : '';
      const offerTitleFusion = offer.title.split(' ').join('');

      return (
        `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden"
               id="event-offer-${offerTitleFusion}-${offer.id}"
               type="checkbox"
               name="event-offer-${offerTitleFusion}"
               data-offer-id="${offer.id}"
               ${isOfferChecked}>
            <label class="event__offer-label" for="event-offer-${offerTitleFusion}-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
            </label>
       </div>`);
    }).join('');
  }
  return '';
}

function createTypesTemplate(point) {
  return POINT_TYPE.map((type) => {
    const checked = (type === point.type) ? 'checked' : '';
    return `<div class="event__type-item">
      <input id="event-type-${type}-${point.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checked}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${point.id}">${type}</label>
    </div>`;
  }).join('');
}

function createDestinationListTemplate() {
  return CITIES.map((city) => `<option value="${city}"></option>`).join('');
}

function createPicturesTemplate(pictures) {
  return pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)
    .join('');
}

function createDestinationTemplate(destination) {
  const {description, name, pictures} = destination;
  return destination !== null ?
    (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">${name}</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPicturesTemplate(pictures)};
          </div>
        </div>
      </section>`
    ) : '' ;
}

function createNewEditPointTemplate(point, offersArr) {
  const {destination, basePrice, dateFrom, dateTo, type} = point;
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${point.id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${point.id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                 ${createTypesTemplate(point)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${point.id}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${point.id}">
            <datalist id="destination-list-${point.id}">
              ${createDestinationListTemplate()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${point.id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${formattingFullDate(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${formattingFullDate(dateTo)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${point.id}">
              <span class="visually-hidden">Price</span>
             &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${point.id}" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers ${getOffersByType(type).offers.length === 0 ? 'visually-hidden' : ''}">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createOffersTemplate(point, offersArr)}
            </div>
          </section>

          ${createDestinationTemplate(destination)}
        </section>
      </form>
     </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {
  #point = null;
  #destinations = null;
  #offersByType = null;
  #handlerSubmit = null;
  #handlerCloseClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #handleDeleteClick = null;

  constructor({point, destinations, offers, onSubmit, onCloseClick, onDeleteClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offers;
    this.#handlerSubmit = onSubmit;
    this.#handlerCloseClick = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;
    this._setState(EditPointView.parsePointToState(point));
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click',this.#clickCloseHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#clickChangeTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#clickChangeDestinationHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#clickChangePriceHandler);
    this.element.querySelector('.event__available-offers').addEventListener('input', this.#clickOfferHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.#setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #handleStartDataChange = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #handleEndDataChange = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepicker() {
    this.#datepickerFrom = flatpickr(this.element.querySelector('input[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        onChange: this.#handleStartDataChange,
        defaultDate: this._state.dateFrom,
      });
    this.#datepickerTo = flatpickr(this.element.querySelector('input[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#handleEndDataChange,
      });
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handlerSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #clickCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handlerCloseClick();
  };

  #clickChangeTypeHandler = (evt) => {
    evt.preventDefault();
    const tripType = evt.target.value;
    this.updateElement({
      type: tripType,
      offers: []
    });
  };

  #clickChangePriceHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #clickChangeDestinationHandler = (evt) => {
    evt.preventDefault();
    const tripDestination = this.#destinations.find((item) => item.name === evt.target.value);
    this.updateElement({
      destination: tripDestination,
    });
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #clickOfferHandler = (evt) => {
    evt.preventDefault();
    const item = evt.target;
    const checkedOfferId = Number(item.dataset.offerId);
    if(item.hasAttribute('checked')){
      item.removeAttribute('checked');
      this._state.offers = this._state.offers.filter((id) => id !== checkedOfferId);
    } else {
      item.setAttribute('checked', 'checked');
      this._state.offers.push(checkedOfferId);
    }
    this._setState({
      offers: this._state.offers,
    });
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }

  reset(point) {
    this.updateElement(EditPointView.parsePointToState(point));
  }

  get template() {
    return createNewEditPointTemplate(this._state, this.#offersByType);
  }
}

