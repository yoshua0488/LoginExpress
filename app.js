const express = require('express')
const app = express()
const port = 3000

// Get the client
const mysql = require('mysql2/promise');
const cors = require ("cors")
const session = require('express-session')

app.use(cors({
    origin: "http://localhost:5173",
    credentials : true
}))
app.use(session ({
    secret: "Este es un ejemplo"
}))

// Create the connection to database
const connection = mysql.createPool({
    host: 'localhost', // esto porque mi gestor es xampp
    user: 'root',
    database: 'loginxpress',
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/Login', async (req, res) => { //rep = peticion, res = Respuesta
    const datos = req.query;

    // A simple SELECT query
    try {
        const [results, fields] = await connection.query(
            "SELECT * FROM `usuarios` WHERE `Usuario` = ? AND `Clave` = ?",
            [
                datos.Usuario, datos.Clave
            ]
        );

        if (results.length > 0)
            {
                req.session.Usuario = datos.Usuario;
                res.status(200).send ("Inicio sesión correctamente")
            }
            else
            {
                res.status(401).send ("Datos incorrectos")
            }    

        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
    }
})

app.get('/Validar', (req, res) => {
    if (req.session.Usuario)
    {
        res.status (200).send ("Sesión validada")
    }
    else
    {
        res.status (401).send ("No autorizado")
    }
    res.send('Sesión Validada!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})