import Observable from '../framework/observable.js';

export default class PointsModel extends Observable{
  #points = null;
  #destinations = null;
  #pointsApiService = null;
  #offers = [];

  constructor({pointsApiService, points, destinations, offersByType}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offersByType;
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.points.then((points) => console.log(points.map(this.#adaptToClient)));
  }

  get points() {
    return this.#points;
  }

  set points(update) {
    this.#points = update;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  updatePoint(updateType, update){
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Can not update unexisting point');
    }

    this.#points = [...this.#points.slice(0, index), update, ...this.#points.slice(index + 1)];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [update, ...this.#points];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    this.#points = [...this.#points.slice(0, index), ...this.#points.slice(index + 1)];

    this._notify(updateType, update);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];

    return adaptedPoint;
  }
}


