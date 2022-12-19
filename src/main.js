import FilterView from './view/filter-view.js';
import ListPresenter from './presenter/list-presenter.js';
import {render} from './render.js';
import PointsModel from './model/points-model.js';

const siteHeader = document.querySelector('.page-header');
const filters = siteHeader.querySelector('.trip-controls__filters');
const siteMain = document.querySelector('.page-main');
const eventsContainer = siteMain.querySelector('.trip-events');

const pointsModel = new PointsModel();
const listPresenter = new ListPresenter({listContainer: eventsContainer, pointsModel});

render(new FilterView(), filters);
listPresenter.init();


