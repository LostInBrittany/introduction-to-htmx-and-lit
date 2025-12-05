# 🚀 </> htmx examples

Welcome to the htmx examples suite! This collection of hands-on labs is designed to guide you through learning htmx step-by-step. Each example builds on the previous one, helping you understand how to make AJAX requests, handle events, and dynamically update the DOM with htmx.

## How to Use This Guide

- Follow the examples in order to build your understanding progressively.
- Each example includes a learning objective, code samples, and explanations.
- Try modifying the examples and experimenting with the code to deepen your learning.
- Make sure you have a working server environment to serve the example files and handle requests.
- Refer to the [main README](../README.md) for additional context and setup instructions.

---


## 📌 Sending requests other than `GET`

Below is an example of a button that sends a `POST` request when clicked and replaces the content of the `#status` `div` with the response.

📁 **File:** `./htmx-example-01.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.4"></script>

<div id="buttons">    
  <button hx-post="/clicked" hx-target="#status">
    Click Me
  </button>
</div>

<div id="status">Not yet clicked</div>
```

![Sending requests other than `GET`](../img/htmx-example-01.jpg)
_Above: Sending requests other than `GET`._

### 🔹 How it works

- When the **button is clicked**, an AJAX **`POST` request is sent** to `/clicked`.
- The server **processes the request** and returns a response.
- The **response updates the content** inside `#status`, replacing `"Not yet clicked"` with the server's response.

---

## 📌 Sending RESTful requests: `GET`, `POST`, `PUT` and `DELETE`

This example demonstrates how to use htmx to send various HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) dynamically with buttons.

📁 **File:** `./htmx-example-02.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.4"></script>

<div id="buttons" hx-target="#status">
  <button hx-get="/clicked" inherit:target>Send GET</button>
  <button hx-post="/clicked" inherit:target>Send POST</button>
  <button hx-put="/clicked" inherit:target>Send PUT</button>
  <button hx-delete="/clicked" inherit:target>Send DELETE</button>
</div>

<div id="status">No request sent</div>
```

![Sending RESTful requests: `GET`, `POST`, `PUT` and `DELETE`](../img/htmx-example-02.jpg)
_Above: Sending RESTful requests: `GET`, `POST`, `PUT` and `DELETE`._

### 🔹 How it works

- We define `hx-target="#status"` on the **parent container** (`#buttons`).
- Each button uses `inherit:target`, which tells htmx to **inherit the target attribute from its parent**.
- Clicking a button **triggers an HTTP request** (`GET`, `POST`, `PUT`, or `DELETE`) to `/clicked`.
- The **server processes the request** and returns a response.
- The **response updates the content** of `#status`, displaying the result.

This demonstrates how **attribute inheritance** can reduce code duplication and keep your HTML clean.

---

## 📌 Using the response to replace elements

This example demonstrates how **htmx can modify the DOM dynamically** based on the server's response. Different buttons trigger different types of element replacements or removals.

📁 **File:** `./htmx-example-03.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.4"></script>

<div id="buttons-column">
  <button hx-get="/test-replace/innerHTML">
    If you click, this message will be replaced
  </button>

  <button hx-get="/test-replace/outerHTML" hx-swap="outerHTML">
    If you click, this button will become a div
  </button>

  <button hx-get="/test-replace/none" hx-swap="none">
    If you click, nothing changes, the response is ignored
  </button>
  
  <button hx-get="/test-replace/delete" hx-swap="delete">
    If you click, this button will disappear when the response is received
  </button>  
</div>
```

![Using the response to replace elements](../img/htmx-example-03.jpg)
_Above: Using the response to replace elements._

### 🔹 How it works

- Each button **sends a `GET` request** to `/test-replace/{type}` when clicked.
- The **server's response determines how the element is modified**:
  - `hx-swap="innerHTML"`: The button’s content is replaced with the response.
  - `hx-swap="outerHTML"`: The entire button is replaced by a new element.
  - `hx-swap="delete"`: The button disappears upon receiving the response.
  - `hx-swap="none"`: The response is ignored, and nothing changes.

---

## 📌 Choosing when to send requests

This example demonstrates how **htmx can trigger AJAX requests based on different events**, not just clicks. Each button sends a request when a specific event occurs.

📁 **File:** `./htmx-example-04.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.4"></script>

<div id="button-column">
  <button hx-get="/trigger/natural" hx-target="#status">
    In a button the natural event is a click
  </button>
  <button hx-trigger="mouseover" hx-get="/trigger/mouseover" hx-target="#status">
    This button triggers on mouseover
  </button>
  <button hx-trigger="mouseenter" hx-get="/trigger/mouseenter" hx-target="#status">
    This button triggers on mouseenter
  </button>
  <button hx-trigger="mouseleave" hx-get="/trigger/mouseleave" hx-target="#status">
    This button triggers on mouseleave
  </button>
</div>

<div id="status">No AJAX request sent yet</div>
```

![Choosing when to send requests](../img/htmx-example-04.jpg)
_Above: Choosing when to send requests._

### 🔹 How it works

- Each button **sends a `GET` request** to `/trigger/{event}` when the associated event occurs:
  - No explicit trigger (`hx-get`): the default event (`click`) is used.
  - `hx-trigger="mouseover"`: request is sent when hovering over the button.
  - `hx-trigger="mouseenter"`: request is sent when the mouse enters the button.
  - `hx-trigger="mouseleave"`: request is sent when the mouse leaves the button.

This allows **greater flexibility** in defining when a request should be sent, making **UI interactions more dynamic**.

