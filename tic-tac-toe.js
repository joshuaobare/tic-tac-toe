const PlayerFactory = (name, marker) => {

    return {name, marker}
}

// coordBuilder creates an array of coordinates based on dataset.coords held by the grid cells

const coordBuilder = (string) => {
    const coords = string.split(",")
    coords.map(item => Number(item))

    return coords
}


const Gameboard = (()=>{
    board = [
        [undefined,undefined,undefined],
        [undefined,undefined,undefined],
        [undefined,undefined,undefined]
    ]

    playOrder = []
    playableSpots = 9

    const spotDecreaser = () => {
        this.playableSpots -= 1
    }
    
    const playSpot = (e , player) => {
        
        if (!e) {
            const indexCoords = []
            
            board.forEach((items,x) => {
                items.forEach((item, y) => {
                    if(board[x][y] === undefined){
                        indexCoords.push(x)
                        indexCoords.push(y)
                    }
                })
            })

            const spot = Game.minimax(board , player)
            console.log("Placed Computer")
            /* if(board[indexCoords[0]][indexCoords[1]] === undefined){
                board[indexCoords[0]][indexCoords[1]] = player.marker
            }  */
            console.log(spot)
            /* board[spot.move.x][spot.move.y] = player.marker */
            board[spot.index[0]][spot.index[1]] = player.marker
            
        } else {
            const { coord } = e.target.dataset 
            const coords = coordBuilder(coord)


            if(board[coords[0]][coords[1]] === undefined){
                board[coords[0]][coords[1]] = player.marker
            }
        }

        
        playOrder.push(player)
        spotDecreaser()
        /* console.log(playOrder)
        console.log(board)
        console.log(playableSpots) */
        this.playableSpots -= 1
    }
  

    return {playSpot , board , playOrder , playableSpots }

})()

