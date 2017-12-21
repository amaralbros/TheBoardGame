// create logic to handle multiple rooms
// for now, only room 1

class FrontEnd {
  constructor(){
    this.client = new Client
    this.client.loggedRoom(1)
  }

  startButton(){
    // when both players logged in
    this.client.newGame()
  }

  nextButton(){
    this.client.nextTurn()    
  }
}

frontEnd = new FrontEnd

