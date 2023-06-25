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

    const checkWin = () => {
        const threeInaRow = () => {
            for (let i = 0; i < GameBoard.showBoard().length; i++) {
                if (GameBoard.showBoard()[i][0] === undefined) return false;
                if (GameBoard.showBoard()[i].every(element => element === GameBoard.showBoard()[i][0])) return true;
            }
            return false;
        }

        const threeInaColumn = () => {
            const arr = [];
            for (let i = 0; i < GameBoard.showBoard().length; i++) {
                const row = [];
                for (let j = 0; j < GameBoard.showBoard().length; j++) {
                    row.push(GameBoard.showBoard()[j][i]);
                }
                arr.push(row)
                if (GameBoard.showBoard()[0][i] === undefined) return;
                if (arr[i].every(element => element === GameBoard.showBoard()[0][i])) return true;
            }
            return false;
        }

        threeInaDiagonal = () => {
            let cell = GameBoard.showBoard();
            if ((cell[0][0] === undefined && cell[1][1] === undefined && cell[2][2] === undefined) || (cell[0][2] === undefined && cell[1][1] === undefined && cell[2][0] === undefined)) return false;
            if ([cell[0][0], cell[1][1], cell[2][2]].every(element => element === cell[0][0]) || [cell[0][2], cell[1][1], cell[2][0]].every(element => element === cell[0][2])) return true;
            console.log(cell[0][0], cell[1][1], cell[2][2])
            return false;
            
        }
        
        threeInaDiagonal()
        return (threeInaRow() || threeInaColumn() || threeInaDiagonal());
    }

    const resetBoard = () => {
        for (let i = 0; i < GameBoard.getBoard().length; i++) {
            for (let j = 0; j < GameBoard.getBoard()[0].length; j++) {
                GameBoard.getBoard()[i][j].setValue(undefined)
            }
        }

        document.querySelector('.overlay').style.display = 'none';
        document.querySelector('.winner').style.display = 'none';

    };

    const playRound = (row, column) => {
        if (GameBoard.getBoard()[row][column].getValue() !== undefined) return;
        GameBoard.addMark(row, column, currentPlayer.getMark());

        if (checkWin()) {
            
            document.querySelector('.winner-text').textContent = `${gameController.getCurrentPlayer().getName()}(${gameController.getCurrentPlayer().getMark()}) Wins!`;
            document.querySelector('.overlay').style.display = 'block';
            document.querySelector('.winner').style.display = 'block';
            return;
        };

        switchPlayers();
    }

    const getCurrentPlayer = () => currentPlayer;
    
    return {playRound, getCurrentPlayer, resetBoard}
})();

const displayController = (() => {

    document.querySelector(`.play-again`).onclick = () => {
        gameController.resetBoard();
        updateBoard();
    }

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
    
    return {updateBoard};
})()



// Functions
function cell() {
    let value = undefined;

    const getValue = () => value;

    const setValue = (player) => value = player;

    return {getValue, setValue}
}