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
        this.playableSpots -= 1
    }
  

    return {playSpot , board , playOrder , playableSpots }

})()

const Game = (()=>{
    const aiMode = (e) => {
        const {player , computer , displayMarkers, endState} = displayController
        const {playOrder , board} = Gameboard

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
            
            if(e.target.dataset.coord !== null) {
                
                if (e.target.textContent !== ""){
                    
                    return 
                } else {
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
            }
            
            
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
        const {playOrder } = Gameboard

        if(playOrder.length === 9){            
            return true
        } else {
            return false
        }
    }

    const winnerChecker = (board, marker) => {
        
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


    

    const minimax = (board , character) => {

        const {computer , player} = displayController
        
        const availableSpots = []
        const moves = []
        let bestMove = ""

        board.forEach((items,x) => {
            items.forEach((item, y) => {
                if(board[x][y] === undefined){
                    availableSpots.push([x,y])
                    
                }
            })
            
        })
        
        if(winnerChecker(board, player.marker)){
            return {score:-10}
        } else if (winnerChecker(board , computer.marker)){
            return {score:10}
        } else if (availableSpots.length === 0){
            return {score:0}
        }

        availableSpots.forEach(item => {
            let move = {}
            move.index = [item[0],item[1]]
         
            board[item[0]][item[1]] = character.marker

            if (character === computer){
                var result = minimax(board , player)                
                move.score = result.score
                board[item[0]][item[1]] = undefined
                
            } else {
                var result = minimax(board , computer)
                move.score = result.score
                board[item[0]][item[1]] = undefined
                
            }

            
            moves.push(move)
            
        })

        if (character === computer){
            let bestScore = -10000
            moves.forEach((item , index) => {
                
                if(item.score > bestScore){
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
    const playerMarkers = document.querySelector(".player-markers")
    const identifierCont = document.querySelector(".marker-identifiers")
    const playerMarker = document.querySelector(".player-marker")
    const aiMarker = document.querySelector(".ai-marker")
    const player1namecont = document.querySelector(".player1cont")
    const player1markercont = document.querySelector(".player1marker")
    const player2namecont = document.querySelector(".player2cont")
    const player2markercont = document.querySelector(".player2marker")

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
        player1namecont.innerText = name1
        player2namecont.innerText = name2
        player1markercont.innerText = player1.marker
        player2markercont.innerText = player2.marker
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
        console.log(e.target)
        if (e.target.classList.contains("player-ai")){
            aIGameSection.classList.remove("hide")
        }
        else if(e.target.classList.contains("player-player")) {
            formSection.classList.remove("hide")
        }
        oppChecker.classList.add("hide")
    }

    const endState = (player) => {

        const {winnerChecker , drawChecker} = Game
        
        const hasWon = winnerChecker(Gameboard.board, player.marker)
        const hasDrawn = drawChecker()

        if (hasWon) {
            winningMessage.innerText = `${player.name} has won!`
        } 
        if (hasDrawn){
            winningMessage.innerText = `It's a tie!`
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
        playerMarkers.classList.add("hide")
        identifierCont.classList.remove("hide")
        playerMarker.innerText = player.marker
        aiMarker.innerText = computer.marker
    }
        
    subbtn.addEventListener("click" , submitFunction)

    cells.forEach(item => {
        item.addEventListener("click", Game.playerMode)       

    })

    aiCells.forEach(cell => cell.addEventListener("click" , (e) => {
        
        disableMarkerBtns()
        Game.aiMode(e)
    }, {once:true}))

    oppButtons.forEach(btn => btn.addEventListener("click" , opponentMatcher))
    
    markers.forEach(marker => marker.addEventListener("click" , markerAllocator))
    
    restartButton.addEventListener("click" , resetGame)



    return {player1 , player2 , displayMarkers , endState , player , computer}
})()








