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


    

   
    const cell = document.querySelectorAll('.cell')
    cell.forEach((square) => { 
        board.push(square)
        
    square.addEventListener('click', function(e) {
        
        
        console.log(e)
        

        function playerSwapper() {
            
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

        playerSwapper()
        boardContent.push(e.target.innerHTML)
        console.log(boardContent)
        console.log(square)
    },{once:true})

    })




    return {playerFactory}
    
})();


