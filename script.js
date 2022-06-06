const Player = (name,marker) => {
    const getName = () => name;
    const option = () => marker;
    return {getName,option};
}



const cell = document.querySelectorAll('.cell')

cell.forEach(() => {
    cell.addEventListener(click,function (e) {
        
    },{once:true})
}
)