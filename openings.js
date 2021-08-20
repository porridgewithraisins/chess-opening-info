import Database from "better-sqlite3";
import {
    OPENINGS_DATABASE_OPTIONS,
    OPENINGS_TABLE,
    ECO_COLUMN,
    FEN_COLUMN,
    MOVES_COLUMN,
    NAME_COLUMN,
} from "./constants.js";
import { convertToAlgebraic } from "./convertMoveNotation.js";
import { Chess } from "chess.js";
import path from "path";
const __dirname = path.resolve();

const db = new Database(
    path.join(__dirname, `${OPENINGS_TABLE}.sqlite`),
    OPENINGS_DATABASE_OPTIONS
);

const selectEcoAndName = `SELECT ${ECO_COLUMN}, ${NAME_COLUMN} FROM ${OPENINGS_TABLE} WHERE ${FEN_COLUMN} = (?)`;
const stmtEcoAndName = db.prepare(selectEcoAndName);

const selectFenAndMoves = `SELECT ${FEN_COLUMN}, ${MOVES_COLUMN} FROM ${OPENINGS_TABLE} WHERE ${NAME_COLUMN} like (?)`;
const stmtFenAndMoves = db.prepare(selectFenAndMoves);

export const findEcoAndNameOfFen = (FEN) => {
    if (!(FEN && new Chess().validate_fen(FEN))) {
        return new Error("Invalid FEN");
    }
    const row = stmtEcoAndName.get(FEN);

    if (row === undefined) {
        return new Error("");
    }

    return { eco: row[ECO_COLUMN], name: row[NAME_COLUMN] };
};

export const findFenAndMovesOfName = (Name, algebraic = false) => {
    const row = stmtFenAndMoves.get(Name);

    if (row === undefined) {
        return [undefined, undefined];
    }
    return {
        fen: row[FEN_COLUMN],
        moves: algebraic
            ? convertToAlgebraic(row[MOVES_COLUMN])
            : row[MOVES_COLUMN],
    };
};

export const closeDB = () => db.close();
