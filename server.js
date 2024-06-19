const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");
const dbConfig = require("./app/config/db.config");

const app = express();

app.use(cors(
  {
    credentials: true,
    origin: ["http://localhost:8081"], // Add your client URL here
  }
));
/* for Angular Client (withCredentials) */
// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://localhost:8081"],
//   })
// );

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: [process.env.COOKIE_SECRET || "default_secret"], 
    // keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);
// MongoDB connection
mongoose.set('strictQuery', true);
const db = require("./app/models");
const Role = db.role;



db.mongoose
  // .connect( "mongodb+srv://JACKIE:byU4PWPgz1DLu7pA@cluster0.dzuceah.mongodb.net/ionic_server?retryWrites=true&w=majority")
  .connect( "mongodb+srv://JACKIE:byU4PWPgz1DLu7pA@cluster0.dzuceah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