---

## 📌 More triggering options

This example demonstrates how **htmx can trigger AJAX requests based on advanced conditions**, such as **time intervals**, **keyboard modifiers**, and **one-time interactions**.

📁 **File:** `./htmx-example-05.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.4"></script>

<div id="buttons-column">
  <button hx-trigger="every 5s" hx-get="/trigger/5seconds" hx-target="#status">
    Sends request every 5 seconds, no event needed
  </button>
  <button hx-trigger="click[ctrlKey]" hx-get="/trigger/ctrlclick" hx-target="#status">
    Sends request on click while pressing Ctrl
  </button>
  <button hx-trigger="click[ctrlKey] once" hx-get="/trigger/ctrlclickonce" hx-target="#status">
    Sends request on the first click while pressing Ctrl
  </button>
</div>

<div id="status">No AJAX request sent yet</div>
```

![More triggering options](../img/htmx-example-05.jpg)
_Above: More triggering options._


### 🔹 How it works

- Each button **sends a `GET` request** to `/trigger/{event}` when the specified trigger condition is met:
  - `hx-trigger="every 5s"`: **Automatically sends a request every 5 seconds**, no user interaction needed.
  - `hx-trigger="click[ctrlKey]"`: **Sends a request only when clicking while pressing Ctrl**.
  - `hx-trigger="click[ctrlKey] once"`: **Sends a request only the first time the user clicks while pressing Ctrl**.

This allows for **time-based**, **keyboard-modified**, and **one-time interactions**, making UI behaviors **more flexible and customizable**.

---


## 📌 A spinner to ease your wait

This example demonstrates how **htmx can show a loading indicator** while waiting for a slow server response. The spinner is displayed automatically when the request is in progress and disappears once the response is received.

📁 **File:** `./htmx-example-06.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.4"></script>

<div id="buttons-column">
  <button hx-get="/slow-request" hx-indicator="#panel" hx-target="#status">
    Send a slow request
  </button>
  <div id="panel">
    <div id="status">No response received yet</div>
    <img id="indicator" src="/img/spinner.gif">
  </div>
</div>

<style>
  #indicator {
    display: none;
  }
  .htmx-request #indicator {
    display: block;
  }
  #status {
    display: block;
  }
  .htmx-request #status {
    display: none;
  }
  #indicator {
    width: 10vw;
  }
</style>
```

![A spinner to ease your wait](../img/htmx-example-06.jpg)
_Above: A spinner to ease your wait._


### 🔹 How it works

- Clicking the button **sends a `GET` request** to `/slow-request`.
- The `hx-indicator="#panel"` attribute **displays a loading indicator** while waiting for the response.
- The **CSS rules**:
  - **Hide the spinner** (`#indicator`) by default.
  - **Display the spinner and hide the status text** while the request is active (`.htmx-request` class).
  - Once the response is received, **the spinner disappears**, and the **new status is displayed**.

This provides **better user feedback** when handling slow requests, improving UX.

---


---

## 📌 Boosting standard links

This example demonstrates **`hx-boost`**, a powerful feature that allows you to **convert standard links and forms into AJAX requests** without changing your HTML structure.

📁 **File:** `./htmx-example-07.html`
```html
<script src="https://unpkg.com/htmx.org@2.0.4"></script>

<body hx-boost="true">
  <h1>&lt;/&gt; htmx examples</h1>
  <h2>Boosting standard links</h2>

  <nav>
    <ul>
      <li><a href="./htmx-example-01.html">Example 01</a></li>
      <li><a href="./htmx-example-02.html">Example 02</a></li>
      <li><a href="./htmx-example-03.html">Example 03</a></li>
    </ul>
  </nav>

  <p>
    Because <code>hx-boost="true"</code> is set on the body, these links 
    will be fetched via AJAX and the body content will be swapped in, 
    mimicking a Single Page Application (SPA) feel.
  </p>
</body>
```

### 🔹 How it works

- The attribute `hx-boost="true"` is applied to the `<body>` (or any container).
- htmx **intercepts all anchor tags (`<a>`) and forms** inside that element.
- Instead of a full page reload, it **issues an AJAX request** to the target URL.
- When the response is received, htmx **replaces the `<body>` content** with the new page's body and **updates the browser URL and history**.

This provides a **SPA-like experience** with **progressive enhancement** and **no complex client-side routing**.

---


---

## 📌 Using hx-boost to SPA-like experience

This example demonstrates how **`hx-boost`** can be used to create a **Single Page Application (SPA) experience** between multiple pages.

📁 **Files:** `./htmx-example-08-1.html` and `./htmx-example-08-2.html`

```html
<!-- htmx-example-08-1.html -->
<body hx-boost="true">
    <main id="content">
        <h1>Page One</h1>
        <a href="./htmx-example-08-2.html">Go to Page Two</a>
    </main>
</body>
```

```html
<!-- htmx-example-08-2.html -->
<body hx-boost="true">
    <main id="content">
        <h1>Page Two</h1>
        <a href="./htmx-example-08-1.html">Go to Page One</a>
    </main>
</body>
```

### 🔹 How it works

- Both pages have `hx-boost="true"` on the `<body>`.
- When you click the link to the other page, htmx **fetches the new page via AJAX**.
- It then **swaps the body content** of the current page with the body content of the new page.
- The **URL is updated** in the browser address bar.
- This creates a seamless transition without a full page reload, feeling like a native app or SPA.

---


[⬅ Back to main README](../README.md)