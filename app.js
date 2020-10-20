const express = require('express');
const socketIO = require('socket.io');
const http = require('http')
const port = process.env.PORT || 3000
var app = express();
var server = require("http").createServer(app);
var io = socketIO(server);
var mysql = require('mysql');
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
});
// make connection with user from server side 
io.on('connection', (socket) => {
    console.log('New user connected');      
    var timeout = "";  
    socket.on('tracking',  (request)=> {
        console.log(request); 
        //io.emit('trip', "Data fetch successfully");
        var driver_id = request.driver_id;
        get_ltlng(driver_id);
        timeout = setInterval(function(){
            get_ltlng(driver_id);
        },2000);
    });
    // listen for message from user 

    function get_ltlng(driver_id)
    {
        db.query(
            "SELECT latitude,longitude FROM driver where id='" + driver_id + "'",
            function (error, result, fields) {
                if (error) throw error;
                //console.log(result);
                if (result.length > 0) {
                    io.emit('trip', JSON.stringify({
                        status_code: 200,
                        message: "Data fetch successfully",
                        success: true,
                        data: result[0],
                    }));
                } else {
                    io.emit('trip', JSON.stringify({
                        status_code: 404,
                        message: "Driver Not Found",
                        success: false,
                    }));
                }
            }
        );
    }
    // when server disconnects from user 
    socket.on('disconnect', () => {
        clearTimeout(timeout);
        console.log('disconnected from user');
    });
});

server.listen(port); 