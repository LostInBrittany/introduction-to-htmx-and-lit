# ✅ To-do list example

Welcome to the To-do List example! This is a step-by-step guided exercise designed to help you learn how to build a dynamic to-do list application using htmx. Follow each step in order to progressively add features and understand how htmx enables dynamic updates without full page reloads.

This folder contains a **very simple yet functional to-do list application** built using **htmx**. It demonstrates how to dynamically add and remove tasks without reloading the page, and how to use **htmx** to send requests and update the DOM declaratively.

This example accompanies the talk: **_htmx 2.0 & Web Components: A Perfect Match for Frontend Development_**. For more details, visit the [main README](../README.md).

## How to Use This Guide

- Follow the steps sequentially to build your understanding.
- Each step introduces new concepts and features.
- Try modifying the code and experimenting to deepen your learning.
- Ensure you have a server environment to serve the example files and handle requests.


Here is the section for **Step 1: A static view of the to-do list**, following the same style as the previous examples:

---


## 📌 Step 1: A static view of the to-do list

### Learning Objective
Understand the basic static HTML structure of the to-do list.

We start with a **basic static structure** for the to-do list. This step sets up the **HTML layout** without any interactivity yet.

📁 **File:** `./todo-step-01.html`
```html
<div id="app" class="container">
  <div id="todo-list"></div>
  <form id="addTask">
    <input type="text" name="task" required />
    <input type="submit" value="Add task" />
  </form>
</div>
```

![Step 1: A static view of the to-do list](../img/todo-step-01.jpg)
_Above: Step 1: A static view of the to-do list._

### 🔹 How it works

- The `#todo-list` `div` is an **empty placeholder** where tasks will be displayed.
- The form allows users to **input a task** and submit it.
- **At this stage, the form does nothing yet**, submitting the form will trigger a default page reload.

### Try it yourself
- Open the file in a browser and observe the static layout.
- Think about how you might add interactivity in the next steps.

This is just a **static HTML structure**. In the next steps, we will enhance it with interactivity using **htmx**.

---

## 📌 Step 2: Adding the htmx library

Now that we have a **static structure**, we integrate **htmx** to make the form submit dynamically without reloading the page.

📁 **File:** `./todo-step-02.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.2"></script>

<div id="app" class="container">
  <div id="todo-list"></div>
  <form
    id="addTask"
    hx-post="/todo-list/step02/add"
    hx-trigger="submit"
    hx-target="#todo-list"
  >
    <input type="text" name="task" required />
    <input type="submit" value="Add task" />
  </form>
</div>
```

![Step 2: Adding the htmx library](../img/todo-step-02.jpg)
_Above: Step 2: Adding the htmx library._


### 🔹 How it works

- We **include htmx** by adding the `<script>` tag:
  ```html
  <script src="https://unpkg.com/htmx.org@2.0.2"></script>
  ```
- The form is now **enhanced with htmx attributes**:
  - `hx-post="/task"`: **Sends a `POST` request** to `/todo-list/step02/add` when submitted.
  - `hx-trigger="submit"`: **Triggers the request when the form is submitted**.
  - `hx-target="#todo-list"`: **Replaces the content of `#todo-list`** with the server response.

With this setup, when a **user submits a new task**, the request will be sent via AJAX, and the to-do list will **update without a full page reload**.

### 🔧 Let's have a peek at the server-side:

📁 **File:** `./server/index.js`
```js
let taskList = [];

app.post('/todo-list/step02/add', (req, resp) => { 
  let task = req.body.task;
  taskList.push(`<li>${task}</li>`);  
  resp.send(`<ul>${taskList.join('')}</ul>`);
});
```

The server maintains **a simple `taskList` array** to store tasks. When the form **sends a `POST` request** to `/todo-list/step02/add`, the server:

  1. Extracts the **task text** from `req.body.task`.
  2. Adds it to the `taskList` array, wrapping it in `<li>...</li>`.
  3. Sends back an **updated `<ul>` list** containing all tasks.

Since the **htmx request targets `#todo-list`**, the updated list **replaces** its content in the frontend **without a full page reload**.

Now, when a user submits a new task, it appears instantly **without needing to write any JavaScript on the frontend**.

---

## 📌 Step 3: Appending tasks instead of replacing the list

### Learning Objective
Improve the to-do list by appending new tasks instead of replacing the entire list.

In the previous step, submitting a task replaced the entire to-do list with the new server response. Now, we improve the behavior by **appending new tasks to the existing list** instead of replacing it.

📁 **File:** `./todo-step-03.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.2"></script>

<div id="app" class="container">
  <div id="todo-list"></div>
  <form
    id="addTask"
    hx-post="/todo-list/step03/task"
    hx-trigger="submit"
    hx-target="#todo-list"
    hx-swap="beforeend"
  >
    <input type="text" name="task" required />
    <input type="submit" value="Add task" />
  </form>
</div>
```

