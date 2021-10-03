import Database from "better-sqlite3";
import { Chess } from "chess.js";

const OPENINGS_TABLE = "openings";
const FEN_COLUMN = "fen";
const ECO_COLUMN = "eco";
const NAME_COLUMN = "name";
const MOVES_COLUMN = "moves";
const OPENINGS_DATABASE_OPTIONS = {
    readonly: true,
};

export class Openings {
    constructor(databasePath) {
        this.db = new Database(databasePath, OPENINGS_DATABASE_OPTIONS);

        const selectEcoAndName = `SELECT ${ECO_COLUMN}, ${NAME_COLUMN} FROM ${OPENINGS_TABLE} WHERE INSTR(?,${FEN_COLUMN}) != 0`;
        this.stmtEcoAndName = this.db.prepare(selectEcoAndName);

        const selectFenAndMoves = `SELECT ${FEN_COLUMN}, ${MOVES_COLUMN} FROM ${OPENINGS_TABLE} WHERE ${NAME_COLUMN} = (?) COLLATE NOCASE`;
        this.stmtFenAndMoves = this.db.prepare(selectFenAndMoves);
    }

    findEcoAndNameOfFen(FEN) {
        if (!(FEN && new Chess().validate_fen(FEN))) {
            return new Error("Invalid FEN");
        }

        const row = this.stmtEcoAndName.get(FEN);

        if (row === undefined) {
            return { eco: undefined, name: undefined };
        }

        return { eco: row[ECO_COLUMN], name: row[NAME_COLUMN] };
    }

    findFenAndMovesOfName(Name, options) {
        const row = this.stmtFenAndMoves.get(Name);

        if (row === undefined) {
            return [undefined, undefined];
        }
        return {
            fen: row[FEN_COLUMN],
            moves: options?.algebraic
                ? this.convertToAlgebraic(row[MOVES_COLUMN])
                : row[MOVES_COLUMN],
        };
    }

    close() {
        this.db.close();
    }

    convertToAlgebraic(moveString) {
        const chess = new Chess();
        moveString.split(" ").forEach((move) => {
            chess.move(move, { sloppy: true });
        });
        return chess.pgn();
    }
}
