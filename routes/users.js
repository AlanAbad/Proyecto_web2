const express = require("express");
const router = express.Router();
const db = require("../db"); // IMPORTACIÓN CORRECTA

// Mostrar login
router.get("/login", (req, res) => {
    res.render("login");
});

// Procesar login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            [email, password]
        );

        if (rows.length === 0) {
            return res.send("Usuario o contraseña incorrectos");
        }

        req.session.userId = rows[0].id;

        res.redirect("/lista");

    } catch (err) {
        console.error("ERROR LOGIN:", err);
        res.send("Error durante login");
    }
});

// Mostrar registro
router.get("/register", (req, res) => {
    res.render("registro");
});

// Registrar usuario
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, password]
        );

        res.redirect("/users/login");

    } catch (err) {
        console.error("ERROR REGISTER:", err);
        res.send("Error registrando usuario");
    }
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/users/login"));
});

module.exports = router;