import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = new URL('.', import.meta.url).pathname;
// const __dirname = path.parse(import.meta.url)['dir'].replace('file:///','');


let app = express();
app.use(express.urlencoded({ extended: true }));

let staticRoot = path.join(__dirname, '../frontend');
app.use('/', express.static(staticRoot))

console.log(staticRoot);

let htmxExamplesRoot = path.join(__dirname, '../htmx-examples');
app.use('/htmx-examples/', express.static(htmxExamplesRoot))
console.log(htmxExamplesRoot);


let todoExampleRoot = path.join(__dirname, '../todo-example');
app.use('/todo-example/', express.static(todoExampleRoot))
console.log(todoExampleRoot);


let litExampleRoot = path.join(__dirname, '../lit-examples');
app.use('/lit-examples/', express.static(litExampleRoot))
console.log(litExampleRoot);


let weatherDashboardExample = path.join(__dirname, '../weather-dashboard-example');
app.use('/weather-dashboard-example/', express.static(weatherDashboardExample))
console.log(weatherDashboardExample);

/* ---------------------------------------------------------------------- 
 * Routes for htmx examples
 * ---------------------------------------------------------------------- */

app.get('/clicked', (req, resp) => { 
  resp.send( /*html*/`
    You have sent a <code>GET</code> request to <code>/clicked</code>
    `);
});
app.post('/clicked', (req, resp) => { 
  resp.send( /*html*/`
    You have sent a <code>POST</code> request to <code>/clicked</code>
    `);
});
app.put('/clicked', (req, resp) => { 
  resp.send( /*html*/`
    <div id="status">You have sent a <code>PUT</code> request to <code>/clicked</code></div>
    `);
});
app.delete('/clicked', (req, resp) => { 
  resp.send( /*html*/`
    <div id="status">You have sent a <code>DELETE</code> request to <code>/clicked</code></div>
    `);
});

app.get('/test-replace/innerHTML', (req, resp) => { 
  resp.send( /*html*/`
    As you see, message have changed
    `);
});
app.get('/test-replace/outerHTML', (req, resp) => { 
  resp.send( /*html*/`
    <div>As you see, <code>&lt;button></code> element is now a <code>&lt;div></code>
    `);
});
app.get('/test-replace/delete', (req, resp) => { 
  resp.send( /*html*/`
    This response won't be shown...
    `);
});
app.get('/test-replace/none', (req, resp) => { 
  resp.send( /*html*/`
    This response won't be shown...
    `);
});

app.get('/trigger/5seconds', (req, resp) => { 
  resp.send( /*html*/`
    AJAX request received at ${(new Date()).toISOString().substring(11,19)}
    `);
});
app.get('/trigger/ctrlclick', (req, resp) => { 
  resp.send( /*html*/`
    AJAX request originated on a Ctrl + click event
    `);
});
app.get('/trigger/ctrlclickonce', (req, resp) => { 
  resp.send( /*html*/`
    AJAX request originated on the first Ctrl + click event
    `);
});
app.get('/trigger/:event', (req, resp) => { 
  resp.send( /*html*/`
    AJAX request originated on a ${req.params.event} event
    `);
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/slow-request', async (req, resp) => {
  await delay(5000);
  resp.send( /*html*/`
    This request was slow!
    `);
});



let taskList = [];

/* ---------------------------------------------------------------------- 
 * Routes for to-do example - Step 2
 * ---------------------------------------------------------------------- */

app.post('/todo-list/step02/add', (req, resp) => { 
  let task = req.body.task;
  taskList.push(`<li>${task}</li>`);  
  resp.send(`<ul>${taskList.join('')}</ul>`);
});

/* ---------------------------------------------------------------------- 
 * Routes for to-do example - Step 3
 * ---------------------------------------------------------------------- */
app.post('/todo-list/step03/task', (req, resp) => { 
  let task = req.body.task;
  taskList.push(`<li>${task}</li>`);  
  resp.send(`<li>${task}</li>`);
});

