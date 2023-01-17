import { getRandomMockPoints, destinationsArray } from '../mock/point.js';

export default class PointsModel {
  #points = getRandomMockPoints();
  #destinations = destinationsArray;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }
}


