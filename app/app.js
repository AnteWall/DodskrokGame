var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var io = require('socket.io')(app.listen(3000));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var rooms = [];
io.on('connection', function(socket){
  send_room_list(socket);
  socket.on('create_room',function(data){
    console.log('create_room');
    var room = create_rooms(data.lobby_name);
    rooms.push(room);
    var u = create_user(data.name,socket,true);
    if(add_user_to_room(u,room.id)){
      socket.emit('room_created', { success: true, room: room });
      send_room_list_to_all();
    }
    else{
      socket.emit('room_created',{ success: false });
    }
  });

  socket.on('get_rooms',function(){
    send_room_list(socket);
  });

  socket.on('connect_to_room',function(data){
    console.log('connect_to_room',data);
    var room = find_room_by_id(data.room);
    if(room != -1){
      if(add_user_to_room( create_user(data.user, socket,false), room.id )){
        update_room_event(room.id);
        socket.emit('room_connection',{ success: true, room: room });
      }else{
        socket.emit('room_connection',{ success: false });
      }
    }
    else{
      socket.emit('room_connection',{ success: false });
    }
  });

  socket.on('error', function (err) {
    console.error(err.stack); // TODO, cleanup
  })

  socket.on('disconnect', function () {
    console.log('dissconnect');
    var room = remove_user_from_room(socket.id);
    if(room != -1){
      if(room.users.length == 0){
        rooms.splice(rooms.indexOf(room),1);
      }
      send_room_list_to_all();
    }
  });

  socket.on('start_game',function(data){
    console.log('start_game',data);
    room = find_room_by_id(data.room_id);    
    var send_data = { success: true, play: true };
    send_to_room(data.room_id,"start_round",send_data);
  });

  socket.on('end_game',function(data){
    console.log('end_round',data);
    var send_data = { success: true, winners: data.winners };
    send_to_room(data.room_id,"end_round",send_data);
  });

  socket.on('update_player_list',function(data){
    var send_data = { success: true, players: data.players};
    send_to_room(data.room_id,"player_list", send_data);
  })

  socket.on('update_challenge_lists',function(data){
    var send_data = { success: true, lists: data.lists};
    send_to_room(data.room_id,"challenge_lists", send_data);
  })

});

function send_room_list_to_all(){
  io.sockets.emit('rooms', { success: true, rooms: rooms });
}

function send_room_list(socket){
  if(socket != undefined)
    socket.emit('rooms',{ success: true, rooms: rooms });
}

function send_to_room(room_id, event, data){
  var room = find_room_by_id(room_id);
  for(var x = 0; x < room.users.length; x++){
    var user = room.users[x];
    io.to(user.socket).emit(event, data);
  }
}

function update_room_event(room_id){
  var event = "room_update";
  var room = find_room_by_id(room_id);
  var data = { success:true, room: room };
  send_to_room(room_id,event,data);
}

function add_user_to_room(user,room_id){
  var room = find_room_by_id(room_id)
  if(room != -1){
    room.users.push(user);
    return true;
  }
  return false;
}

function remove_user_from_room(socket_id){
  for(var i = 0; i < rooms.length; i++){
    var cur = rooms[i];
    for(var x = 0; x < cur.users.length; x++){
      if(cur.users[x].socket == socket_id){
        cur.users.splice(x,1);
        assign_new_host(cur.id);
      }
      return cur;
    }
  }
  return -1;
}

function find_room_by_id(id){
  for(var i = 0; i < rooms.length; i++){
    var cur = rooms[i];
    if(cur.id == id){
      return cur;
    }
  }
  return -1;
}
/**
  @param host, Boolean
*/
function create_user(name,socket,host){
  return { name: name, socket:socket.id, host:host };
}

function assign_new_host(room_id){
  var room = find_room_by_id(room_id);
  if(room.users.length > 0){
    room.users[0].host = true;
    var data = { success:true, room: room };
    var event_name = 'room_update';
    send_to_room(room_id, event_name, data);
  }
}

function create_rooms(name){
  var room = {};
  room.name = name;
  room.id = makeid();
  room.users = [];
  return room;
}

function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 10; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

module.exports = app;
