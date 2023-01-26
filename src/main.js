import { getRandomMockPoints, destinationsArray } from './mock/point.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ListPresenter from './presenter/list-presenter.js';

const siteHeaderEl = document.querySelector('.page-header');
const filtersEl = siteHeaderEl.querySelector('.trip-controls__filters');
const siteMainEl = document.querySelector('.page-main');
const pointsContainerEl = siteMainEl.querySelector('.trip-events');

const pointsModel = new PointsModel({
  points : getRandomMockPoints(),
  destinations: destinationsArray,
});

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: filtersEl,
  filterModel,
  pointsModel,
});

const listPresenter = new ListPresenter({
  pointsContainer: pointsContainerEl,
  pointsModel,
  filterModel,
});

filterPresenter.init();
listPresenter.init();


