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

  componentDidMount() {
    this.taskTitle.current.innerHTML = this.props.task.title;
    this.taskText.current.innerHTML = this.props.task.description;
  }

  componentDidUpdate() {
    this.taskTitle.current.innerHTML = this.props.task.title;
    this.taskText.current.innerHTML = this.props.task.description;
  }

  colorInputClick() {
    this.colorInput.current.click();
  }

  ChangeTitle(e) {
    this.setState({ title: e.target.innerHTML }, () => {
      this.props.onTaskChange(this.state, this.props.index);
    });
  }

  ChangeDescription(e) {
    this.setState({ description: e.target.innerHTML }, () => {
      this.props.onTaskChange(this.state, this.props.index);
    });
  }

  ChangeColor(e) {
    this.setState({ color: e.target.value }, () => {
      this.props.onTaskChange(this.state, this.props.index);
    });
  }

  changeStatus() {
    let status = this.state.isImportant;

    this.setState({ isImportant: status ? false : true }, () => {
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
        <div className="taskMainInfo">
          <div
            className="taskTitle"
            contentEditable="true"
            ref={this.taskTitle}
            placeholder="Заголовок"
            onInput={this.ChangeTitle}
          ></div>
          <div
            className="taskText"
            contentEditable="true"
            ref={this.taskText}
            placeholder="Нет описания"
            onInput={this.ChangeDescription}
          ></div>
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
