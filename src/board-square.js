export default class BoardSquare {
	constructor(color, file, rank, name, orientation) {
		this.piece = "";
		this.file = file;
		this.rank = rank;
		this.name = name;
		this.move = "";
		this.color = color;
		if (orientation === "w") {
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

	changeColor(color) {
		this.div.style.backgroundColor = color;
	}

	restoreColor() {
		this.div.style.backgroundColor = this.color;
	}
}
