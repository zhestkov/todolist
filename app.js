var todoList = (function(paste) {

  var globTaskId;
  var addButton;
  var removeButton;
  var doneButton;
  var calendar;
  var taskInput;
  var globalContainer;

  var select;
  var filters;
  var listWrapperVar;

  paste.todo = {
    list: [],
    filters: [{
        name: "All",
        condition: function(task) {
          return !isDone(task);
        }
      },
      {
        name: 'Tomorrow',
        condition: checkDeadline((new Date().setDate((new Date()).getDate() + 1)))
      },
      {
        name: 'Week',
        condition: checkDeadline((new Date().setDate((new Date()).getDate() + 7)))
      },
      {
        name: 'Done',
        condition: isDone
      }
    ]
  }

  function templater(html) {
    return function(data) {
      for (var x in data) {
        var re = "{{\\s?" + x + "\\s?}}";
        html = html.replace(new RegExp(re, "ig"), data[x]);
      }
      return html;
    };
  };

  function isDone(task) {
    return task.done;
  }

  function checkDeadline(deadline) {
    return function(task) {
      let taskDeadline = new Date(task.deadline);
      return (taskDeadline < deadline && taskDeadline > new Date() &&
        !isDone(task)) ? true : false;
    }
  }

  function Task(id, desc, deadline) {
    var self = this
    this.id = id;
    this.desc = desc;
    this.deadline = deadline;
    this.done = false; // default value
  }

  // function restoreData() {
  //   let data = JSON.parse(localStorage.getItem("todo"));
  //   if (data !== null) {
  //     todo = data.map(a => ({ ...a
  //     }));
  //     globTaskId = (data.length > 0) ? data[data.length - 1].id : 0;
  //     console.log(globTaskId);
  //     console.log(todo);
  //   }
  //
  // }
  //
  // function saveData() {
  //   localStorage.setItem("todo", JSON.stringify(todo));
  //   // localStorage.setItem("done", JSON.stringify(done));
  // }

  var setupList = function() {
    globTaskId = 0;

    addButton = document.getElementById('btnAddTask');
    removeButton = document.getElementById('btnRmvTask');
    doneButton = document.getElementById('btnDoneTask');

    calendar = document.getElementById('calendar');
    taskInputValue = document.getElementById('taskInput');
    select = document.getElementById('filters');

    addButton.addEventListener('click', paste.addTask);
    removeButton.addEventListener('click', paste.removeTask);
    doneButton.addEventListener('click', paste.doneTask);
    select.addEventListener('change', redrawList);
    // restoreData();
  }

  paste.addTask = function() {
    console.log("addTask executed");
    let deadline = calendar.value;
    let desc = taskInputValue.value;
    paste.todo.list.push(new Task(++globTaskId, desc, deadline));
    redrawList();
  }

  paste.init = function(container) {
    console.log(container);
    redrawForm(container);
    setupList();
    globalContainer = container;
  }


  var redrawFilters = function(container) {
    filters = document.createElement('select');
    filters.id = 'filters';
    // container.innerHTML = '';
    for (let f of paste.todo.filters) {
      let item = document.createElement('option');
      item.innerHTML = templater('{{filter}}')({
        filter: f.name
      });
      filters.appendChild(item);
    }
    container.appendChild(filters);
  }



  makeTaskString = function(task) {
    let tmp = templater('<li data-taskId={{id}}>'
      // '<label class="label-all">' +
      +
      '<input type="checkbox" class="cboxes" />' +
      '<p>{{task}}</p>' +
      '</li>');
    return tmp({
      id: task.id,
      task: task.desc
    });
  }
  var ulWrapper = document.createElement('ul');

  var redrawForm = function(container) {
    container.innerHTML = '';
    // input fields
    container.innerHTML += templater('<h1>{{todo_intro}}</h1>' +
      '<form><div class="form-row col-md-6">' +
      '<div class="form-group">' +
      '<label for="taskInput">Task</label>' +
      '<input type="text" class="form-control" id="taskInput" placeholder="Enter your task">' +
      '</div>' +
      '<div class="form-group col-md-6"><label for="calendar">Deadline</label>' +
      '<input type="date" class="form-control date" id="calendar">' +
      '</div></div>')({
      todo_intro: "To Do List"
    });
    // interaction buttons
    container.innerHTML += templater('<div class="form-row col-md-6">' +
      '<div class="form-group col-md-6">' +
      '<button type="button" class="btn btn-primary" id="btnAddTask">{{addBtnTitle}}</button>' +
      '<button type="button" class="btn btn-primary" id="btnRmvTask">{{removeBtnTitle}}</button>' +
      '<button type="button" class="btn btn-primary" id="btnDoneTask">{{doneBtnTitle}}</button>' +
      '</div></div></form>')({
      addBtnTitle: "Add",
      removeBtnTitle: "Remove",
      doneBtnTitle: "Done"
    });
    // contents template
    container.innerHTML += templater('<div id="content">' +
      '<div id="{{filtersWrapper}}"></div>' +
      '<div id="{{listWrapper}}"></div>' +
      '</div>')({
      filtersWrapper: "filtersWrapper",
      listWrapper: "listWrapper"
    });
    redrawFilters(document.getElementById('filtersWrapper'));
  }
  var redrawList = function() {
    ulWrapper.innerHTML = '';
    var listWrapper = document.getElementById('listWrapper');
    let selectedFilter = filters.options[filters.selectedIndex].value;
    for (let t of paste.todo.list) {
      let filterId = paste.todo.filters.map(f => f.name).indexOf(selectedFilter);
      let filter = paste.todo.filters[filterId];
      console.log(filter);
      if (filter.condition(t)) {
        let taskHtml = makeTaskString(t);
        ulWrapper.innerHTML += taskHtml;
      }
    }
    listWrapper.appendChild(ulWrapper);
    console.log("redrawList executed");
  }

  var getCheckedTaskId = function() {
    let length = ulWrapper.children.length;
    for (let i = 0; i < length; i++) {
      let checkbox = ulWrapper.children[i].firstChild;
      if (checkbox.checked) {
        let taskId = +ulWrapper.children[i].dataset['taskid'];
        let taskIdInArray = paste.todo.list.map(t => t.id).indexOf(taskId);
        return taskIdInArray;
      }
    }
  }

  paste.removeTask = function() {
    let taskId = getCheckedTaskId();
    paste.todo.list.splice(taskId, 1);
    redrawList();
  }

  paste.doneTask = function() {
    let taskId = getCheckedTaskId();
    paste.todo.list[taskId].done = true;
    redrawList();
  }

  return paste;
}({}));

todoList.init(document.getElementById('container'));
