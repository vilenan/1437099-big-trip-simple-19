import AbstractView from '../framework/view/abstract-view.js';

function createLoaderTemplate() {
  return (
    `<p class="board__loading">
      Loading...
    </p>`
  );
}

export default class LoadingView extends AbstractView {
  get template() {
    return createLoaderTemplate();
  }
}
