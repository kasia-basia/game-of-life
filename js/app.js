document.addEventListener("DOMContentLoaded", function (event) {

    function GameOfLife(boardWidth, boardHeight) {
        this.width = boardWidth;
        this.height = boardHeight;
        this.board = document.getElementById('board');
        this.cells = [];

        //buttons
        this.play = document.getElementById('play');
        this.pause = document.getElementById('pause');
        this.gliderBtn = document.getElementById('glider');
        this.acornBtn = document.getElementById('acorn');


        this.createBoard = function () {
            this.board.style.width = boardWidth * 10 + 'px';
            this.board.style.height = boardHeight * 10 + 'px';

            const divTotal = boardHeight * boardWidth;  // obliczam pole boardu
            for (let i = 0; i < divTotal; i++) {  // w pętli dodaje divy
                const newDiv = document.createElement('div');
                this.board.appendChild(newDiv);
                this.cells.push(newDiv);
            }

            for (let y = 0; y < this.cells.length; y++) { // zmiana klasy po kliknieciu
                this.cells[y].addEventListener("click", function (e) {
                    this.classList.toggle('live');
                });
            }
        };

        this.index = function (x, y) {
            return this.cells[x + (y * this.width)];
        };

        this.setCellState = function (x, y, state) {
            const cell = this.index(x, y);

            if (cell.classList.contains(state)) {
                cell.classList.remove(state);
            } else {
                cell.classList.add(state);
            }
        };

        this.glider = function (x, y) {
            this.setCellState(x + 1, y - 1, 'live'); //3
            this.setCellState(x + 1, y, 'live'); //4
            this.setCellState(x + 1, y + 1, 'live'); //5
            this.setCellState(x, y + 1, 'live'); //6
            this.setCellState(x - 1, y, 'live'); //8
        };
        this.acorn = function (x, y) {
            this.setCellState(x, y, 'live');
            this.setCellState(x - 2, y - 1, 'live');
            this.setCellState(x - 2, y + 1, 'live');
            this.setCellState(x - 3, y + 1, 'live');
            this.setCellState(x + 1, y + 1, 'live');
            this.setCellState(x + 2, y + 1, 'live');
            this.setCellState(x + 3, y + 1, 'live');
        };


        this.computeNextCellState = function (x, y) {
            let liveNeighborCount = 0;
            for (let i = y - 1; i < y + 2; i++) {
                for (let j = x - 1; j < x + 2; j++) {
                    if (i !== y || j !== x) {
                        if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
                            if (this.index(j, i).className === 'live') {
                                liveNeighborCount++;
                            }
                        }
                    }
                }
            }

            if (this.index(x, y).classList.contains('live')) { // dla zywej komorki
                if (liveNeighborCount === 2 || liveNeighborCount === 3) {
                    return 1;
                } else {
                    return 0
                }

            } else { // dla martwej komorki
                if (liveNeighborCount === 3) {
                    return 1;
                } else {
                    return 0;
                }
            }
        };

        this.computeNextGeneration = function () {
            this.nextGeneration = [];
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    this.nextGeneration.push(this.computeNextCellState(j, i));
                }
            }
        };

        this.printNextGeneration = () => {
            this.computeNextGeneration();
            for (let i = 0; i < this.cells.length; i++) {
                this.cells[i].classList.remove('live');
                if (this.nextGeneration[i] === 1) {
                    this.cells[i].classList.add('live');
                }
            }
        };

        this.startGame = () => {
            this.idInterval = setInterval(this.printNextGeneration, 200);
            this.play.disabled = true;
        };

        this.pauseGame = () => {
            clearInterval(this.idInterval);
            this.play.disabled = false;
        };

        this.play.addEventListener('click', this.startGame);
        this.pause.addEventListener('click', this.pauseGame);
        this.gliderBtn.addEventListener('click', () => this.glider(3, 3));
        this.acornBtn.addEventListener('click', () => this.acorn((this.width / 2), (this.height / 2)));
    }

    const game = new GameOfLife(80, 80);
    game.createBoard();

});

