export default class BoardSquare {
	constructor(color, file, rank, orientation) {
		this.piece = "";
		this.file = file;
		this.rank = rank;
		this.color = color;
		if (orientation === "white") {
			rank = 9 - rank;
		}
		this.div = this.createDiv(color, file, rank);
	}

	createDiv(color, x, y) {
		const div = document.createElement("DIV");
		div.style.backgroundColor = color;
		div.style.gridColumnStart = x;
		div.style.gridRowStart = y;
		div.className = "board-square";
		return div;
	}
}
