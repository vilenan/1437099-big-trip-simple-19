import {render} from './framework/render.js';
import FilterView from './view/filter-view.js';
import ListPresenter from './presenter/list-presenter.js';
import PointsModel from './model/points-model.js';
import {generateFilter} from './utils.js';

const siteHeaderEl = document.querySelector('.page-header');
const filtersEl = siteHeaderEl.querySelector('.trip-controls__filters');
const siteMainEl = document.querySelector('.page-main');
const eventsContainerEl = siteMainEl.querySelector('.trip-events');

const pointsModel = new PointsModel();
const listPresenter = new ListPresenter({listContainer: eventsContainerEl, pointsModel});

const filter = generateFilter(pointsModel.points);


render(new FilterView(filter), filtersEl);
listPresenter.init();


