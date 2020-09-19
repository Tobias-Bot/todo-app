import React from "react";

import Task from "./Task.js";

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tasks: [], showImportant: false };

    this.tasks = [];

    // Эта привязка обязательна для работы `this` в колбэке.
    this.createNewTask = this.createNewTask.bind(this);
    this.UpdateTask = this.UpdateTask.bind(this);
    this.showTasks = this.showTasks.bind(this);
    this.renderTasks = this.renderTasks.bind(this);
    this.sortTasksByImportant = this.sortTasksByImportant.bind(this);
  }

  componentDidMount() {
    this.getFromDB({ store: "ToDoList", key: "tasks" });
  }

  componentDidUpdate() {
    let data = this.state.tasks;

    let StoreData = {
      store: "ToDoList",
      key: "tasks",
      data,
    };

    this.updateDB(StoreData);
  }

  updateDB(obj) {
    let openRequest = indexedDB.open(obj.store, 1);

    openRequest.onupgradeneeded = () => {
      let DB = openRequest.result;
      if (!DB.objectStoreNames.contains(obj.store)) {
        DB.createObjectStore(obj.store);
      }
    };

    openRequest.onerror = function () {
      console.error("Can't create DB", openRequest.error);
    };

    openRequest.onsuccess = () => {
      let DB = openRequest.result;

      let tx = DB.transaction(obj.store, "readwrite");
      let store = tx.objectStore(obj.store);

      store.put(obj.data, obj.key);
    };
  }

  getFromDB(obj) {
    let openRequest = indexedDB.open(obj.store, 1);

    openRequest.onupgradeneeded = () => {
      let DB = openRequest.result;
      if (!DB.objectStoreNames.contains(obj.store)) {
        DB.createObjectStore(obj.store);
      }
    };

    openRequest.onerror = function () {
      console.error("Can't create DB", openRequest.error);
    };

    openRequest.onsuccess = () => {
      let DB = openRequest.result;

      let tx = DB.transaction(obj.store, "readonly");
      let store = tx.objectStore(obj.store);

      let tasks = store.get(obj.key);

      tx.oncomplete = () => {
        console.log(tasks.result);
        if (tasks.result) {
          this.setState((prevState) => {
            return { tasks: tasks.result };
          });
        }
      };
    };
  }

  createNewTask() {
    let arr = [
      {
        title: "",
        description: "",
        color: "#fff",
        isImportant: false,
      },
    ];

    this.setState((prevState) => {
      return { tasks: [...prevState.tasks, ...arr] };
    });
  }

  UpdateTask(task, index) {
    console.log(task, index, this.state.tasks);
    let tasks = this.state.tasks;

    tasks[index] = task;

    this.setState({ tasks });
  }

  deleteTask = (index) => {
    let tasks = this.state.tasks;
    tasks.splice(index, 1);

    this.setState((state) => ({
      tasks,
    }));
  };

  sortTasksByImportant() {
    this.tasks = this.state.tasks.map((item, i) => {
      return (
        item.isImportant && (
          <Task
            key={i}
            task={item}
            index={i}
            onTaskChange={this.UpdateTask}
            onTaskDelete={this.deleteTask}
          ></Task>
        )
      );
    });
  }

  showTasks() {
    this.tasks = this.state.tasks.map((item, i) => {
      return (
        <Task
          key={i}
          task={item}
          index={i}
          onTaskChange={this.UpdateTask}
          onTaskDelete={this.deleteTask}
        ></Task>
      );
    });
  }

  renderTasks() {
    let important = this.state.showImportant;

    this.setState({ showImportant: !important });
  }

  render() {
    let important = this.state.showImportant;

    important ? this.showTasks() : this.sortTasksByImportant();

    const star = !important ? (
      <i className="fas fa-star"></i>
    ) : (
      <i className="far fa-star"></i>
    );

    return (
      <div className="list">
        {this.tasks}
        <button className="btnAddTask" onClick={this.renderTasks}>
          {star}
        </button>
        <button className="btnAddTask" onClick={this.createNewTask}>
          <i className="fas fa-plus"></i>
        </button>
        <div className="logoText">
          создано с ❤ в паблике{" "}
          <a className="source" href="https://vk.com/warmay">
            Май
          </a>
        </div>
      </div>
    );
  }
}

export default TodoList;
