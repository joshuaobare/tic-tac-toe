const gameBoard = (() => {
    const board =[]
    const nameArr = []
    const boardContent =[]
    const winningMessage = document.querySelector('[data-winning-message-text]')
    const winningMessageElement = document.getElementById('winningMessage')
    const restartButton = document.getElementById('restartButton')
    
    const actualboard = document.getElementById('gameboard')
    const subbtn = document.getElementById('submit')

    var currentMarker,name1,name2

    const subFunction = (e) => {
        e.preventDefault()
        actualboard.classList.remove('hide')
        name1 = document.getElementById('player1').value
        name2 = document.getElementById('player2').value
        nameArr.push(name1)
        nameArr.push(name2)

        return name1, name2
    }   
    subbtn.addEventListener('click', subFunction)

    const playerFactory = (name,marker) => {
        const getName = () => name;
        const option = () => marker;
        const playTurn = (e) => {
            e.target.innerHTML = marker
            e.target.classList.add(marker)
        }
        
        
        
        return {getName,option,playTurn};
    }

    
    const player1 = playerFactory(nameArr[0],'X')
    const player2 = playerFactory(nameArr[1],'O')
    console.log(player1.getName())
     

    const playerSwapper = (e) => {
        if (boardContent.length === 0) {
            player1.playTurn(e)
            currentMarker = "X"
            
        } 

        if (boardContent[boardContent.length-1] === 'X') {
            player2.playTurn(e)
            currentMarker = "O"
            
        }

        if (boardContent[boardContent.length-1] === 'O') {
            player1.playTurn(e)
            currentMarker = "X"
            
        }
        
        return currentMarker
    }
    
    const winnerChecker = (board,x) => {
        let winningCombinations = [
                        [0,1,2],
                        [0,3,6],
                        [0,4,8],
                        [1,4,7],
                        [2,5,8],
                        [2,4,6],
                        [3,4,5],
                        [6,7,8]
                    ]

        return winningCombinations.some(combination => {
        return combination.every(index => {
                return board[index].classList.contains(x)
           })
        })
    
    }

    const gameEnd = (draw,e) => {
        if(draw) {
            winningMessage.innerText = 'Draw!'
        }
        else {
            if (e.target.innerHTML === 'X') {
                winningMessage.innerText = `${player1.getName()} Wins`
            }
            else {
                winningMessage.innerText = `${player2.getName()} Wins`
            }
            
        }
        winningMessageElement.classList.add('show')

    }

    const gameFlow = (e) => {

        if (winnerChecker(board,playerSwapper(e))) {
            gameEnd(false,e)
        }
        else if (drawChecker()) {
            gameEnd(true,e)
        }
        else {
            playerSwapper(e) 
        }

        boardContent.push(e.target.innerHTML)
    }
   
    const cell = document.querySelectorAll('.cell')
    cell.forEach((square) => { 
        board.push(square)
            
        square.addEventListener('click', gameFlow,{once:true})
        restartButton.addEventListener('click', () => {
            /*
            console.log(square)
            square.innerHTML = ""
            square.classList.remove('X')
            square.classList.remove('O')
            square.removeEventListener('click',gameFlow,false)
            winningMessageElement.classList.remove('show') */
            location.reload()

    })})

    const drawChecker = () => {
        return [...cell].every(cellElement => {
            return cellElement.classList.contains("X") || cellElement.classList.contains("O")
        })
    }

  

    return {playerFactory,subFunction}
    
})();


