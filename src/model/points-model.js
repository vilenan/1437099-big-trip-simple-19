export default class PointsModel {
  #points = null;
  #destinations = null;

  constructor({points, destinations}) {
    this.#points = points;
    this.#destinations = destinations;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }
}


