var taskIdCounter = 0;
var pageContent = document.querySelector("#page-content");

var form = document.querySelector("#task-form");

var toDoList = document.querySelector("#tasks-to-do");
var inProgressList = document.querySelector("#tasks-in-progress");
var completedList = document.querySelector("#tasks-completed");

var tasks = []

var statuses = {
    "to-do": "To Do",
    "in-progress": "In Progress",
    "completed": "Completed"
}

var formHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    console.dir(taskNameInput);

    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    console.log(taskTypeInput);

    if (!taskNameInput || !taskTypeInput) {
        alert("Please fill out the task form.");
        return false;
    }

    form.reset();

    var isEdit = form.hasAttribute("data-task-id");
    

    if (isEdit) {
        console.log("isEditing!!")
        var taskId = form.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
        var taskDataObject = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to-do"
        }
        taskDataObject.id = taskIdCounter;
        tasks.push(taskDataObject);

        saveTasks();
        createTaskHTML(taskDataObject);
    }    
};

var createTaskHTML = function(taskDataObject) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    listItemEl.setAttribute("data-task-id", taskIdCounter);

    var taskInfoEl = document.createElement("div")
    taskInfoEl.className = "task-info"
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObject.name + "</h3><span class='task-type'>" + taskDataObject.type + "</span>";
    
    listItemEl.append(taskInfoEl); 
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);


    if (taskDataObject.status === "to-do") {
        toDoList.appendChild(listItemEl);
    }
    else if (taskDataObject.status === "in-progress") {
        inProgressList.appendChild(listItemEl);
    }
    else if (taskDataObject.status === "completed") {
        completedList.appendChild(listItemEl);
    }

    var taskTypeInput = document.querySelector("select[data-task-id='" + taskIdCounter + "']");
    console.log(statuses[taskDataObject.status])
    taskTypeInput.value = statuses[taskDataObject.status];

    taskIdCounter++;
}

var editTask = function(taskId) {
    console.log("editing task #" + taskId);

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    document.querySelector("#save-task").textContent = "Save Task";
    form.setAttribute("data-task-id", taskId);
    
    var taskName = taskSelected.querySelector("h3.task-name").textContent;    
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
}

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    console.log("looking for taskID: " + taskId)
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            console.log("I found the task in Tasks!!")
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    saveTasks();

    form.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";    
}
    
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    var updatedTaskArray = [];

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArray.push(tasks[i]);
        }
    }
    tasks = updatedTaskArray
    saveTasks();
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

    return actionContainerEl;
}

var taskActionHandler = function (event) {
    console.log(event.target);

    var targetEl = event.target;

    if (event.target.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    var statusValue = event.target.value.toLowerCase();
        statusValue = statusValue.split(" ").join("-");
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to-do") {
        toDoList.appendChild(taskSelected);
    }
    else if (statusValue === "in-progress") {
        inProgressList.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        completedList.appendChild(taskSelected);
    }

    for (var i =0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
}

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Gets task items from localStorage.

// Converts tasks from the string format back into an array of objects.

// Iterates through a tasks array and creates task elements on the page from it.

var loadTasks = function() {
    var tasksFromStorageAsString = localStorage.getItem("tasks");
    var tasksObject = JSON.parse(tasksFromStorageAsString);
    console.log(tasksObject);

    if (tasksObject !== null) {
        tasks = tasksObject
        for (var i = 0; i < tasks.length; i++) {
            var taskDataObject = tasks[i];
            taskDataObject.id = taskIdCounter;
            createTaskHTML(taskDataObject);
        }
    };
}

pageContent.addEventListener("click", taskActionHandler);
pageContent.addEventListener("change", taskStatusChangeHandler);
form.addEventListener("submit", formHandler);

loadTasks();