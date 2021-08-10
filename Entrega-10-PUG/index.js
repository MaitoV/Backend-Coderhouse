const express = require('express');
const path = require('path');
const apiRouter = require('./routes/api');


const app = express();
const port = 8080;

const server = app.listen(port, () => {
    console.log('Servidor arriba y corriendo');
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/public')));


app.set('view engine', 'pug');
app.set('views', './views')

server.on('error', (error) => console.log('Surgio un error ->', error) );

app.use('/api', apiRouter);

