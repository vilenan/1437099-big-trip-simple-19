import FilterView from '../view/filter-view.js';
import {render, replace, remove} from '../framework/render';
import {FilterType, UpdateType} from '../const.js';
import {filters} from '../utils/filter.js';

export default class FilterPresenter {
  #filterModel = null;
  #pointsModel = null;
  #filterContainer = null;

  #filterComponent = null;

  constructor({filterModel, pointsModel, filterContainer}) {
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#filterContainer = filterContainer;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;
    return [
      {
        type: 'everything',
        points: filters[FilterType.EVERYTHING](points),
        count: filters[FilterType.EVERYTHING](points).length,
      },
      {
        type: 'future',
        points:filters[FilterType.FUTURE](points),
        count: filters[FilterType.FUTURE](points).length,
      }
    ];
  }

  init() {
    const filter = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filter,
      onFilterChange: this.#filterChangeHandler,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);

  }

  #handleModelEvent = () => {
    this.init();
  };

  #filterChangeHandler = (filterType) => {
    if(filterType === this.#filterModel.filterType){
      return;
    }

    this.#filterModel.setFilterType(UpdateType.MAJOR, filterType);
  };
}
