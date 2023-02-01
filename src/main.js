import {render} from './framework/render';
import { getRandomMockPoints, destinationsArray } from './mock/point.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ListPresenter from './presenter/list-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import {offersByType} from './mock/point.js';
import PointApiService from './point-api-server.js';

const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';
const AUTHORIZATION = 'Basic hS2sfS44wcl11984';

const siteHeaderEl = document.querySelector('.page-header');
const filtersEl = siteHeaderEl.querySelector('.trip-controls__filters');
const siteMainEl = document.querySelector('.page-main');
const pointsContainerEl = siteMainEl.querySelector('.trip-events');
const headerContentEl = siteHeaderEl.querySelector('.trip-main');

const pointsModel = new PointsModel({
  points : getRandomMockPoints(),
  destinations: destinationsArray,
  offersByType: offersByType,
});

const filterModel = new FilterModel();

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick,
});
render(newPointButtonComponent, headerContentEl);

const filterPresenter = new FilterPresenter({
  filterContainer: filtersEl,
  filterModel,
  pointsModel,
});

const listPresenter = new ListPresenter({
  pointsContainer: pointsContainerEl,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}
function handleNewPointButtonClick() {
  listPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

filterPresenter.init();
listPresenter.init();


