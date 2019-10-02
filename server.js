//var http = require('http');
var https = require('https');
var fs = require('fs'); // Using the filesystem module
var options = {
  key: fs.readFileSync('my-key.pem'),
  cert: fs.readFileSync('my-cert.pem')
};
var httpServer = https.createServer(options, requestHandler);
httpServer.listen(8084);
var url = require('url');
console.log('Server listening on port 8084');

function requestHandler(req, res) {
  var parsedUrl = url.parse(req.url);
  // console.log("The Request is: " + parsedUrl.pathname);

  // Read in the file they requested
  fs.readFile(__dirname + parsedUrl.pathname,
    // Callback function, called when reading is complete
    function(err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + parsedUrl.pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200);
      res.end(data);
    }
  );
}

var numPlayers = 0;
var maxPlayerNum = 5;
var players = [];
var audience = [];

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection',
  function(socket){
    console.log("We have a new client: " + socket.id);

    if ( numPlayers < maxPlayerNum ){
      //if it can be a new player, create an object
      var newPlayer = {
        id: socket.id,
        pos: 0,
        img: ""
      }
      //store in server
      players.push(newPlayer);
      console.log("new player");
      console.log(newPlayer);
      // console.log(players);
      numPlayers++;

      socket.emit("player mode on", players);
      socket.broadcast.emit('new player enter',players);

    } else {
      socket.emit("audience mode on",players);
      audience.push(socket);
    }

    console.log("number of players now: "+numPlayers);

    socket.on('play Number', (data)=>{
      io.socket.emit('play Number', players);
      console.log("player number "+ data.length);
    })

    // io.socket.emit('play Number', players);

    socket.on('update image',(data)=>{
      console.log("start update image");
      console.log(socket.id);
      var thisSocketId = socket.id;
      for (let i = 0 ;i < players.length; i++){
        if (players[i].id == thisSocketId){
          console.log(players[i].id);
          console.log("bingo at " + i);
          players[i].img = data;
        }
      }

      io.sockets.emit("update image",players);
    });

    socket.on('update position',(data)=>{
      console.log(socket.id);

      for (let i = 0 ;i < players.length; i++){
        if (socket.id == players[i].id){
          console.log(socket.id);
          players[i].pos = data;
          console.log(i);
        }
      }

      io.sockets.emit("update position",players);

    });

    socket.on('disconnect', function() {
      console.log('disconnect happned');
      // console.log(socket.id);
      // console.log(players);
      let isPlayer = false;

      for (let i =0 ; i < players.length; i++){

        //if the user is a player, remove it from the players list
        if (players[i].id == socket.id){
          isPlayer = true;
          console.log(players[i].id);
          console.log(i);
          players.splice(i,1);
          numPlayers--;
          console.log("a player is disconnected");

          if (audience.length > 0){
            var newPlayer = {
              id: audience[0].id,
              pos: 0,
              img: ""
            }
            players.push(newPlayer);
            io.to(`${newPlayer.id}`).emit('change to player');

            console.log("add a new player " + newPlayer.id);
          } else{
            io.sockets.emit("placeholder",i);
          }

          break;
        }
      }

      if (isPlayer === false){
        console.log("an audience just left");
      }

      // console.log(players);
      console.log(numPlayers);
    });
  }
);

function removeFromArray (ary, ele){
  var index = ary.indexOf(ele);
  if (index > -1){
    ary.splice(index);
  }
}
