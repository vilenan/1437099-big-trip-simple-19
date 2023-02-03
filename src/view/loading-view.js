import AbstractView from '../framework/view/abstract-view.js';

function createLoaderTemplate() {
  return (
    `<div class="board__loading">
      <div class="loader"></div>
    </div>`
  );
}

export default class LoadingView extends AbstractView {
  get template() {
    return createLoaderTemplate();
  }
}
