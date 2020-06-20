import Chess from "chess.js";
import BoardSquare from "./board-square.js";
import wP from "./img/chesspieces/wP.png";
import wN from "./img/chesspieces/wN.png";
import wB from "./img/chesspieces/wB.png";
import wR from "./img/chesspieces/wR.png";
import wQ from "./img/chesspieces/wQ.png";
import wK from "./img/chesspieces/wK.png";
import bP from "./img/chesspieces/bP.png";
import bN from "./img/chesspieces/bN.png";
import bB from "./img/chesspieces/bB.png";
import bR from "./img/chesspieces/bR.png";
import bQ from "./img/chesspieces/bQ.png";
import bK from "./img/chesspieces/bK.png";

export default class ChessBoard {
	constructor() {
		this.orientation = "w";
		this.file = ["a", "b", "c", "d", "e", "f", "g", "h"];
		this.boardSquares = new Map();
		this.colors = {
			DARK: "#b58863",
			LIGHT: "#f0d9b5",
			SELECTED: "#fce803", //yellow
			VALID_MOVE: "#3aa10e", //green
			VALID_CAPTURE: "#a30d1f",
			CHECK: "#e62d27",
			CASTEL: "#13dde8",
		};
		this.boardPositions = {
			START: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			RUY_LOPEZ:
				"r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 3",
			TEST:
				"r3k2r/pb1q1ppp/2nb1n2/1pppp1B1/3PP3/1PNQ1N1P/P1P1BPP1/R3K2R b KQkq - 1 10",
			TEST2: "r3k2r/p2Q1ppp/5n2/1Np2qB1/6B1/1P5P/P1P2Pb1/R3K2R b KQkq - 2 16",
		};
		this.pieceImages = {
			WP: wP,
			WN: wN,
			WB: wB,
			WR: wR,
			WQ: wQ,
			WK: wK,
			BP: bP,
			BN: bN,
			BB: bB,
			BR: bR,
			BQ: bQ,
			BK: bK,
		};
		this.chess = new Chess();
		this.activeBoardSquares = [];
	}

	initBoard(position) {
		this.orientation = position.split(" ")[1];

		let color, file, rank;
		for (let i = 1; i <= 64; i++) {
			file = i % 8 === 0 ? 8 : i % 8;
			rank = Math.ceil(i / 8);

			if (rank % 2 === 0) {
				if (file % 2 === 0) {
					color = this.colors.DARK;
				} else {
					color = this.colors.LIGHT;
				}
			} else {
				if (file % 2 === 0) {
					color = this.colors.LIGHT;
				} else {
					color = this.colors.DARK;
				}
			}

			const name = this.file[file - 1] + rank;
			const boardSquare = new BoardSquare(
				color,
				file,
				rank,
				name,
				this.orientation
			);
			boardSquare.div.addEventListener(
				"click",
				this.handleSquareClick.bind(this)
			);
			document.getElementById("chess-board").appendChild(boardSquare.div);
			this.boardSquares.set(file * 10 + rank, boardSquare);
		}
		this.position(position);
	}

	flipBoard() {
		this.boardSquares.forEach((boardSquare) => {
			const div = boardSquare.div;
			div.style.gridRowStart = 9 - div.style.gridRowStart;
		});
		if (this.orientation === "w") {
			this.orientation = "b";
		} else {
			this.orientation = "w";
		}
	}

	removeAllPieces() {
		this.boardSquares.forEach((boardSquare) => {
			const pieceImg = boardSquare.div.firstChild;
			if (pieceImg) pieceImg.remove();
		});
	}

	position(fen) {
		this.removeAllPieces();
		if (!this.chess.load(fen)) {
			alert("Invalid fen");
			return;
		}
		let file = 1,
			rank = 8;
		for (let i = 0; i < fen.length; i++) {
			if (fen[i] === " ") {
				break;
			}
			if (fen[i] === "/") {
				rank--;
			} else if (isNaN(fen[i])) {
				const boardSquare = this.boardSquares.get(file * 10 + rank);

				const pieceImage = this.getPieceImg(fen[i]);
				boardSquare.div.appendChild(pieceImage);

				file = ++file % 8 === 0 ? 8 : file % 8;
			} else {
				file += parseInt(fen[i]);
				file = file % 8 === 0 ? 8 : file % 8;
			}
		}
	}

	getPieceImg(piece) {
		const pieceImage = new Image();
		pieceImage.src = this.pieceImages[this.pieceImage(piece)];
		return pieceImage;
	}

	pieceImage(piece) {
		if (this.isUpper(piece)) {
			return `W${piece}`;
		} else {
			return `B${piece.toUpperCase()}`;
		}
	}

