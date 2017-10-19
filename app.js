// должен заводиться следующим образом:
// MODULE.init(someHtmlContainer);
//
// шаблонизатор:
// function templater(html) {
//             return function(data) {
//                 for (var x in data) {
//                     var re = “{{\\s?” + x + “\\s?}}“;
//                     html = html.replace(new RegExp(re, “ig”), data[x]);
//                 }
//                 return html;
//             };
//         };


var todoList = function() {

  var todo = todo || []; // ARRAY OF ITEMS(TASKS)
  var done = done || []; // done tasks

  // Task "class" definition
  function Task(id, desc, deadline) {
    this.id = id;
    this.desc = desc;
    this.deadline = deadline;
    this.htmlContent = "<li>" + this.desc + "</li>"; // TO DO
    var self = this
    this.toObject = function() {
      return {
        id: self.id,
        desc: self.desc,
        deadline: self.deadline,
        content: self.htmlContent
      };
    };
  }


  var globTaskId = 0;

  var addButton = document.getElementById('btnAddTask');
  var removeButton = document.getElementById('btnRmvTask');
  var doneButton = document.getElementById('btnDoneTask');

  var calendar = document.getElementById('calendar');
  var taskInputValue = document.getElementById('taskInput');

  addButton.addEventListener('click', addTask);
  removeButton.addEventListener('click', removeTask);
  doneButton.addEventListener('click', doneTask);



  function addTask() {
    let deadline = calendar.value;
    let desc = taskInputValue.value;
    todo.push(new Task(++globTaskId, desc, deadline));
    redraw();

  }

  function redraw() {
    let listAll = document.getElementById('list-all');
    let listTomorrow = document.getElementById('list-tomorrow');
    let listWeek = document.getElementById('list-week');
    let listDone = document.getElementById('list-done');

    let curr = new Date();
    let tmrwDate = new Date(curr.getFullYear(), curr.getMonth(),
        curr.getDate() + 1);
    let weekDate = new Date(curr.getFullYear(), curr.getMonth(),
        curr.getDate() + 7);

    listAll.innerHTML = "";
    listTomorrow.innerHTML = "";
    listWeek.innerHTML = "";
    listDone.innerHTML = "";
    for (let task of todo) {
      let taskHtml = "<li data-taskId=" + task.id + "><div class=\"checkbox\">" +
          "<label class=\"label-all\">" +
            "<input type=\"checkbox\" class=\"cboxes\" value=\"\"/>" +
            task.desc + "</label></div></li>";
      // all
      listAll.innerHTML += taskHtml;
      // tomorrow
      if (task.deadline == getFormatDate(tmrwDate)) {
        listTomorrow.innerHTML += taskHtml;
      }
      // week
      if (new Date(task.deadline) < weekDate) {
        listWeek.innerHTML += taskHtml;
      }
    }
    // done tasks
    for (let d of done) {
      let taskHtml = "<li data-taskId=" + d.id + "><div class=\"checkbox\">" +
          "<label class=\"label-all\">" +
            "<input type=\"checkbox\" class=\"cboxes\" value=\"\"/>" +
            d.desc + "</label></div></li>";
      listDone.innerHTML += taskHtml;


    }

  }


  function removeTask() {
    let toRemove = [];
    let cboxes = document.getElementsByClassName('cboxes');
    for (let i = 0; i < cboxes.length; i++) {
      if (cboxes[i].checked) {
        let li = cboxes[i].parentElement.parentElement.parentElement;
        let task = todo.find(x => x.id === +li.getAttribute('data-taskId'));
        toRemove.push(task);
        cboxes[i].checked = false;
      }
    }
    todo = todo.filter(function(t) {
      return toRemove.indexOf(t) < 0;
    });
    redraw();
  }

  function doneTask() {
    let cboxes = document.getElementsByClassName('cboxes');
    for (let i = 0; i < cboxes.length; i++) {
      if (cboxes[i].checked) {
        let li = cboxes[i].parentElement.parentElement.parentElement;
        let label = cboxes[i].parentElement;
        console.log(label);
        let task = todo.find(x => x.id === +li.getAttribute('data-taskId'));
        done.push(task);
        cboxes[i].checked = false;
        label.className += ' done';
        console.log(label);
      }
    }
    todo = todo.filter(function(t) {
      return done.indexOf(t) < 0;
    });
    redraw();

  }

  function getFormatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    let today = year + "-" + month + "-" + day;
    return today;
  }

  function init() {

  }
  window.todoList = todoList;

  return {
      init : init,
      todo : todo,
      getFormatDate: getFormatDate

  }
}();
