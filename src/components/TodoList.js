import React from "react";

import Task from "./Task.js";

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tasks: [], showImportant: false, theme: "white" };

    this.items = [];

    // Эта привязка обязательна для работы `this` в колбэке.
    this.createNewTask = this.createNewTask.bind(this);
    this.UpdateTask = this.UpdateTask.bind(this);
    this.showTasks = this.showTasks.bind(this);
    this.renderTasks = this.renderTasks.bind(this);
    this.turnSwitcher = this.turnSwitcher.bind(this);
    //this.Sasha = this.Sasha.bind(this);
    this.sortTasksByImportant = this.sortTasksByImportant.bind(this);
  }

  componentDidMount() {
    // let funcs = {
    //   'Mark': function(name) {
    //     console.log(`func ${name} is running`);
    //   }
    // }

    // window.addEventListener("message", function(event) {
    //   console.log("received: " + event.data.name);

    //   let func = event.data.name

    //   funcs[func](func);

    //   event.data.name = 'Sasha [updated]';

    //   window.top.postMessage(event.data, '*');
    // });

    /* getting tasks */

    this.getFromDB({ store: "ToDoList", key: "tasks" });

    /* getting app's theme */

    let theme = localStorage.getItem("AppTheme");

    this.setState((state) => {
      return {
        theme,
      };
    });
  }

  turnSwitcher() {
    let theme = this.state.theme;

    theme = theme === "black" ? "white" : "black";

    this.setState((state) => {
      return {
        theme,
      };
    });

    localStorage.setItem("AppTheme", theme);
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
        if (tasks.result) {
          this.setState({ tasks: tasks.result });
          this.tasks = tasks.result;
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
        isImportant: this.state.showImportant,
      },
    ];

    this.setState((prevState) => {
      return { tasks: [...prevState.tasks, ...arr] };
    });
  }

  UpdateTask(task, index) {
    let tasks = this.state.tasks;

    tasks[index] = task;

    this.setState({ tasks }, () => {
      console.log(tasks);
    });
  }

  deleteTask = (index) => {
    let tasks = this.state.tasks;
    tasks.splice(index, 1);

    this.setState({ tasks });
  };

  sortTasksByImportant() {
    this.items = this.state.tasks.map((item, i) => {
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
    this.items = this.state.tasks.map((item, i) => {
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
    let star = "";
    let important = this.state.showImportant;
    let info = "";

    /* sorting posts */

    if (important) {
      this.sortTasksByImportant();
      info = (
        <span>
          важные: <b>{this.items.filter((item) => item).length}</b>
        </span>
      );
      star = <i className="fas fa-star"></i>;
    } else {
      this.showTasks();
      info = (
        <span>
          всего задач: <b>{this.items.length}</b>
        </span>
      );
      star = <i className="far fa-star"></i>;
    }

    /* setting theme switcher position */

    let theme = this.state.theme;

    let switcher =
      this.state.theme === "black" ? (
        <i className="fas fa-toggle-on"></i>
      ) : (
        <i className="fas fa-toggle-off"></i>
      );

    /* setting app's theme */

    let appTheme = ["BackGround", "infoBar", "logoText", "source", "mainBtns"];

    if (theme === "black") appTheme = appTheme.map((el) => `${el} ${el}Black`);

    console.log(appTheme);

    return (
      <div className={appTheme[0]}>
        <div className={appTheme[1]}>
          {info}
          <div className="ThemeSwitcher" onClick={this.turnSwitcher}>
            {switcher}
          </div>
        </div>
        <div className="TaskList">{this.items}</div>
        <div className={appTheme[2]}>
          создано с ❤ в паблике{" "}
          <a className={appTheme[3]} href="https://vk.com/warmay">
            Май
          </a>
        </div>
        <div className={appTheme[4]}>
          <button className="btnMains" onClick={this.renderTasks}>
            {star}
          </button>
          <button className="btnMains" onClick={this.createNewTask}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    );
  }
}

export default TodoList;
