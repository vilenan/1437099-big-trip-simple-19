import {render, remove, RenderPosition} from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {SortType, FilterType, UpdateType, UserAction} from '../const.js';
import {sortPointsDateUp, sortPointsPriceDown} from '../utils.js';
import {filters} from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter';


export default class ListPresenter {
  #pointsContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #listComponent = new PointsListView();
  #sortComponent = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DATE_UP;
  #filterType = FilterType.EVERYTHING;
  #emptyListComponent = null;
  #newPointPresenter = null;

  constructor({pointsContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      listComponent: this.#listComponent.element,
      destinations: this.destinations,
      offers: this.offers,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });

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

  get offers() {
    return this.#pointsModel.offers;
  }

  init() {
    this.#renderBoard();
  }

  createPoint(){
    this.#currentSortType = SortType.DATE_UP;
    this.#filterModel.setFilterType(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderNoTask() {
    this.#emptyListComponent = new EmptyListView({
      filterType: this.#filterModel.filterType
    });
    render(this.#emptyListComponent, this.#listComponent.element);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType){
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
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
      case UpdateType.INIT:
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
    render(this.#sortComponent, this.#listComponent.element, RenderPosition.BEFOREBEGIN);
  }

  #renderBoard() {
    render(this.#listComponent, this.#pointsContainer);

    const points = this.points;
    if (points.length === 0) {
      this.#renderNoTask();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  }

  #renderPoints() {
    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      listComponent: this.#listComponent.element,
      destinations: this.destinations,
      offers: this.offers,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if(resetSortType) {
      this.#currentSortType = SortType.DATE_UP;
    }
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
