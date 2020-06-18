import BoardSquare from "./board-square.js";

export default class ChessBoard {
	constructor(orientation) {
		this.orientation = orientation || "white";
		this.file = ["a", "b", "c", "d", "e", "f", "g", "h"];
		this.boardSquares = new Map();
		this.selectedBoardSquare = null;
		this.colors = {
			DARK: "#b58863",
			LIGHT: "#f0d9b5",
			YELLOW: "#fce803",
		};
		this.boardPositions = {
			START: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
			RUY_LOPEZ: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R",
		};
		this.init();
	}

	init() {
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

			const boardSquare = new BoardSquare(color, file, rank, this.orientation);
			boardSquare.div.addEventListener(
				"click",
				this.handleSquareClick.bind(this)
			);
			document.getElementById("chess-board").appendChild(boardSquare.div);
			this.boardSquares.set(file * 10 + rank, boardSquare);
		}
		this.layPieces(this.boardPositions.RUY_LOPEZ);
	}

	layPieces(fen) {
		let file = 1,
			rank = 8;
		for (let i = 0; i < fen.length; i++) {
			if (fen[i] === "/") {
				rank--;
			} else if (isNaN(fen[i])) {
				const boardSquare = this.boardSquares.get(file * 10 + rank);
				boardSquare.piece = fen[i];

				const pieceImage = this.getPieceImage(fen[i]);
				boardSquare.div.appendChild(pieceImage);

				file = ++file % 8 === 0 ? 8 : file % 8;
			} else {
				file += parseInt(fen[i]);
				file = file % 8 === 0 ? 8 : file % 8;
			}
		}
	}

	getPieceImage(piece) {
		const pieceImage = document.createElement("IMG");
		pieceImage.setAttribute("src", this.imageURL(piece));
		return pieceImage;
	}

	imageURL(piece) {
		if (this.isUpper(piece)) {
			return `img/chesspieces/w${piece}.png`;
		} else {
			return `img/chesspieces/b${piece}.png`;
		}
	}

	isUpper(char) {
		if (char === char.toUpperCase()) {
			return true;
		}
		return false;
	}

	handleSquareClick(event) {
		console.log(this);
		let selectedBoardSquare = this.getSelectedBoardSquare(
			this.getBoardSquareDiv(event.target)
		);

		console.log(selectedBoardSquare);
		console.log(event.target);
	}

	getBoardSquareDiv(target) {
		if (target.nodeName === "IMG") {
			return target.parentNode;
		} else {
			return target;
		}
	}

	getSelectedBoardSquare(div) {
		let file = parseInt(div.style.gridColumnStart);
		let rank = parseInt(div.style.gridRowStart);

		if (this.orientation === "white") {
			rank = 9 - rank;
		}
		return this.boardSquares.get(file * 10 + rank);
	}

	haveSameColorPiece(square1, square2) {
		if (this.isUpper(square1.piece) && this.isUpper(square2.piece)) {
			return true;
		}

		if (!this.isUpper(square1.piece) && !this.isUpper(square2.piece)) {
			return true;
		}
		return false;
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
