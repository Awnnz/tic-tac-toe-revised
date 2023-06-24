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
            const winner = false;
            for (let i = 0; i < GameBoard.showBoard().length; i++) {
                const row = [];
                for (let j = 0; j < GameBoard.showBoard().length; j++) {
                    row.push(GameBoard.showBoard()[j][i]);
                }
                arr.push(row)
                if (GameBoard.showBoard()[0][i] === undefined) return;
                if (arr[i].every(element => element === GameBoard.showBoard()[0][i])) return true;
            }
        }

        threeInaDiagonal = () => {
            let cell = GameBoard.showBoard();
            if ([cell[0][0], cell[1][1], cell[2][2]].every(element => element === 'X') || [cell[0][2], cell[1][1], cell[2][0]].every(element => element === 'X')) return true;
            
        }
        

        return (threeInaRow() || threeInaColumn() || threeInaDiagonal());
    }

    const playRound = (row, column) => {
        if (GameBoard.getBoard()[row][column].getValue() !== undefined) return;
        GameBoard.addMark(row, column, currentPlayer.getMark());

        if (checkWin()) {
            document.querySelector('.overlay').style.display = 'block';
            document.querySelector('.winner').style.display = 'block';
            return;
        };

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