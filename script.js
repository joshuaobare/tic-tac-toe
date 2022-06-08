const gameBoard = (() => {
    const board =[]
    

    const playerFactory = (name,marker) => {
        const getName = () => name;
        const option = () => marker;
        return {getName,option};
    }

    const player1 = playerFactory('TBD','X')
    const player2 = playerFactory('TBD','X')

    const cell = document.querySelectorAll('.cell')
    cell.forEach((square) => { 
        board.push(square)
        
    square.addEventListener('click', function(e) {
        
        e.target.innerHTML = 'O'
        console.log(e)
        

        function playerSwapper() {
            if (board[board.length-1] === 'X') {
                e.target.innerHTML = "O"
            } 
    
            else {
                e.target.innerHTML = 'X'
            }
    
        }

        playerSwapper()
        board.push(e.target.innerHTML)
        console.log(square)
    },{once:true})

    })




    return {playerFactory}
    
})();


