const winningMessage = document.querySelector('[data-winning-message-text]')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const player1name = document.getElementById('player1name')
const player2name = document.getElementById('player2name')
const formSection = document.getElementById('formSection')
const actualboard = document.getElementById('gameboard')
const subbtn = document.getElementById('submit')

const PlayerFactory = (name, marker) => {

    const playSpot = () => {

    }

    return {name, marker}
}

const coordBuilder = (string) => {
    const coords = string.split(",")
    coords.map(item => Number(item))

    return coords
}


const Gameboard = (()=>{
    const board = [[,,],[,,],[,,]]
    const plays = 9
    
    const playSpot = (e , player) => {
        const { coord } = e.target.dataset 
        const coords = coordBuilder(e)
        

        if(board[coords[0]][coords[1]] === undefined){
            board[coords[0]][coords[1]] = player.marker
        }
        
    }

    

    return {playSpot , board}

})()

const displayController = (() => {
    
    const cells = document.querySelectorAll(".cell")
    cells.forEach(item => {

        const coords = coordBuilder(item.dataset.coord)
        item.textContent = Gameboard.board[coords[0]][coords[1]]

    })


})()

/* const player1 = PlayerFactory("name" , "X")
const player2 = PlayerFactory("name" , "O")
Gameboard.playSpot("0,0", player1)
Gameboard.playSpot("0,2", player1)
Gameboard.playSpot("0,1", player2) */



