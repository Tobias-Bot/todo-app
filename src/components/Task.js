import React from "react";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.task.title,
      description: this.props.description,
    };

    this.deleteTask = this.deleteTask.bind(this);
    this.ChangeTitle = this.ChangeTitle.bind(this);
    this.ChangeDescription = this.ChangeDescription.bind(this);
  }

  ChangeTitle(e) {
    this.setState({ title: e.target.value }, () => {
      let task = {
        title: this.state.title,
        description: this.state.description,
      };

      this.props.onTaskChange(task, this.props.index);
    });
  }

  ChangeDescription(e) {
    this.setState({ description: e.target.value }, () => {
      let task = {
        title: this.state.title,
        description: this.state.description,
      };

      this.props.onTaskChange(task, this.props.index);
    });
  }

  deleteTask() {
    this.props.onTaskDelete(this.props.index);
  }

  render() {
    return (
      <div className="task">
        <div className="taskMainInfo">
          <textarea
            className="taskTitle"
            value={this.props.task.title}
            placeholder="Заголовок"
            onChange={this.ChangeTitle}
          ></textarea>
          <textarea
            className="taskText"
            value={this.props.task.description}
            placeholder="Нет описания"
            onChange={this.ChangeDescription}
          ></textarea>
        </div>
        <div className="btnDeleteTask" onClick={this.deleteTask}>
          <i className="fas fa-times-circle"></i>
        </div>
      </div>
    );
  }
}

export default Task;
