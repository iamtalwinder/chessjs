import _ from "lodash";
import ChessBoard from "./chess-board.js";
import "./index.css";

const chessBoard = new ChessBoard();
chessBoard.initBoard(
	"rnbqkbnr/ppppp2p/8/4Ppp1/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3"
);
