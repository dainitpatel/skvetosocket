const express = require('express');
const socketIO = require('socket.io');
const http = require('http')
const port = process.env.PORT || 3000

const fetch = require('node-fetch');

var app = express();
var server = require("http").createServer(app);
var io = socketIO(server);
/*var mysql = require('mysql');
var db = mysql.createConnection({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'skveto',
    //socketPath: '/skt/mysql.sock',
    debug:   false
})

// Log any errors connected to the db
db.connect(function(err){
    if (err) console.log("db err :"+err);
    else console.log('db connected');
});*/
// make connection with user from server side 
io.on('connection', (socket) => {
    console.log('New user connected');      
    var timeout = "";  
    socket.on('tracking',  (request)=> {
        console.log(request); 
        //io.emit('trip', "Data fetch successfully");
        var driver_id = request.driver_id;

        fetch('http://localhost/skveto/live-tracking.php?driver_id='+driver_id)
                .then(res => res.json())
                .then(json => io.emit('trip',json));
        get_ltlng(driver_id);
        timeout = setInterval(function(){
            get_ltlng(driver_id);
        },2000);
    });
    // listen for message from user 

    function get_ltlng(driver_id)
    {
        fetch('http://localhost/skveto/live-tracking.php?driver_id='+driver_id)
                .then(res => res.json())
                .then(json => io.emit('trip',json));
    }
    // when server disconnects from user 
    socket.on('disconnect', () => {
        clearTimeout(timeout);
        console.log('disconnected from user');
    });
});

server.listen(port); 
