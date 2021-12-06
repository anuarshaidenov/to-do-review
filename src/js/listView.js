/* eslint-disable indent */
import ToDo from './toDo.js';

const toDoListEl = document.getElementById('to-do-list');

class ToDoList {
  // Initial value for the list: get the data from local storage, empty list otherwise.
  #tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  #listEl;

  constructor(listEl) {
    // Initialize the list container.
    this.#listEl = listEl;
  }

  // Store the data in local storage.
  #storeData() {
    localStorage.setItem('tasks', JSON.stringify(this.#tasks));
    return this;
  }

  // Get an item from the list with the index provided.
  #getItemToChange(task) {
    const { index } = task.dataset;
    return this.#tasks.find((item) => item.index === +index);
  }

  static getActionButtons(index) {
    const btnDel = document.getElementById(index);
    const btnOption = document.querySelector(`.btn-${index}`);
    return [btnDel, btnOption];
  }

  // Show the delete button
  static unhideDeleteBtn(item) {
    const [btnDel, btnOption] = ToDoList.getActionButtons(item.dataset.index);
    btnOption.classList.add('hidden');
    btnDel.classList.remove('hidden');
  }

  // Hide the delete button
  static hideDeleteButton(item) {
    const [btnDel, btnOption] = ToDoList.getActionButtons(item.dataset.index);
    btnOption.classList.remove('hidden');
    btnDel.classList.add('hidden');
  }

  // Update the task status according to the checkbox checked value.
  #updateTaskStatus(task) {
    const itemToChange = this.#getItemToChange(task);
    if (task.checked) {
      itemToChange.completed = true;
    } else {
      itemToChange.completed = false;
    }
    this.#storeData().#displayList().#attachEvents();
  }

  // Update task description: handler for the description input change.
  #updateTaskDescription(task) {
    const itemToChange = this.#getItemToChange(task);
    itemToChange.description = task.value;
    this.#storeData().#displayList().#attachEvents();
  }

  // Add a new task. Public method: called when user submits new added task.
  addTask(task) {
    const newTask = new ToDo(task, this.#tasks.length + 1);
    this.#tasks.push(newTask);
    this.#storeData().#displayList().#attachEvents();
  }

  // Arrange the task indexes in acsending order one by one.
  #orderTasks() {
    for (let i = 0; i < this.#tasks.length; i += 1) {
      this.#tasks[i].index = i + 1;
    }
    return this;
  }

  // Remove task from the list, store and display the data.
  deleteTask(itemToDelete) {
    this.#tasks = this.#tasks.filter((item) => item !== itemToDelete);
    this.#orderTasks().#storeData().#displayList().#attachEvents();
  }

  // Remove completed tasks from the list, arrange the indexes, store and display the data.
  clearCompletedTasks() {
    this.#tasks = this.#tasks.filter((item) => !item.completed);
    this.#orderTasks().#storeData().#displayList().#attachEvents();
  }

  // Create a markup for a task.
  static generateMarkup(task) {
    return `
    <li class="main-list__item ${
      task.completed ? 'main-list__item--checked' : ''
    }">
      <label class="main-list__label">
        <input type="checkbox" data-index="${task.index}" ${
      task.completed ? 'checked' : ''
    } class='main-list__checkbox' name="to-do-${task.index}"/>
        <input type="text" class="main-list__description" data-index="${
          task.index
        }" value="${task.description}">
      </label>
      <button class="btn btn-action btn-${task.index}" type="button">
        <ion-icon name="ellipsis-vertical-outline"></ion-icon>
      </button>
      <button class="btn btn-action btn-delete hidden" data-index="${
        task.index
      }" id="${task.index}" type="button">
        <ion-icon name="trash-outline"></ion-icon>
      </button>
    </li>
        `;
  }

  #attachEvents() {
    // Remove task on the delete button click event.
    document.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const itemToDelete = this.#getItemToChange(btn);
        this.deleteTask(itemToDelete);
      });
    });

    // Edit a task description on the input change.
    document.querySelectorAll('.main-list__description').forEach((item) => {
      item.addEventListener('change', () => {
        this.#updateTaskDescription(item);
      });

      // Show the delete button on input focus.
      item.addEventListener('focusin', () => {
        ToDoList.unhideDeleteBtn(item);
      });

      // Hide the delete button on input focusout.
      item.addEventListener('focusout', (e) => {
        // If the delete button is clicked return from the function
        if (e.relatedTarget?.classList.contains('btn-delete')) return;
        ToDoList.hideDeleteButton(item);
      });
    });

    // Update task status on the checkbox check event.
    document.querySelectorAll('.main-list__checkbox').forEach((item) => {
      item.addEventListener('change', () => {
        this.#updateTaskStatus(item);
      });
    });
  }

  // Display the items in the DOM.
  #displayList() {
    // Clear the list before displaying the items
    this.#listEl.innerHTML = '';
    // Sort the list in ascending order
    this.#tasks.sort((a, b) => a.index - b.index);
    // Display the items in the DOM
    this.#tasks.forEach((task) => {
      const markup = ToDoList.generateMarkup(task);
      this.#listEl.insertAdjacentHTML('beforeend', markup);
    });

    return this;
  }

  // Initialize the list.
  init() {
    this.#displayList().#attachEvents();
  }
}

const toDoList = new ToDoList(toDoListEl);

export default toDoList;
