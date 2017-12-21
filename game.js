/*
--------------HOW TO OPERATE:--------------

--- initialize ---

  player1 = Player(1, player1_id)
  player2 = Player(2, player2_id)

  game = new Game(player1, player2)


--- cycle through ---

  game.next_turn()

  *****<User input: row, col>***** //user places his piece in board matrix

  game.board.stored_pieces = [ new Piece(health, player, row, col), ... ]

  game.board.populate()

  *****<User input: end-turn>***** //user ends his turn

*/



class Game {
  constructor(p1, p2, id){
    this.id = id
    this.board = new Board(5, 4)
    this.turn = 0
    this.total_mana = 3
    this.player1 = p1
    this.player2 = p2
    this.currentPlayer = 0

    this.board.stored_pieces = 
    [
    // new Piece(1, this.p1, 4, 0),
    // new Piece(12, this.p1, 4, 1),
    // new Piece(12, this.p1, 4, 2),
    // new Piece(10, this.p2, 0, 0),
    // new Piece(10, this.p2, 0, 1),
    // new Piece(10, this.p2, 0, 2)
    ]

    this.board.dmg_infl[this.p1] = 0
    this.board.dmg_infl[this.p2] = 0

    this.board.populate()
  }

  // cycles through next turn
  next_turn(){
    this.turn += 1

    if (this.turn % 2 != 0){
      this.total_mana += 1
      this.handle_player_turn(this.player1)
    } else {
      this.handle_player_turn(this.player2)
    }
  }

  // handles player turn procedures
  handle_player_turn(player){
    player.mana = this.total_mana
    this.currentPlayer = player
    this.move_pieces(player)
  }
  
  // move player pieces forward, handles collision and update
  move_pieces(player){
    this.board.stored_pieces = this.board.stored_pieces.filter((piece)=>{
      if (piece.owner === player){
        return piece.forward()
      } else {
        return piece
      }
    })

    this.check_collision(player)
    this.board.update(player)
  }

  // deals damage for both pieces in same coordinate
  check_collision(player){
    let coord_pieces = this.board.get_coord_pieces_d()

    let coord_all = Object.keys(coord_pieces)

    coord_all.forEach((coord)=>{
      let pieces = coord_pieces[coord]
      if (pieces.length > 1) {
        let sorted = pieces.sort((a, b)=>{
          return (b.health) - (a.health);
        });

        let damage = sorted[1].health

        this.board.stored_pieces.forEach((piece)=>{
          if (piece == sorted[0]){
            piece.hurt(damage)
          } else if (piece == sorted[1]){
            piece.hurt(damage)
          }
        })
      }
    })
  }
}

class Board {
  constructor(row, col){
    this.row = row
    this.col = col

    // creates empty matrix[row][col]
    this.matrix = new Array();
    for(let i = 0; i < row; i++){
      this.matrix[i] = []

      for(let j = 0; j < col; j++){
        this.matrix[i][j] = '0'
      }
    }

    this.stored_pieces = []
    this.dmg_infl = {}
  }

  // places stored pieces into board matrix
  populate(){
    this.stored_pieces.forEach((piece)=>{
      this.matrix[piece.row][piece.col] = piece
    })
  }

  update(player){
    // clears board
    this.matrix = []
    for(let i = 0; i < this.row; i++){
      this.matrix[i] = []

      for(let j = 0; j < this.col; j++){
        this.matrix[i][j] = '0'
      }
    }

    // clears dead pieces
    this.stored_pieces = this.stored_pieces.filter((piece)=>{
      if (piece.alive()){
        return piece
      }
    })

    // kills, deals damage to player for pieces outside board
    this.stored_pieces.forEach((piece)=>{
      if (piece.row >= 0 && piece.row < this.row){
        this.matrix[piece.row][piece.col] = piece
      } else {
        let inv_dmg = piece.health
        this.dmg_infl[player] += inv_dmg
        piece.health = 0
      }
    })

    // clears dead pieces
    this.stored_pieces = this.stored_pieces.filter((piece)=>{
      if (piece.alive()){
        return piece
      }
    })
  }

  // returns (key: value) of ('row,column': [piece, ...])
  get_coord_pieces_d(){
    let all_p = this.stored_pieces
    let similar_p = {}

    for (let i = 0; i < all_p.length; i++){
      let coord_all_p = [all_p[i].row, all_p[i].col]
      similar_p[String(coord_all_p)] = []
    }

    for (let i = 0; i < all_p.length; i++){
      let coord_all_p = [all_p[i].row, all_p[i].col]
      similar_p[String(coord_all_p)].push(all_p[i])
    }

    return similar_p
  }
}

class Player {
  constructor(num, id){
    this.id = id
    this.num = num
    this.mana = 0
    this.health = 20
    this.cards = []
  }
}

class Piece {
  constructor(health, owner, row, col){
    this.health = health
    this.owner = owner
    this.row = row
    this.col = col
  }

  // damages piece's health based on damage
  hurt(damage){
    this.health -= damage
  }

  // checks if piece is alive
  alive(){
    if (this.health <= 0){
      return false
    } else {
      return true
    }
  }

  // if player 1, moves up OR if player 2, moves down 
  forward(){
    if (this.owner.num === 1){
      this.row -= 1
    } else {
      this.row += 1
    }
    return this
  }
}

// let p1 = new Player(1, 1)
// let p2 = new Player(2, 2)

// let game = new Game(p1, p2, 1)

// game.board.stored_pieces = [new Piece(1, p1, 4, 0)]

// game.board.populate()

// console.log(game.board.matrix)

// for (let i = 0; i < 10; i++){
//   game.next_turn()
//   console.log(game.turn)
//   console.log(game.board.matrix)
// }

exports.Game = Game;
exports.Board = Board;
exports.Player = Player;
exports.Piece = Piece;

