import {getRandomMockPoints} from '../mock/point.js';

export default class PointsModel {
  #points = getRandomMockPoints();

  get points(){
    return this.#points;
  }
}


