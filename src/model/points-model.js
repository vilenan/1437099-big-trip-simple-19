import {getRandomMockPoints} from '../mock/point.js';

export default class PointsModel {
  points = getRandomMockPoints();
  getPoints(){
    return this.points;
  }
}


