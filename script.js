const gameBoard = (() => {
    const board =[]
    const boardContent =[]
    

    const playerFactory = (name,marker) => {
        const getName = () => name;
        const option = () => marker;
        const playTurn = (e) => {
            e.target.innerHTML = marker
            e.target.classList.add(marker)
        }
        
        
        
        return {getName,option,playTurn};
    }

    const player1 = playerFactory('P1','X')
    const player2 = playerFactory('P2','O')
    let currentMarker

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

   
    const cell = document.querySelectorAll('.cell')
    cell.forEach((square) => { 
        board.push(square)
            
        square.addEventListener('click', function(e) {
                       
            if (winnerChecker(board,playerSwapper(e))) {
                console.log('winner')
            }
            boardContent.push(e.target.innerHTML)
            console.log(boardContent)
            console.log(square.innerHTML)
            console.log(board[0])
            
        },{once:true})

    })




    return {playerFactory}
    
})();


