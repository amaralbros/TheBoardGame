let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io').listen(server);
const PORT = process.env.PORT || 3000;
let { Game, Board, Player, Piece } = require('./game.js')


app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));


app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});

app.get('/room1',function(req,res){
  res.sendFile(__dirname+'/room1.html');
});

server.listen(PORT,function(){
  console.log('Listening on '+server.address().port);
});

// array of [userID, roomID]
users = []

// array of game objects
games = []

io.on('connection',function(socket){
  socket.on('ClientLogin', (roomID)=>{
    // user joins server's roomID
    socket.join(roomID);
    userID = socket.id

    users.push([userID, roomID])

    console.log('User ('+userID+') logged in on room #'+roomID)

    // server sends users array to all users
    io.emit('ServerUsers', users)
  })

  socket.on('newGameDuo', (duoId)=>{
    let player1 = new Player(1, duoId[0]); 
    let player2 = new Player(2, duoId[1]); 
    let gameId = randomInt(0, 999)

    let game = new Game(player1, player2, gameId)
    game.next_turn()
    games.push(game)

    emitGameState(game)
})

  socket.on('nextTurn', (newPieces)=>{
    // logic to find which game??
    let game = games[0]

    let player = findPlayer(game, socket)

    // add new pieces to game
    newPieces.forEach((att)=>{
      let newPiece = new Piece(att[0], player, att[1], att[2])
      game.board.stored_pieces.push(newPiece)
    })

    game.board.populate()

    game.next_turn()

    console.log(game.board.matrix)
    emitGameState(game)
  })



})

function emitGameState(game){
  if (game.turn < 20){
    if (game.turn % 2 != 0){
      // player 1
      console.log('p1 turn')
      io.to(game.player1.id).emit('yourTurn', game.board.matrix)
    } else {
      // player 2
      console.log('p2 turn')
      io.to(game.player2.id).emit('yourTurn', game.board.matrix)
    }
  }
}


function findPlayer(game, socket){
  if (game.player1.id === socket.id){
    return game.player1
  } else {
    return game.player2
  }
}

function findRoomFromPlayer(player){

}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}



