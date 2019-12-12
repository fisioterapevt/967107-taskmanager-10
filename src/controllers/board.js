import EditTaskComponent from '../components/edit-task';
import TaskComponent from '../components/task';
import TasksComponent from '../components/tasks.js';
import NoTasksComponent from '../components/no-tasks.js';
import ButtonLoadMoreComponent from '../components/button-load-more';
import SortComponent, {SortType} from '../components/sort.js';
import {render, remove, replace, RenderPosition} from '../utils/elements';

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
    replace(taskComponent, taskEditComponent);
  };

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const taskComponent = new TaskComponent(task);

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new EditTaskComponent(task);
  taskEditComponent.setSubmitHandler(replaceEditToTask);

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._buttonLoadMoreComponent = new ButtonLoadMoreComponent();
  }

  render(tasks) {
    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      render(container, this._buttonLoadMoreComponent, RenderPosition.BEFOREEND);

      this._buttonLoadMoreComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + COUNT_TASKS_LOAD_MORE;

        renderTasks(taskListElement, tasks.slice(prevTasksCount, showingTasksCount));

        if (showingTasksCount >= tasks.length) {
          remove(this._buttonLoadMoreComponent);
        }
      });
    };
    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    let showingTasksCount = COUNT_TASKS_AT_FIRST;

    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));
    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedTasks = [];

      switch (sortType) {
        case SortType.DATE_UP:
          sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
          break;
        case SortType.DATE_DOWN:
          sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
          break;
        case SortType.DEFAULT:
          sortedTasks = tasks.slice(0, showingTasksCount);
          break;
      }

      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks);

      if (sortType === SortType.DEFAULT) {
        renderLoadMoreButton();
      } else {
        remove(this._buttonLoadMoreComponent);
      }
    });
  }
}