	isUpper(char) {
		if (char === char.toUpperCase()) {
			return true;
		}
		return false;
	}

	handleSquareClick(event) {
		let selectedBoardSquare = this.getSelectedBoardSquare(
			this.getBoardSquareDiv(event.target)
		);

		if (this.validSquareSelect(selectedBoardSquare)) {
			this.activateBoardSquares(selectedBoardSquare);
		} else if (this.chess.move(selectedBoardSquare.move)) {
			this.makeMove(selectedBoardSquare);
			this.flipBoard();
		}
	}

	makeMove(selectedBoardSquare) {
		const move = selectedBoardSquare.move;
		const pieceImg = selectedBoardSquare.div.firstChild;
		if (move === "O-O") {
			this.castleRook(8, 6);
		} else if (move === "O-O-O") {
			this.castleRook(1, 4);
		} else if (!pieceImg && move.split("x")[1]) {
			let file = selectedBoardSquare.file;
			let rank = this.activeBoardSquares[0].rank;
			this.boardSquares.get(file * 10 + rank).div.firstChild.remove();
		}
		this.movePiece(this.activeBoardSquares[0], selectedBoardSquare);
		this.unactivateBoardSquares();
	}

	castleRook(fromRookFile, toRookFile) {
		let rank = 8;
		if (this.chess.turn() === "b") {
			//because we are doing this after the turn has been made
			rank = 9 - rank;
		}
		const rookSquare = this.boardSquares.get(fromRookFile * 10 + rank);
		const targetSquare = this.boardSquares.get(toRookFile * 10 + rank);
		this.movePiece(rookSquare, targetSquare);
	}

	movePiece(from, to) {
		const fromImg = from.div.firstChild;
		fromImg.remove();
		if (to.div.firstChild) {
			to.div.firstChild.remove();
		}
		to.div.appendChild(fromImg);
	}

	getSelectedBoardSquare(div) {
		let file = parseInt(div.style.gridColumnStart);
		let rank = parseInt(div.style.gridRowStart);
		if (this.orientation === "w") {
			rank = 9 - rank;
		}
		return this.boardSquares.get(file * 10 + rank);
	}

	getBoardSquareDiv(target) {
		if (target.nodeName === "IMG") {
			return target.parentNode;
		} else {
			return target;
		}
	}

	validSquareSelect(selectedBoardSquare) {
		const squareName = selectedBoardSquare.name;
		const squarePieceInfo = this.chess.get(squareName);
		if (squarePieceInfo && this.chess.turn() === squarePieceInfo.color) {
			return true;
		}
		return false;
	}

	activateBoardSquares(selectedBoardSquare) {
		if (this.activeBoardSquares.length) {
			this.unactivateBoardSquares();
		}
		selectedBoardSquare.changeColor(this.colors.SELECTED);
		this.activeBoardSquares.push(selectedBoardSquare);
		const moves = this.chess.moves({ square: selectedBoardSquare.name });

		if (moves.length) {
			console.log(moves);
			moves.forEach((move) => {
				let color,
					squareName = move.split("x")[1];
				if (move == "O-O") {
					let file = 7,
						rank = 8;
					if (this.chess.turn() === "w") {
						rank = 1;
					}
					squareName = this.file[file - 1] + rank;
					color = this.colors.CASTEL;
				} else if (move == "O-O-O") {
					let file = 3,
						rank = 8;
					if (this.chess.turn() === "w") {
						rank = 1;
					}
					squareName = this.file[file - 1] + rank;
					color = this.colors.CASTEL;
				} else if (squareName) {
					color = this.colors.VALID_CAPTURE;
				} else {
					color = this.colors.VALID_MOVE;
					if (move.length > 2) {
						if (isNaN(move[move.length - 1])) {
							squareName = move[move.length - 3] + move[move.length - 2];
						} else {
							squareName = move[move.length - 2] + move[move.length - 1];
						}
					} else {
						squareName = move;
					}
				}
				const boardSquare = this.boardSquares.get(
					this.squareNameToKey(squareName)
				);
				boardSquare.move = move;
				boardSquare.changeColor(color);
				this.activeBoardSquares.push(boardSquare);
			});
		}
	}

	unactivateBoardSquares() {
		while (this.activeBoardSquares.length) {
			const boardSquare = this.activeBoardSquares.pop();
			boardSquare.restoreColor();
			boardSquare.move = "";
		}
	}

	squareNameToKey(name) {
		const fileNumber = {
			a: 1,
			b: 2,
			c: 3,
			d: 4,
			e: 5,
			f: 6,
			g: 7,
			h: 8,
		};
		name.split();
		return parseInt(fileNumber[name[0]] + name[1]);
	}
}
