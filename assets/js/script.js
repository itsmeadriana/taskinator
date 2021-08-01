var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
// var taskInput = document.querySelector("#task-name");

var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    console.dir(taskNameInput);

    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    console.log(taskTypeInput);

    if (!taskNameInput || !taskTypeInput) {
        alert("Please fill out the task form.");
        return false;
    }

    formEl.reset();

    var taskDataObject = {
        name: taskNameInput,
        type: taskTypeInput
    };

    createTaskEl(taskDataObject);
}

var createTaskEl = function(taskDataObject) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    listItemEl.setAttribute("data-task-id", taskIdCounter);

    var taskInfoEl = document.createElement("div")
    taskInfoEl.className = "task-info"
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObject.name + "</h3><span class='task-type'>" + taskDataObject.type + "</span>";

    listItemEl.append(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    tasksToDoEl.appendChild(listItemEl);

    taskIdCounter++;
}

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className= "task-actions";

    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl= document.createElement("Select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    // actionContainerEl.appendChild(deleteButtonEl);

    return actionContainerEl;
}

formEl.addEventListener("submit", taskFormHandler);