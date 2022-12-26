import {render} from './framework/render.js';
import FilterView from './view/filter-view.js';
import ListPresenter from './presenter/list-presenter.js';
import PointsModel from './model/points-model.js';
import {generateFilter} from './mock/point.js';

const siteHeader = document.querySelector('.page-header');
const filters = siteHeader.querySelector('.trip-controls__filters');
const siteMain = document.querySelector('.page-main');
const eventsContainer = siteMain.querySelector('.trip-events');

const pointsModel = new PointsModel();
const listPresenter = new ListPresenter({listContainer: eventsContainer, pointsModel});

const filter = generateFilter(pointsModel.points);
console.log(filter); // массив объектов


render(new FilterView(filter), filters);
listPresenter.init();