/* ---------------------------------------------------------------------- 
 * Routes for to-do example - Step 4
 * ---------------------------------------------------------------------- */
app.get('/todo-list/step04/tasks', (req, resp) => {
  resp.send(`${taskList.join('')}`);
});

app.post('/todo-list/step04/task', (req, resp) => { 
  let task = req.body.task;
  taskList.push(`<li>${task}</li>`);  
  resp.send(`<li>${task}</li>`);
});


/* ---------------------------------------------------------------------- 
 * Routes for to-do example - Step 5
 * ---------------------------------------------------------------------- */

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


/* ---------------------------------------------------------------------- 
 * Routes for to-do example - Step 6 and final
 * ---------------------------------------------------------------------- */

function taskFragment(task,index) {
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
  taskList[index]= task;  
  resp.send(`${taskList.map((t,i) => taskFragment(t,i)).join("\n")}`);
});

app.get('/task/:index', (req, resp) => {
  resp.send(editTaskForm(req.params.index));
});

app.delete('/task/:index', (req, resp) => {
  let index = req.params.index;
  taskList.splice(index,1);
  resp.send(`${taskList.map((t,i) => taskFragment(t,i)).join("\n")}`);
});

app.get('/form/add', (req, resp) => {
  resp.send(addTaskForm());
});

/* ---------------------------------------------------------------------- 
 * Weather Dashboard example
 * ---------------------------------------------------------------------- */

// Helper function to return a weather-widget component
function weatherWidgetTemplate(location, lat, lon) {
  return `<weather-widget name="${location}" latitude="${lat}" longitude="${lon}"></weather-widget>`;
}

async function getWeather(city, country) {

  // Fetch coordinates from Open-Meteo API with country filter if provided
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&format=json`;

  
  try {
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (geoData.results && geoData.results.length > 0) {

      if (!country) {
        let { latitude, longitude } = geoData.results[0];
        return weatherWidgetTemplate(city, latitude, longitude);
      } else {
        if (geoData.results.filter((item) => 
          (item.country_code.toLowerCase()==country.toLowerCase()) ||
          (item.country.toLowerCase()==country.toLowerCase()) ).length > 0) { 
          let { latitude, longitude, country_code } = geoData.results.filter((item) => 
              (item.country_code.toLowerCase()==country.toLowerCase()) ||
              (item.country.toLowerCase()==country.toLowerCase()))[0];
          return weatherWidgetTemplate(`${city} (${country_code})`, latitude, longitude);
        }
        else {
          throw(new Error('⚠️ Location not found'));
        }
      }
    } else {
      throw(new Error('⚠️ Location not found'));
    }
    
  } catch (error) {
    console.error(error);
    throw(new Error('⚠️ Error fetching location'));
  }
}

app.get('/locations', async (req, res) => {
  let locations = '';
  try {
    locations += await getWeather('Brest', 'FR')+'\n';
    locations += await getWeather('Stockholm', 'SE')+'\n';
    locations += await getWeather('Madrid', 'ES');
    res.send(locations);
  } catch (error) {
    console.error(error);
    res.send(`<p>${error.message}</p>`);
  }

});

// Handle location search & return a weather widget
app.post('/location', async (req, res) => {

  const input = req.body.location.trim();
  
  // Extract city & country from input
  const parts = input.split(',').map(part => part.trim());
  const city = parts[0];
  const country = parts.length > 1 ? parts[1] : ""; // Optional country code

  try {
    res.send(await getWeather(city, country));
  } catch (error) {
    console.error(error);
    res.send(`<p>${error.message}</p>`);
  }

});



/* ---------------------------------------------------------------------- */

let server = app.listen(process.env.PORT || 8080, async function () {
  let addressInfo = server.address();
  let host = addressInfo.address;
  let port = addressInfo.port;
  console.log('Listening at http://%s:%s', host, port);
});