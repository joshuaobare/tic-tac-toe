const Player = (name,marker) => {
    const getName = () => name;
    const option = () => marker;
    return {getName,option};
}

const player1 = Player('jeff','X')
const player2 = Player('nani')
