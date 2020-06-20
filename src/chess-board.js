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
		};
		this.boardPositions = {
			START: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			RUY_LOPEZ:
				"r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 3",
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
		console.log(this.orientation);

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
			console.log(this.orientation);
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
				boardSquare.piece = fen[i];

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
		}
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
			while (this.activeBoardSquares.length) {
				const boardSquare = this.activeBoardSquares.pop();
				boardSquare.restoreColor();
				boardSquare.move = "";
			}
		}
		selectedBoardSquare.changeColor(this.colors.SELECTED);
		this.activeBoardSquares.push(selectedBoardSquare);
		const moves = this.chess.moves({ square: selectedBoardSquare.name });

		if (moves.length) {
			moves.forEach((move) => {
				let color,
					squareName = move.split("x")[1];
				console.log(move);
				if (squareName) {
					color = this.colors.VALID_CAPTURE;
				} else {
					color = this.colors.VALID_MOVE;
					if (move.length > 2) {
						squareName = move[move.length - 2] + move[move.length - 1];
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

// //unselect element
// if (
// 	this.movePiece.from &&
// 	this.movePiece.from.element.isEqualNode(selectedSquare.element)
// ) {
// 	this.movePiece.from.element.style.backgroundColor = this.movePiece.from.color;
// 	this.movePiece.from = null;
// 	return;
// }

// //select element
// if (
// 	!this.selectedSquare ||
// 	this.haveSameColorPiece(this.selectedSquare, selectedSquare)
// ) {
// 	selectedSquare.element.style.backgroundColor = this.onSelect;
// 	if (this.movePiece.from) {
// 		this.movePiece.from.element.style.backgroundColor = this.movePiece.from.color;
// 	}
// 	this.movePiece.from = selectedSquare;
// 	return;
// }

// //move element
// if (this.movePiece.from) {
// 	if (
// 		selectedSquare.piece == "" ||
// 		!this.haveSameColorPiece(this.movePiece.from, selectedSquare)
// 	) {
// 		const fromImage = this.movePiece.from.element.firstChild;
// 		fromImage.remove();
// 		const toImage = selectedSquare.element.firstChild;
// 		if (toImage) toImage.remove();
// 		selectedSquare.element.appendChild(fromImage);
// 		this.movePiece.from.element.style.backgroundColor = this.movePiece.from.color;
// 		selectedSquare.piece = this.movePiece.from.piece;
// 		this.movePiece.from.piece = "";
// 		this.movePiece.from = null;
// 	}
// }
