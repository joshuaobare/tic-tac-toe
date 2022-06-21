const gameBoard = (() => {
    const board =[]
    
    const boardContent =[]
    const winningMessage = document.querySelector('[data-winning-message-text]')
    const winningMessageElement = document.getElementById('winningMessage')
    const restartButton = document.getElementById('restartButton')
    const playersection = document.getElementById('playernames')
    const player1name = document.getElementById('player1name')
    const player2name = document.getElementById('player2name')
    const formSection = document.getElementById('formSection')

    const actualboard = document.getElementById('gameboard')
    const subbtn = document.getElementById('submit')

    let player1
    let player2
    

   /* const nameChecker = () => {
       let name1 = document.getElementById('player1').value
       let name2 = document.getElementById('player2').value
        console.log(name1)

        return {name1, name2}

    }
    nameChecker() */
    const playerFactory = (name,marker) => {
        const getName = () => name;
        const option = () => marker;
        const playTurn = (e) => {
            e.target.innerHTML = marker
            e.target.classList.add(marker)
        }
        
        
        
        return {getName,option,playTurn};
    }

    const subFunction = (e) => {
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
        
       // const names = nameChecker()
       // const names1 = names.name1
        //const names2 = names.name2
        player1 = playerFactory(name1,'X')
        player2 = playerFactory(name2,'O')
        player1name.innerHTML = `Player 1:  <span style="color:#D92121";>${player1.getName()}</span>`
        player2name.innerHTML = `Player 2:  <span style="color:#D92121";>${player2.getName()}</span>`
        
    }   
    subbtn.addEventListener('click', subFunction)

    
    
    
    
    

    
    
    //console.log(player1.getName())
     

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
        console.log(e)
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
        console.log(names1)
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


