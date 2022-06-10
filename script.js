const gameBoard = (() => {
    const board =[]
    const boardContent =[]
    

    const playerFactory = (name,marker) => {
        const getName = () => name;
        const option = () => marker;
        const playTurn = (e) => {
            e.target.innerHTML = marker
        }
        
        
        
        return {getName,option,playTurn};
    }

    const player1 = playerFactory('P1','X')
    const player2 = playerFactory('P2','O')

    const playerSwapper = (e) => {
        if (boardContent.length === 0) {
            player1.playTurn(e)
        } 

        if (boardContent[boardContent.length-1] === 'X') {
            player2.playTurn(e)
        }

        if (boardContent[boardContent.length-1] === 'O') {
            player1.playTurn(e)
        }
    }
    
    const winnerChecker = (board) => {
        let winningCombinations = [
                        [0,1,2],
                        [0,3,6],
                        [0,4,8],
                        [1,4,7],
                        [2,5,8],
                        [3,4,5],
                        [6,7,8]
                    ]

        return winningCombinations.some(combination => {
            return combination.every(index => {
                if (board[index].innerHTML === "O") {
                    return true
                }
                
            })
        })
                
            
    }

   
    const cell = document.querySelectorAll('.cell')
    cell.forEach((square) => { 
        board.push(square)
            
        square.addEventListener('click', function(e) {
                       
            playerSwapper(e)
            boardContent.push(e.target.innerHTML)
            console.log(boardContent)
            console.log(square.innerHTML)
            console.log(board[0])
            if (winnerChecker(board)) {
                console.log('winner')
            }
        },{once:true})

    })




    return {playerFactory}
    
})();


