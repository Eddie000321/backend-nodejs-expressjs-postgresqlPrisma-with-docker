// The address of this server connected to the network is:
// URL -> http://localhost:7777
// IP -> 127.0.0.1:7777

const express = require("express");
const app = express();
const PORT = 7777;

let data = ["james"];
// Middleware
app.use(express.json());
//

// HTTP VERBS && ROUTES (or paths)
// ENDPOINT - The method(method) informs the nature of request and the route is a futher
// subdirectory (basically we direct the request to the body of code to respond
// appropriately, and these locations or routes are called endpoints)

// Type1 Website endpoints - sending back HTML and typically come when a user enters a url in a browser
app.get("/", (req, res) => {
  // request, response
  // this is endpoint number 1 - /
  console.log("yay I hit an endpoint(route)", req.method);
  //res.sendStatus(201); // 405, 404, 500 etc.. server respond
  res.send(`
    <body style="background:pink; color: blue;">
    <h1>Data:</h1>
        <p>
            ${JSON.stringify(data)}
        </p>
        <a href="/dashboard">Dashboard</a>
    </body>
    `);
});

app.get("/dashboard", (req, res) => {
  console.log("User requested the home page website");
  res.send(`<body>
    <h1>dashboard</h1>
    <a href="/">home</a>
    </body>
    <script>console.log('This is my script')</script>`);
});

// Type2 API endpoints (non visual)

// CRUD(method) = create(post), read(get), update(put), delete(delete)

app.get("/api/data", (req, res) => {
  console.log("This one was for data");
  res.status(599).send(data);
});

app.post("/api/data", (req, res) => {
  // create a user (for example when click a sing up button)
  // the user clicks the sign up button after entering their credentials, and their browser is wired up to send out a network request to the server to handle that action
  const newEntry = req.body;
  console.log(newEntry);
  data.push(newEntry.name);
  res.sendStatus(201);
});

app.delete("/api/data", (req, res) => {
  data.pop();
  console.log("We deleted the element off the end of the array");
  res.sendStatus(204);
});

app.listen(PORT, () => console.log("Server has started on:" + PORT));
