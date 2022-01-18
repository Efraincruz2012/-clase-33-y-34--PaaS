const express = require('express')
const path = require('path')
require('dotenv').config()

const appDir = path.dirname(require.main.filename);

const yargs = require('yargs/yargs')(process.argv.slice(2))

const { puerto, _ } = yargs
  .boolean('debug')
  .alias({
    p: 'puerto',
  })
  .default({
    puerto: 8080,
  }).argv;

console.log({ puerto })

const { routerProducto } = require("./src/router/producto")
 
const { routerCarrito } = require("./src/router/carrito")

const { routerRandoms } = require("./src/router/randoms")

 
const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'ejs');

const ControladorProducto = require('./Daos/ControladorDaoProducto');
const ControladorCarrito = require('./Daos/ControladorDaoCarrito');

app.get('/', async (req, res) => {
    const productos = await new ControladorProducto().listarAll();
    const carritos = await new ControladorCarrito().listarAll();
    res.render('index', { productos, carritos } );
});

/* Ruta Info */
app.get('/info', async (req, res) => {

    const resultado = {
        'argumentosEntrada:':+ process.cwd(),
        "NombrePlataforma": process.platform, 
        "VersionNode": process.version, 
        "MemoriaTotalReservada": process.memoryUsage().rss, 
        "PathDeEjecucion": process.execPath, 
        "ProcessId": process.pid, 
        "CarpetaProyecto": appDir
    };

    res.send(JSON.stringify(resultado));
    
});



/* ------------------------------------------------------ */
/* Cargo los routers */

app.use('/api/productos', routerProducto)
 
app.use('/api/carrito', routerCarrito)

app.use('/api/randoms', routerRandoms)


/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.PORT ||8090;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))


if (process.env.DB){
    console.log('Variable de entorno cargada: ', process.env.DB)    
}
