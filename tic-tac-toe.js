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
        playableSpots -= 1
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
                        
            if(board[indexCoords[0]][indexCoords[1]] === undefined){
                board[indexCoords[0]][indexCoords[1]] = player.marker
            } 
             
            
        } else {
            const { coord } = e.target.dataset 
            const coords = coordBuilder(coord)


            if(board[coords[0]][coords[1]] === undefined){
                board[coords[0]][coords[1]] = player.marker
            }
        }

        
        playOrder.push(player)
        spotDecreaser()
        console.log(playOrder)
        console.log(board)
        
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
        const {playOrder} = Gameboard

        if(playOrder.length === 9) {            
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

    

    return {playerMode , drawChecker , winnerChecker , aiMode}
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








