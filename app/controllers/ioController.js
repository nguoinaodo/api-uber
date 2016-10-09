'use strict';

function ioController(io) {
    
	var count = 0;
	var roomId = 0;
    
	io.on('connection', function(socket) {
	    console.log('connected to socket id ' + socket.id);
	    
	    socket.emit('hello', {socketId: socket.id, msg: 'socket ' + socket.id});
	    
	    socket.on('client-hello', function(data) {
	        
	        count++;
	        roomId = Math.ceil(count/2);
	        
	        console.log('client-reply: ' + data.msg);
	        
	        socket.join('room' + roomId, function() {
	            console.log('socket id ' + socket.id  + ' have just joined room' + roomId);
	        });
	        
	        socket.emit('join', {roomId: roomId});
	    });
	    
	    socket.on('disconnect', function() {
	    	socket.leave('room' + roomId);
	        console.log('socket id ' + socket.id + ' disconnected');
	        count--;
	    });
	    // chat giua 2 client
	    socket.on('chat1', function(data) {
	        socket.broadcast.to('room' + data.roomId).emit('chat2', {msg: data.msg});
	    });
	    
	});
}

module.exports = ioController;
