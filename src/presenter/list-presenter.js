import {remove, render} from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {SortType} from '../const.js';
import {sortPointsDateUp, sortPointsPriceDown} from '../utils.js';


export default class ListPresenter {
  #listComponent = new PointsListView();
  #sortComponent = null;
  #emptyListComponent = new EmptyListView();
  #pointsContainer = null;
  #pointsModel = null;
  #listPoints = [];
  #pointPresenters = new Map();
  #currentSortType = null;
  #sortedDefault = [];

  constructor({pointsContainer, pointsModel}) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];
    this.#sortedDefault = [...this.#pointsModel.points];

    if (this.#listPoints.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderPointsList();
      this.#currentSortType = SortType.DATE_UP;
      this.#renderSort();
      this.#listPoints.sort(sortPointsDateUp);
      this.#renderPoints();
    }
  }

  #renderPointsList(){
    render(this.#listComponent, this.#pointsContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortChange: this.#handleSortChange,
      currentSort: this.#currentSortType,
    });
    render(this.#sortComponent, this.#listComponent.element);
  }

  #renderEmptyList(){
    render(this.#emptyListComponent, this.#pointsContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({listComponent: this.#listComponent.element, onModeChange: this.#handleModeChange});
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#listPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#clearPointList();
    remove(this.#sortComponent);
    switch(sortType){
      case SortType.PRICE_DOWN:
        this.#listPoints.sort(sortPointsPriceDown);
        break;
      case SortType.DATE_UP:
        this.#listPoints.sort(sortPointsDateUp);
        break;
    }
    this.#currentSortType = sortType;
    this.#renderSort();
    this.#renderPoints();
  };
}