const Game = (()=>{
    const aiMode = (e) => {
        const {player , computer , displayMarkers, endState} = displayController
        const {playOrder} = Gameboard

        if (player.marker === ""){
            player.marker = "X"
            computer.marker = "O"
        }

        if (playOrder.length === 0 ) {
            Gameboard.playSpot(e , player)
            displayMarkers()
            Gameboard.playSpot(null , computer)
            displayMarkers()

        }else if (playOrder[playOrder.length - 1].name === "Computer"){
            Gameboard.playSpot(e , player)
            displayMarkers()
            endState(player)
            try {
                Gameboard.playSpot(null , computer)
                endState(computer)
            } catch{
                console.log("Game over")
            }
            
            displayMarkers()
        } 

        displayMarkers()
    }
   

    const playerMode = (e) => {
        const {playOrder} = Gameboard
        const {player1 , player2 , displayMarkers , endState} = displayController
        const previousPlayer = playOrder[playOrder.length - 1]
        let activePlayer
        
        if (playOrder.length === 0) {
            Gameboard.playSpot(e , player1)
            activePlayer = player1
        } else {
            if (previousPlayer.marker === "X") {
                Gameboard.playSpot(e , player2)
                activePlayer = player2
            } else {
                Gameboard.playSpot(e , player1)
                activePlayer = player1
            }
        }
        displayMarkers()
       
       endState(activePlayer)
    }

    const drawChecker = () => {
        const {playOrder,playableSpots} = Gameboard

        if((playOrder.length === 9)&&(playableSpots === 0) ){            
            return true
        } else {
            return false
        }
    }

    const winnerChecker = marker => {

        const {board} = Gameboard

        const winningCombinations = [
            [0,1,2],
            [0,3,6],
            [0,4,8],
            [1,4,7],
            [2,5,8],
            [2,4,6],
            [3,4,5],
            [6,7,8]
        ]

        const boardContent = []
        board.forEach(items => {
            items.forEach(item => boardContent.push(item))
        })
       
        return winningCombinations.some(combination => {
            return combination.every(item => boardContent[item] === marker)
        })

    }


    /* const evaluate = (board, depth) => {
        let xCount = 0;
        let oCount = 0;
        let xWinningLines = 0;
        let oWinningLines = 0;
        let emptySpaces = 0;
    
        // Check rows, columns and diagonals
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === "X" && board[i][1] === "X" && board[i][2] === "X") xWinningLines++;
            if (board[i][0] === "O" && board[i][1] === "O" && board[i][2] === "O") oWinningLines++;
            if (board[0][i] === "X" && board[1][i] === "X" && board[2][i] === "X") xWinningLines++;
            if (board[0][i] === "O" && board[1][i] === "O" && board[2][i] === "O") oWinningLines++;
        }
        if (board[0][0] === "X" && board[1][1] === "X" && board[2][2] === "X") xWinningLines++;
        if (board[0][0] === "O" && board[1][1] === "O" && board[2][2] === "O") oWinningLines++;
        if (board[0][2] === "X" && board[1][1] === "X" && board[2][0] === "X") xWinningLines++;
        if (board[0][2] === "O" && board[1][1] === "O" && board[2][0] === "O") oWinningLines++;
    
        // Count the number of X and O markers on the board
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "X") xCount++;
                if (board[i][j] === "O") oCount++;
                if (board[i][j] === "") emptySpaces++;
            }
        }
    
        // Assign a score based on the heuristics
        let score = 0;
        if (xWinningLines > 0) score = 10 + xWinningLines + depth;
        else if (oWinningLines > 0) score = -10 - oWinningLines - depth;
        else score = (xCount - oCount) + emptySpaces;
    
        return score;
    }; */

    const evaluate = (board,player) => {
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                if (board[i][0] === player.marker) return 10;
                else if (board[i][0] === !player.marker) return -10;
            }
        }
        // Check columns
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                if (board[0][i] === player.marker) return 10;
                else if (board[0][i] === !player.marker) return -10;
            }
        }
        // Check diagonals
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            if (board[0][0] === player.marker) return 10;
            else if (board[0][0] === !player.marker) return -10;
        }
        if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            if (board[0][2] === player.marker) return 10;
            else if (board[0][2] === !player.marker) return -10;
        }
        // Otherwise, it's a draw
        return 0;
    };
    
    /* const minimax = (board , character , depth) => {

        const {computer , player} = displayController
        
        let bestMove
        let bestScore

        
          if(winnerChecker(player.marker)){
            return {score:-10}
        } else if (winnerChecker(computer.marker)){
            return {score:10}
        } else if (drawChecker()){
            return {score:0}
        }  

       /*  if(depth === 0 || winnerChecker(player) || winnerChecker(computer)) {
            return {score: evaluate(board, player), move:bestMove}
        } 
       

        
        if (character === computer) {
            bestScore = -Infinity
            board.forEach((row, i) => {
                row.forEach((cell,j) => {
                    if (cell === undefined) {
                        board[i][j] = character.marker;
                        let score = minimax(board , character, depth-1).score
                        board[i][j] = undefined

                        if(score > bestScore) {
                            bestScore = Math.max(bestScore , score)
                            bestMove = {x:i , y:j}
                        }
                    }
                })
            })
        } else {
            bestScore = Infinity
            board.forEach((row, i) => {
                row.forEach((cell,j) => {
                    if (cell === undefined) {
                        board[i][j] = character.marker;
                        let score = minimax(board , character, depth-1).score
                        board[i][j] = undefined

                        if(score < bestScore) {
                            bestScore = Math.min(bestScore , score)
                            bestMove = {x:i , y:j}
                        }
                    }
                })
            })
        }

        return {score:bestScore , move:bestMove}
   

        
        
        





    } */

    const minimax = (board , character) => {

        const {computer , player} = displayController
        
        const availableSpots = []
        const moves = []
        let bestMove = ""

        board.forEach((items,x) => {
            items.forEach((item, y) => {
                if(board[x][y] === undefined){
                    availableSpots.push([x,y])
                    /* moves.push(`board[${x}][${y}]`) */
                }
            })
            
        })
        
        if(winnerChecker(player.marker)){
            return {score:-10}
        } else if (winnerChecker(computer.marker)){
            return {score:10}
        } else if (availableSpots.length === 0){
            return {score:0}
        }

        availableSpots.forEach(item => {
            let move = {}
            move.index = [item[0],item[1]]
          //  console.log([item[0],item[1]])

            board[item[0]][item[1]] = character.marker

            if (character === computer){
                var result = minimax(board , player)                
                move.score = result.score
                board[item[0]][item[1]] = undefined
                
            } else {
                var result = minimax(board , computer)
                /* console.log(result) */
                move.score = result.score
                board[item[0]][item[1]] = undefined
                
            }

            /* board[item[0]][item[1]] = undefined */
            /* console.log([item[0],item[1]] )
            console.log(move.index) */
            /* console.log(move) */
            
            moves.push(move)
            
        })

        if (character === computer){
            let bestScore = -10000
            moves.forEach((item , index) => {
                
                if(item.score > bestScore){
                    /* console.log(item.score) */
                    bestScore = item.score
                    bestMove = index
                }
            })
        } else {
            let bestScore = 10000
            moves.forEach((item , index) => {
                if(item.score < bestScore){
                    bestScore = item.score
                    bestMove = index
                }
            })
        }
        console.log(availableSpots)
        /* console.log(moves[bestMove]) */
        return moves[bestMove]


        

        
        
        





    }



    

    return {playerMode , drawChecker , winnerChecker , aiMode , minimax}
})()

