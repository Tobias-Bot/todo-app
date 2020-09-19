import React from "react";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.task.title,
      description: this.props.task.description,
      color: "#000",
    };

    this.colorInput = React.createRef();

    this.deleteTask = this.deleteTask.bind(this);
    this.ChangeTitle = this.ChangeTitle.bind(this);
    this.ChangeColor = this.ChangeColor.bind(this);
    this.colorInputClick = this.colorInputClick.bind(this);
    this.ChangeDescription = this.ChangeDescription.bind(this);
  }

  colorInputClick() {
    this.colorInput.current.click();
  }

  ChangeTitle(e) {
    this.setState({ title: e.target.value }, () => {
      this.props.onTaskChange(this.state, this.props.index);
    });
  }

  ChangeDescription(e) {
    this.setState({ description: e.target.value }, () => {
      this.props.onTaskChange(this.state, this.props.index);
    });
  }

  ChangeColor(e) {
    this.setState({ color: e.target.value }, () => {
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

    return (
      <div className="task" style={taskColor}>
        <div className="taskMainInfo">
          <textarea
            className="taskTitle"
            value={this.props.task.title}
            placeholder="Заголовок"
            onChange={this.ChangeTitle}
          ></textarea>
          <div contentEditable="true"></div>
          {/* <textarea
            className="taskText"
            value={this.props.task.description}
            placeholder="Нет описания"
            onChange={this.ChangeDescription}
          ></textarea> */}
        </div>
        <div className="taskSettings">
          <div className="btnOption" onClick={this.deleteTask}>
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="btnOption" onClick={this.colorInputClick}>
            <i className="fas fa-palette"></i>
          </div>
          <input type="color" ref={this.colorInput} hidden={true} onChange={this.ChangeColor} />
        </div>
      </div>
    );
  }
}

export default Task;
