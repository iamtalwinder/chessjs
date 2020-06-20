import _ from "lodash";
import ChessBoard from "./chess-board.js";
import "./index.css";

const chessBoard = new ChessBoard();
chessBoard.initBoard(chessBoard.boardPositions.START);
