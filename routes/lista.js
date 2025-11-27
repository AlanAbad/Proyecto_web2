const express = require("express");
const router = express.Router();
const db = require("../db");

// Middleware
function requireLogin(req, res, next) {
    if (!req.session.userId) return res.redirect("/users/login");
    next();
}

// Listar usuarios
router.get("/", requireLogin, async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM users");
        res.render("lista", { users, usuarioEditar: null });
    } catch (err) {
        console.log(err);
        res.send("Error cargando lista");
    }
});

// Cargar edición
router.get("/edit/:id", requireLogin, async (req, res) => {
    const { id } = req.params;

    try {
        const [users] = await db.query("SELECT * FROM users");
        const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

        res.render("lista", {
            users,
            usuarioEditar: user.length ? user[0] : null
        });

    } catch (err) {
        console.log(err);
        res.send("Error cargando edición");
    }
});

// Agregar usuario
router.post("/add", requireLogin, async (req, res) => {
    const { name, email } = req.body;

    try {
        await db.query(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );
        res.redirect("/lista");
    } catch (err) {
        console.log(err);
        res.send("Error agregando usuario");
    }
});

// Actualizar usuario
router.post("/update/:id", requireLogin, async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        await db.query(
            "UPDATE users SET name=?, email=? WHERE id=?",
            [name, email, id]
        );
        res.redirect("/lista");
    } catch (err) {
        console.log(err);
        res.send("Error actualizando usuario");
    }
});

// Eliminar usuario
router.get("/delete/:id", requireLogin, async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM users WHERE id=?", [id]);
        res.redirect("/lista");
    } catch (err) {
        console.log(err);
        res.send("Error eliminando usuario");
    }
});

module.exports = router;