const displayController = (() => {
    const winningMessage = document.querySelector('[data-winning-message-text]')
    const winningMessageElement = document.getElementById('winningMessage')
    const restartButton = document.getElementById('restartButton')
    const player1name = document.getElementById('player1name')
    const player2name = document.getElementById('player2name')
    const formSection = document.getElementById('formSection')
    const actualboard = document.getElementById('gameboard')
    const subbtn = document.getElementById('submit')
    const cells = document.querySelectorAll(".cell")
    const player1 = PlayerFactory("",'X')
    const player2 = PlayerFactory("",'O')
    const player = PlayerFactory("You","")
    const computer = PlayerFactory("Computer", "")
    const playerAI = document.querySelector('.player-ai')
    const playerPlayer = document.querySelector('.player-player')
    const oppChecker = document.querySelector('.opponent-matcher')
    const oppButtons = document.querySelectorAll(".confirm-opponent")
    const aIGameSection = document.querySelector(".ai-gameSection")
    const aiCells = document.querySelectorAll(".ai-cell")
    const markers = document.querySelectorAll(".marker")

    const submitFunction = (e) => {
        e.preventDefault()
        actualboard.classList.remove('hide')
        formSection.style.display = "none"
        let name1 = document.getElementById('player1').value
        let name2 = document.getElementById('player2').value

        if (name1 === "") {
            name1= "Player1"
        }
        if (name2 === "") {
            name2= "Player2"
        }        
        
        player1.name = name1
        player2.name = name2        
        player1name.innerText = `${name1}: ${player1.marker} `
        player2name.innerText = `${name2}: ${player2.marker} `
        
    }
    

    

    const resetGame = () => {
        
        location.reload()
        
    }       

    

    const displayMarkers = () => {
        cells.forEach(item => {
            const coords = coordBuilder(item.dataset.coord)
            item.textContent = Gameboard.board[coords[0]][coords[1]]
        })

        aiCells.forEach(item => {
            const coords = coordBuilder(item.dataset.coord)
            item.textContent = Gameboard.board[coords[0]][coords[1]]
        })
        
    }

    const opponentMatcher = (e) => {
        if (e.target.classList.contains("player-ai")){
            aIGameSection.classList.remove("hide")
        }
        else {
            formSection.classList.remove("hide")
        }
        oppChecker.classList.add("hide")
    }

    const endState = (player) => {

        const {winnerChecker , drawChecker} = Game
        
        const hasWon = winnerChecker(player.marker)
        const hasDrawn = drawChecker()

        if (hasWon) {
            winningMessage.innerText = `${player.name} has won!`
        } 
        if (hasDrawn){
            winningMessage.innerText = `DRAW!`
        }

        if (hasWon || hasDrawn) {
            winningMessageElement.classList.add('show')
        }

    }

    const markerAllocator = (e) => {
        if(e.target.classList.contains("x-marker")) {
            player.marker = "X"
            computer.marker = "O"
        } else {
            player.marker = "O"
            computer.marker = "X"
            Gameboard.playSpot(null,computer)
            displayMarkers()
        }
        
        disableMarkerBtns()
    }

    const disableMarkerBtns = () => {
        markers.forEach(btn => {
            btn.disabled = true
            btn.removeEventListener("click" , markerAllocator)
        })
    }
        
    subbtn.addEventListener("click" , submitFunction)

    cells.forEach(item => {
        item.addEventListener("click", Game.playerMode)       

    })

    aiCells.forEach(cell => cell.addEventListener("click" , (e) => {
        disableMarkerBtns()
        Game.aiMode(e)
    }))

    oppButtons.forEach(btn => btn.addEventListener("click" , opponentMatcher))
    
    markers.forEach(marker => marker.addEventListener("click" , markerAllocator))
    
    restartButton.addEventListener("click" , resetGame)



    return {player1 , player2 , displayMarkers , endState , player , computer}
})()








