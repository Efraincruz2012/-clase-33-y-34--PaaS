const { fork } = require("child_process"); 
const { Router } = require('express');

const routerRandoms = Router();

routerRandoms.get('/', (req, res) => {
  
  const child = fork("./src/router/child.js"); 


  if(req.query.cant){
    child.send(req.query.cant);
  } else {
    child.send(100000000);
  }

  child.on("close", function (code) {
    console.log("child process exited with code " + code);
    res.send('EL PROCESO HIJO SE ROMPIO');
  });

  child.on("message", function (message) {
    res.send(JSON.parse(message));
  });
  
});



exports.routerRandoms = routerRandoms;