const express = require("express");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: "secret123",
        resave: false,
        saveUninitialized: false
    })
);

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Rutas
const usersRoutes = require("./routes/users");
const listaRoutes = require("./routes/lista");

app.get("/", (req, res) => {
    res.redirect("/users/login");
});

app.use("/users", usersRoutes);
app.use("/lista", listaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor en puerto", PORT));