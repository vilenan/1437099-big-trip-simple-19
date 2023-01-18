import AbstractView from '../framework/view/abstract-view.js';

function createFiltersTemplate(filters) {
  return filters.map(({name, count}) => {
    const isFilterDisabled = (count === 0) ? 'disabled' : '';
    return ` <div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input visually-hidden" ${isFilterDisabled} type="radio"
             name="trip-filter" value=${name} data-filter-name="${name}">
        <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`;
  }).join('');
}

function createFiltersBlockTemplate(filters) {
  return `<form class="trip-filters" action="#" method="get">
            ${createFiltersTemplate(filters)}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
}

export default class FilterView extends AbstractView {
  #handleFilterChange = null;

  constructor({filter, onFilterChange}) {
    super();
    this.#handleFilterChange = onFilterChange;
    this.filters = filter;
    this.element.addEventListener('input', this.#clickOnFilterHandler);
  }

  #clickOnFilterHandler = (evt) => {
    const {filterName} = evt.target.dataset;
    this.#handleFilterChange(filterName);
  };

  get template() {
    return createFiltersBlockTemplate(this.filters);
  }
}
