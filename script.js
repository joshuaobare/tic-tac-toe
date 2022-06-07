const PlayerFactory = (name,marker) => {
    const getName = () => name;
    const option = () => marker;
    return {getName,option};
}



const cell = document.querySelectorAll('.cell')

cell.forEach((button) => {
    button.addEventListener('click', function(e) {
        e.target.innerHTML = 'X'
        console.log(e)
    },{once:true})
}
)