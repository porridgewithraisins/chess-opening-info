import { Chess } from "chess.js";
export const convertToAlgebraic = (moveString) => {
    const chess = new Chess();
    moveString.split(" ").forEach((move) => {
        chess.move(move, { sloppy: true });
    });
    return chess.pgn();
};
