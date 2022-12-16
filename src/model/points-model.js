import {getRandomMockPoint} from '../mock/point.js';

const POINT_COUNT = 4;

export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, getRandomMockPoint);
  getPoints(){
    return this.points;
  }
}


