import AbstractComponent from '../components/abstract-component';

export const createButtonLoadMoreTemplate = () => {
  return (
    `<button class="load-more" type="button">load more</button>`
  );
};

export default class ButtonLoadMore extends AbstractComponent {
  getTemplate() {
    return createButtonLoadMoreTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