![Step 3: Appending tasks instead of replacing the list](../img/todo-step-03.jpg)
_Above: Step 3: Appending tasks instead of replacing the list._

### 🔹 How it works

We add `hx-swap="beforeend"`, which **appends** new tasks **to the existing `#todo-list`** instead of replacing it.

### Try it yourself
- Submit multiple tasks and observe how they are appended.
- Modify the `hx-swap` attribute to other values and see the effect.
- Challenge: Change the server to send a different HTML structure for new tasks.

### 🔧 A peek at the updated server-side

To support this change, we slightly modify the server response to send only the new element

📁 **File:** `./server/index.js`
```js
app.post('/todo-list/step03/task', (req, resp) => {
  let task = req.body.task;
  taskList.push(`<li>${task}</li>`);
  resp.send(`<li>${task}</li>`);
});

```
Instead of returning the entire `<ul>` list, the server **now only sends the new `<li>` element**.  Since **`hx-swap="beforeend"`** is used, **htmx appends** the new `<li>` to `#todo-list`, keeping existing tasks.

---

## 📌 Step 4: Preloading existing tasks

So far, we’ve made it possible to add tasks dynamically, but what happens if the user **refreshes the page**? Right now, the list **starts empty** on every load. In this step, we **preload existing tasks** when the page loads.

📁 **File:** `./todo-step-04.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.2"></script>

<div id="app" class="container">
  <ul 
    id="todo-list"
    hx-get="/todo-list/step04/tasks"
    hx-trigger="load"
  ></ul>
  <form
    id="addTask"
    hx-post="/todo-list/step04/task"
    hx-trigger="submit"
    hx-target="#todo-list"
    hx-swap="beforeend"
  >
    <input type="text" name="task" required />
    <input type="submit" value="addTask" />
  </form>
</div>
```

![Step 4: Preloading existing tasks](../img/todo-step-04.jpg)  
_Above: Step 4: Preloading existing tasks._

### 🔹 How it works

We **modify `#todo-list`** to **automatically load tasks** from the server. The `hx-trigger="load"` attribute **triggers a request when the page loads**, and `hx-get="/todo-list/step04/tasks"` sends it as a **`GET` request** to `/todo-list/step04/tasks` to retrieve the current task list. The server **returns the existing tasks**, which are **displayed inside `#todo-list`**.

### 🔧 A peek at the updated server-side

To support this change, we add a new route that **returns the existing tasks** when requested.

📁 **File:** `./server/index.js`
```js
let taskList = [];

app.get('/todo-list/step04/tasks', (req, resp) => {
  resp.send(`${taskList.join('')}`);
});

app.post('/todo-list/step04/task', (req, resp) => { 
  let task = req.body.task;
  taskList.push(`<li>${task}</li>`);  
  resp.send(`<li>${task}</li>`);
});
```
The new `GET /todo-list/step04/tasks` route **sends the current list of tasks** as a set of `<li>` elements. This allows **existing tasks to be displayed** when the page loads. The `POST /todo-list/step04/task` route behaviour remains the same than in precedent step.

---

## 📌 Step 5: Editing tasks

So far, we can add and display tasks, but users cannot edit existing tasks. In this step, we allow tasks to be **edited directly in place**.

In this step frontend remains nearly unchanged, and we introduce dynamic HTML generation  in the backend.

### 🖥️ Frontend: Minimal changes

📁 **File:** `./todo-step-05.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.2"></script>

<div id="app" class="container">
  <h1>To-Do List</h1>
  <ul 
      id="todo-list" 
      hx-get="/todo-list/step05/tasks" 
      hx-trigger="load"></ul>
  <form id="addTask" 
      hx-post="/todo-list/step05/task" 
      hx-trigger="submit" 
      hx-target="#todo-list" 
      hx-swap="beforeend">
    <input type="text" name="task" required />
    <input type="submit" value="Add task" />
  </form>
</div> 
```

![Step 5: Editing tasks](../img/todo-step-05.jpg)  
_Above: Step 5: Editing tasks._

### 🔧 Server-side: Generating dynamic HTML

