import {render} from './framework/render.js';
import FilterView from './view/filter-view.js';
import ListPresenter from './presenter/list-presenter.js';
import PointsModel from './model/points-model.js';
import {generateFilter} from './utils.js';
import { getRandomMockPoints, destinationsArray } from './mock/point.js';

const siteHeaderEl = document.querySelector('.page-header');
const filtersEl = siteHeaderEl.querySelector('.trip-controls__filters');
const siteMainEl = document.querySelector('.page-main');
const pointsContainerEl = siteMainEl.querySelector('.trip-events');

const pointsModel = new PointsModel({
  points : getRandomMockPoints(),
  destinations: destinationsArray,
});

const listPresenter = new ListPresenter({
  pointsContainer: pointsContainerEl,
  pointsModel,
});

const filter = generateFilter(pointsModel.points);

const filterChangeHandler = (filterName) => {
  const filterObj = filter.find((item) => (item.name === filterName));
  listPresenter.handleFilterChange(filterObj.filteredPoints);
};

const filtersList = new FilterView({
  filter,
  onFilterChange: filterChangeHandler,
});

render(filtersList, filtersEl);
listPresenter.init();


