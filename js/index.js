// Factories/Modules
const GameBoard = (() => {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        board.push(row);
        for (let j = 0; j < columns; j++) {
            row.push(cell());
        }
    }

    const addMark = (row, column, player) => {
        board[row][column].setValue(player)
    }

    const showBoard = () => {
        const boardState = board.map(row => {
            return row.map(cell => {
                return cell.getValue()
            })
        })
        return boardState   
    }

    const getBoard = () => board;

    return {showBoard, addMark, getBoard}
})();

const gameController = (() => {

    const Player = (name, marker) => {
        const getName = () => name;
        const getMark = () => marker;

        return{getName, getMark}
    }

    const player1 = Player('Player 1', 'X')
    const player2 = Player('Player 2', 'O')
    let currentPlayer = player1;
    const switchPlayers = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    const playRound = (row, column) => {
        GameBoard.addMark(row, column, currentPlayer.getMark());
        switchPlayers();
    }

    const getCurrentPlayer = () => currentPlayer;
    
    return {playRound, getCurrentPlayer}
})();

const displayController = (() => {

    const updateBoard = () => {
        document.querySelector('.board').textContent = '';

        GameBoard.getBoard().map((row, rowIndex) => row.map((cell, colIndex) => {
            const div = document.createElement('div');
            div.classList.add('cell');
            div.textContent = cell.getValue();
            
            
            document.querySelector('.board').appendChild(div);

            document.querySelector('.header').textContent = `${gameController.getCurrentPlayer().getName()}(${gameController.getCurrentPlayer().getMark()})'s turn`
    
            div.onclick = () => {
                gameController.playRound(rowIndex, colIndex);
                updateBoard();
            }
        }))
        
    }
    
    updateBoard();
    
})()



// Functions
function cell() {
    let value = undefined;

    const getValue = () => value;

    const setValue = (player) => value = player;

    return {getValue, setValue}
}