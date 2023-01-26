import {render, remove} from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {SortType, FilterType, UpdateType, UserAction} from '../const.js';
import {sortPointsDateUp, sortPointsPriceDown} from '../utils.js';
import {filters} from '../utils/filter.js';


export default class ListPresenter {
  #pointsContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #listComponent = new PointsListView();
  #sortComponent = null;
  #emptyListComponent = new EmptyListView();
  #pointPresenters = new Map();
  #currentSortType = SortType.DATE_UP;
  #filterType = FilterType.EVERYTHING;

  constructor({pointsContainer, pointsModel, filterModel}) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const points = this.#pointsModel.points;
    this.#filterType = this.#filterModel.filterType;
    const filteredPoints = filters[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DATE_UP:
        return filteredPoints.sort(sortPointsDateUp);
      case SortType.PRICE_DOWN:
        return filteredPoints.sort(sortPointsPriceDown);
    }
    return filteredPoints;
  }

  set points(updatePoints) {
    this.#pointsModel.points = updatePoints;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#renderBoard();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType){
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, update);
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType){
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleSortChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortChange: this.#handleSortChange,
      currentSort: this.#currentSortType,
    });
    render(this.#sortComponent, this.#listComponent.element);
  }

  #renderBoard() {
    render(this.#listComponent, this.#pointsContainer);

    const points = this.points;
    if (points.length === 0) {
      render(this.#emptyListComponent, this.#pointsContainer);
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  }

  #renderPoints() {
    const destinations = this.destinations;
    this.points.forEach((point) => {
      this.#renderPoint(point, destinations);
    });
  }

  #renderPoint(point, destinations) {
    const pointPresenter = new PointPresenter({
      listComponent: this.#listComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction,
    });
    pointPresenter.init(point, destinations);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#emptyListComponent);

    if(resetSortType) {
      this.#currentSortType = SortType.DATE_UP;
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
