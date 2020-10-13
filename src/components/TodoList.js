import React from "react";

import Task from "./Task.js";

import logo from "../pics/logo.png";

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

    this.setState({ tasks });
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
          заметки: <b>{this.items.length}</b>
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
      <div>
        <div
          className="modal fade"
          id="InfoModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="InfoBackground">
                  Сделано с ❤ в паблике Май
                  <br />
                  <br />
                  <img className="logo" src={logo} alt="May logo" />
                  <br />
                  <br />
                  <br />
                  <br />
                  Проблемы с приложением, хочешь предложить что-то поменять или
                  просто с нами поболтать? Напиши нам!
                  <br />
                  <br />
                  <button className="btnGoToMay">
                    <a
                      className="linkInBtn"
                      href="https://vk.com/im?sel=-160404048"
                    >
                      написать
                    </a>
                  </button>
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={appTheme[0]}>
          <div className={appTheme[1]}>
            {info}
            <div className="ThemeSwitcher" onClick={this.turnSwitcher}>
              {switcher}
            </div>
          </div>
          <div className="TaskList">{this.items}</div>
          <div className={appTheme[4]}>
            <div
              className="btnMains"
              data-toggle="modal"
              data-target="#InfoModal"
            >
              <i className="fas fa-info"></i>
            </div>
            <div className="btnMains" onClick={this.renderTasks}>
              {star}
            </div>
            <div className="btnMains" onClick={this.createNewTask}>
              <i className="fas fa-plus"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TodoList;
