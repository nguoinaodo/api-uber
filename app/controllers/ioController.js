'use strict';

var connection = require('../db/mysql/connection.js');

var room = require('../db/lokijs/room.js');
var ioToken = require('../db/lokijs/io-token.js');

function ioController(io) {
    
	io.on('connection', function(socket) {
		//console.log('rooms: ');
		//console.log(io.sockets.adapter.rooms);
	    //console.log('connected to socket id ' + socket.id);
	    
	    
	    // / sau khi da xac thuc bang socket (khi user ket noi trong collection token se co token, userId, socketId, city)
	    // / customer nam trong room customer<City>, driver nam trong room driver<City>
	    // / khi customer click vao tim xe, emit su kien findDriver, kem theo toa do cua customer
	    // / server bat su kien findDriver, phat ra cho cac driver trong pham vi (trong ban kinh R tinh tu customer)
	    // / su kien customerFindDriver kem them toa do customer 
	    // / khi driver nhan duoc toa do cua customer, neu bam nhan thi emit su kien driverGetCustomer
	    // / server nhan su kien driverGetCustomer cua driver dau tien, ket noi giua 2 thang, roi ngat ket noi voi nhung thang con lai:
	    /// 	+ ket noi driver va customer: dua customer, driver vao room moi,
	    ///		  luu thong tin phong vao db (roomId, cusomerSocketId, driverSocketId)
	    /// 	+ thong bao cho cac driver khac la da ket noi giua 2 nguoi: driver da nhan broadcast cho cac driver con lai 
		/// 	  su kien booked, kem theo cusId (khi driver nhan dc su kien nay thi se khong chon duoc customer nay nua)
		/// sau khi da ket noi giua hai nguoi: trong room: 
		/// 	+ driver gui toa do len cho server: emit su kien driverLocation, kem theo toa do
		/// 	+ server bat su kien driverLocation, gui lai toa do cua driver cho customer: emit su kien driverLocation cho customer 
		/// ket thuc chuyen hang: driver emit su kien endTrip
		/// server nhan su kien endTrip: luu thong tin chuyen di vao trong db, cho customer roi phong
		/// mat ket noi gian doan: on('disconnect'): trong vong 1 tieng: 
		/// 	+ neu user ket noi lai (khi dang nhap): kiem tra status cua driver, neu ban thi tim room chua no roi cho driver join lai vao phong,
		/// 	  neu khong ban thi ko lam gi
		/// 	+ neu user khong ket noi lai: sau 1 tieng ma driver khong join lai vao room, thi xoa thong tin room, customer leave room 
	    
	    /*
	    
	    */
	    // customer hello
	    socket.on('customerHello', function() {
	        console.log('connected to customer with socketId ' + socket.id);
	        // add customer to room
	        socket.join('customer');
	        console.log('customer joined');
	        socket.emit('helloCustomer', 'Hello customer ' + socket.id);
	    });
	    
	    // driver hello
	    socket.on('driverHello', function() {
	    	console.log('connected to driver with socketId ' + socket.id);
	    	// add driver to room
	    	socket.join('driver');
	    	console.log('driver joined');
	    	var customers = [];
	    	
	    	customers = io.sockets.adapter.rooms['customerFinding']? Object.keys(io.sockets.adapter.rooms['customerFinding'].sockets): [];
	    	
	    	socket.emit('helloDriver', {
	    		msg: 'Hello driver ' + socket.id,
	    		customers: customers
	    	});
	    });
	    
	    // customer find driver
	    socket.on('findDriver', function(data) {
	    	console.log('findDriver');
	    	var lat = data.lat,
	    		long = data.long;
	    	var customerSocketId = socket.id;
	    	
	    	socket.join('customerFinding');
	    	console.log(io.sockets.adapter.rooms['driver'].sockets);
	    	io.to('driver').emit('customerFindDriver', {
	    		lat: lat, 
	    		long: long, 
	    		customerSocketId: customerSocketId
	    	});
	    });
	    
	    // driver get customer
	    socket.on('driverGetCustomer', function(data) {
	    	// driver socket
	    	var driverSocketId = socket.id;
			var customerSocketId = data.customerSocketId;
	    	var roomId = driverSocketId + customerSocketId; // hihi
	    	
	    	socket.broadcast.to('driver').emit('booked', {customerSocketId: customerSocketId});
	    	// customer join room
	    	io.sockets.connected[customerSocketId].join(roomId);
	    	// driver join room
	    	socket.join(roomId);
	    	
	    	socket.broadcast.to(roomId).emit('joinRoom', {
	    		driverSocketId: driverSocketId	
	    	});
	    	
	    	room.insert({
	    		roomId: roomId,
	    		customerSocketId: customerSocketId,
	    		driverSocketId: driverSocketId
	    	});
	    	
	    });
	    
	    // driver send location
	    socket.on('driverLocation', function(data) {
	    	var lat = data.lat,
	    		long = data.long;
	    	var driverSocketId = socket.id,
	    		roomId = room.findOne({driverSocketId: driverSocketId}).roomId;
			
	    	// driver to customer in room
	    	socket.broadcast.to(roomId).emit('driverLocation', {
	    		lat: lat, 
	    		long: long
	    	});
	    	
	    });
	    
	    // end trip
	    socket.on('endTrip', function(data) {
	    	var driverSocketId = socket.id;
	    	var roomDoc = room.findOne({driverSocketId: driverSocketId});
	    	var customerSocketId = roomDoc.customerSocketId;
	    	var roomId = roomDoc.roomId;
	    	
	    	// driver leave room
	    	socket.leave(roomId);
	    	// customer leave room
	    	io.sockets.connected[customerSocketId].leave(roomId);
	    	// luu vao book trong db
	    	
	    });
	    
	    // socket client disconnect
	    socket.on('disconnect', function() {
	    	console.log('socket id ' + socket.id + ' disconnected');
	    	console.log('hi');
	    });
	    
	    // chat giua 2 client
	    /*
	    socket.on('chat1', function(data) {
	        socket.broadcast.to('room' + data.roomId).emit('chat2', {msg: data.msg});
	    });
	    */
	});
}

module.exports = ioController;
