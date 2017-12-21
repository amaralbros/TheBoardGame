class Client {
  constructor(){
    this.socket = io.connect();
    console.log('this client:', this.socket)
  }

  loggedRoom(num){
    this.socket.emit('ClientLogin', num)
    this.socket.on('ServerUsers', (data)=>{
      this.players = data
    })
  }

  newGame(){
    console.log('new game')
    // logic to handle two players per room
    // placeholder:
    if (this.players){
      if (this.players.length > 1){
        let duoId = [this.players[0][0], this.players[1][0]]
        console.log('Players:',duoId)
        this.socket.emit('newGameDuo', duoId)
      }
    }

  }

  nextTurn(){
    let newPieces = []

    // health, row, col
    let newPiece = [3, 4, 0]

    newPieces.push(newPiece)

    this.socket.emit('nextTurn', newPieces)
  }


}

