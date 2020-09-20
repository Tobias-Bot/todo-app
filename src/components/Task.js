import React from "react";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.task.title,
      description: this.props.task.description,
      color: this.props.task.color,
      isImportant: this.props.task.isImportant,
    };

    this.colorInput = React.createRef();
    this.taskText = React.createRef();
    this.taskTitle = React.createRef();

    this.deleteTask = this.deleteTask.bind(this);
    this.ChangeTitle = this.ChangeTitle.bind(this);
    this.ChangeColor = this.ChangeColor.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.colorInputClick = this.colorInputClick.bind(this);
    this.ChangeDescription = this.ChangeDescription.bind(this);
  }

  // componentDidUpdate() {
  //   this.taskTitle.current.value = this.props.task.title;
  //   this.taskText.current.value = this.props.task.description;
  // }

  colorInputClick() {
    this.colorInput.current.click();
  }

  ChangeTitle(e) {
    let state = {
      title: e.target.value,
      description: this.props.task.description,
      color: this.props.task.color,
      isImportant: this.props.task.isImportant,
    }

    this.setState(state, () => {
      this.props.onTaskChange(this.state, this.props.index);
    });
  }

  ChangeDescription(e) {
    let state = {
      title: this.props.task.title,
      description: e.target.value,
      color: this.props.task.color,
      isImportant: this.props.task.isImportant,
    }

    this.setState(state, () => {
      this.props.onTaskChange(this.state, this.props.index);
    });
  }

  ChangeColor(e) {
    let state = {
      title: this.props.task.title,
      description: this.props.task.description,
      color: e.target.value,
      isImportant: this.props.task.isImportant,
    }

    this.setState(state, () => {
      this.props.onTaskChange(this.state, this.props.index);
    });
  }

  changeStatus() {
    let state = {
      title: this.props.task.title,
      description: this.props.task.description,
      color: this.props.task.color,
      isImportant: !this.props.task.isImportant,
    }

    this.setState(state, () => {
      this.props.onTaskChange(this.state, this.props.index);
    });
  }

  deleteTask() {
    this.props.onTaskDelete(this.props.index);
  }

  render() {
    const taskColor = {
      backgroundColor: this.props.task.color,
    };

    let isImportant = this.props.task.isImportant;

    const star = isImportant ? (
      <i className="fas fa-star"></i>
    ) : (
      <i className="far fa-star"></i>
    );

    return (
      <div className="task" style={taskColor}>
        {this.props.index}
        <div className="taskMainInfo">
          <textarea
            className="taskTitle"
            placeholder="Заголовок"
            rows="2"
            ref={this.taskTitle}
            value={this.props.task.title}
            onChange={this.ChangeTitle}
          ></textarea>
          <textarea
            className="taskText"
            placeholder="Нет описания"
            rows="4"
            ref={this.taskText}
            value={this.props.task.description}
            onChange={this.ChangeDescription}
          ></textarea>
        </div>
        <div className="taskSettings">
          <div className="btnOption" onClick={this.deleteTask}>
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="btnOption" onClick={this.colorInputClick}>
            <i className="fas fa-palette"></i>
          </div>
          <div className="btnOption" onClick={this.changeStatus}>
            {star}
          </div>
          <input
            type="color"
            ref={this.colorInput}
            hidden={true}
            onChange={this.ChangeColor}
          />
        </div>
      </div>
    );
  }
}

export default Task;