📁 **File:** `./server/index.js`
```js
function step5TaskFragment(task,index) {
  return /*html*/`
    <li id="task-${index}" class="task">
      <span class="task-name">${task}</span>
      <span 
          class="task-edit"
          hx-get="/todo-list/step05/task/${index}"
          hx-target="#task-${index}">📝</span>
    </li> 
  `;
}

function step5EditTaskForm(index) {
  return /*html*/`
    <form id="editTask" 
        hx-put="/todo-list/step05/task" 
        hx-target="#todo-list"
        hx-trigger="submit">
      <input type="text" name="task" required value="${taskList[index]}"/>
      <input type="hidden" name="index" value="${index}">
      <input type="submit" value="Edit task" />
    </form>
  `;
}

app.get('/todo-list/step05/tasks', (req, resp) => {
  resp.send(`${taskList.map((t,i) => step5TaskFragment(t,i)).join("\n")}`);
});

app.post('/todo-list/step05/task', (req, resp) => { 
  let task = req.body.task;
  taskList.push(task);  
  resp.send(step5TaskFragment(task,taskList.length-1));
});

app.put('/todo-list/step05/task', (req, resp) => { 
  let task = req.body.task;
  let index = req.body.index;
  taskList[index]= task;  
  resp.send(`${taskList.map((t,i) => step5TaskFragment(t,i)).join("\n")}`);
});

app.get('/todo-list/step05/task/:index', (req, resp) => {
  resp.send(step5EditTaskForm(req.params.index));
});

app.get('/todo-list/step05/form/add', (req, resp) => {
  resp.send(addTaskForm());
});
```

### 🔹 How it works

1. Generating task items dynamically
   - `taskFragment(task, index)`: Generates an HTML `<li>` for each task.
   - Each task **includes an edit button (`📝`)** that triggers `hx-get="/todo-list/step05/task/:index"` to **fetch the edit form**.

2. Fetching the edit form dynamically
   - The `/todo-list/step05/task/:index` route returns an **edit form** with the task's current value.
   - The form is displayed **inside the existing `<li>`**, replacing the task name.

3. Updating the task
   - When the **edit form is submitted**, `hx-put="/todo-list/step05/task"` is triggered.
   - The server updates `taskList[index]` and **sends back the updated list**.

---

## 📌 Step 6: Deleting tasks

In this final step, we allow users to **remove tasks dynamically**.  We also **simplify route paths** for better clarity.

On the frontend-sides, we basically keep the same file, simply changing routes to drop the prefix.

📁 **File:** `./todo-step-06.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.2"></script>

<div id="app" class="container">
  <h1>To-Do List</h1>
  <ul 
      id="todo-list" 
      hx-get="/tasks" 
      hx-trigger="load"></ul>
  <form id="addTask" 
      hx-post="/task" 
      hx-trigger="submit" 
      hx-target="#todo-list" 
      hx-swap="beforeend">
    <input type="text" name="task" required />
    <input type="submit" value="Add task" />
  </form>
</div>
```

![Step 6: Deleting tasks](../img/todo-step-06.jpg)  
_Above: Step 6: Deleting tasks._


### 🔧 Server-side: Handling deletions

📁 **File:** `./server/index.js`
```js
function taskFragment(task, index) {
  return /*html*/`
    <li id="task-${index}" class="task">
      <span class="task-name">${task}</span>
      <span 
          class="task-edit"
          hx-get="/task/${index}"
          hx-target="#task-${index}">📝</span>
      <span 
          class="task-delete"
          hx-delete="/task/${index}"
          hx-target="#todo-list">🗑️</span>
    </li> 
  `;
}

function editTaskForm(index) {
  return /*html*/`
    <form id="editTask" 
        hx-put="/task" 
        hx-target="#todo-list"
        hx-trigger="submit">
      <input type="text" name="task" required value="${taskList[index]}"/>
      <input type="hidden" name="index" value="${index}">
      <input type="submit" value="Edit task" />
    </form>
  `;
}

app.get('/tasks', (req, resp) => {
  resp.send(`${taskList.map((t,i) => taskFragment(t,i)).join("\n")}`);
});

app.post('/task', (req, resp) => { 
  let task = req.body.task;
  taskList.push(task);  
  resp.send(taskFragment(task,taskList.length-1));
});

app.put('/task', (req, resp) => { 
  let task = req.body.task;
  let index = req.body.index;
  taskList[index] = task;  
  resp.send(`${taskList.map((t,i) => taskFragment(t,i)).join("\n")}`);
});

app.get('/task/:index', (req, resp) => {
  resp.send(editTaskForm(req.params.index));
});

app.delete('/task/:index', (req, resp) => {
  let index = req.params.index;
  taskList.splice(index, 1);
  resp.send(`${taskList.map((t,i) => taskFragment(t,i)).join("\n")}`);
});
```

### 🔹 How it works

Each task now **includes a delete button** (`🗑️`), with a `hx-delete` attribute that triggers a **DELETE request** to remove it.

The `DELETE /task/:index` route **removes the task** from `taskList` and sends to the client the **updated list**.

The backend now **follows a simpler route structure** (`/task/:index` instead of multiple variations).

---

## 🎉 Conclusion

With this final step, we now have a **simple yet functional to-do list** powered by **htmx**! 🚀

✅ **Tasks can be added, edited, and deleted dynamically**.  
✅ **No frontend JavaScript is needed beyond htmx**.  
✅ **The UI updates seamlessly using server responses**.  
✅ **htmx keeps everything lightweight and declarative**.  

This demo showcases **how powerful htmx can be** for building **interactive UIs** without a complex frontend framework.  

[⬅ Back to main README](../README.md)