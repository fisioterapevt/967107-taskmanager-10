import BoardComponent from './components/board';
import HeaderComponent from './components/header';
import FilterComponent from './components/filter';
import EditTaskComponent from './components/edit-task';
import TaskComponent from './components/task';
import TasksComponent from './components/tasks.js';
import NoTasksComponent from './components/no-tasks.js';
import ButtonLoadMoreComponent from './components/button-load-more';
import SortComponent from './components/sort.js';
import {generateTasks} from './mock/task';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './utils/utils';

const TASKS_COUNT = 23;
const COUNT_TASKS_AT_FIRST = 8;
const COUNT_TASKS_LOAD_MORE = 8;

const renderTask = (taskListElement, task) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);

  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new EditTaskComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, replaceEditToTask);

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new HeaderComponent().getElement(), RenderPosition.BEFOREEND);

const filters = generateFilters();
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);

const tasks = generateTasks(TASKS_COUNT);
const isAllTasksArchived = tasks.every((task) => task.isArchive);

if (isAllTasksArchived) {
  render(boardComponent.getElement(), new NoTasksComponent().getElement(), RenderPosition.BEFOREEND);
} else {
  render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = COUNT_TASKS_AT_FIRST;
  tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(taskListElement, task);
    });

  // show first 7 tasks
  const buttonLoadMoreComponent = new ButtonLoadMoreComponent();

  render(boardComponent.getElement(), buttonLoadMoreComponent.getElement(), RenderPosition.BEFOREEND);

  buttonLoadMoreComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + COUNT_TASKS_LOAD_MORE;

    tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => renderTask(taskListElement, task));

    if (showingTasksCount >= tasks.length) {
      buttonLoadMoreComponent.getElement().remove();
      buttonLoadMoreComponent.removeElement();
    }
  });
}

