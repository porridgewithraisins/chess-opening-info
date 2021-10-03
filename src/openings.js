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

/**
 * Construct an instance by specifying path to your SQLite3 database.
 * Then access methods of this instance for interacting with the database
 * @param {string | Buffer} databasePath the path to the SQLite3 database file
 */
export class Openings {
    constructor(databasePath) {
        this.db = new Database(databasePath, OPENINGS_DATABASE_OPTIONS);

        const selectEcoAndName = `SELECT ${ECO_COLUMN}, ${NAME_COLUMN} FROM ${OPENINGS_TABLE} WHERE INSTR(?,${FEN_COLUMN}) != 0`;
        this.stmtEcoAndName = this.db.prepare(selectEcoAndName);

        const selectFenAndMoves = `SELECT ${FEN_COLUMN}, ${MOVES_COLUMN} FROM ${OPENINGS_TABLE} WHERE ${NAME_COLUMN} = (?) COLLATE NOCASE`;
        this.stmtFenAndMoves = this.db.prepare(selectFenAndMoves);
    }

    /**
     * @typedef {Object} EcoAndName
     * @property {string | undefined} eco The eco code of the opening
     * @property {string | undefined} name The name of the opening
     */

    /**
     * @param {string} FEN The FEN string, with _or_ without ply information
     * @return {EcoAndName} The object containing the eco and name.
     *  Maintains object structure if there was no match - Both fields will
     *  be undefined.
     */
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

    /**
     * @typedef {Object} MoveFormatOptions
     * @property {boolean} algebraic
     */

    /**
     * @typedef {Object} FenAndMoves
     * @property {string | undefined} fen the FEN of the position, without space at end
     * @property {string | undefined} moves The movestring, in Smith Notation by default, or in SAN if option `algebraic` is true
     */

    /**
     *
     * @param {string} name The exact name of the opening
     * @param {MoveFormatOptions} options
     * @returns {FenAndMoves} the fen and moves of the corresponding opening.
     *  Maintains object structure if there was no match - Both fields will
     *  be undefined.
     */
    findFenAndMovesOfName(name, options) {
        const row = this.stmtFenAndMoves.get(name);

        if (row === undefined) {
            return { fen: undefined, moves: undefined };
        }
        return {
            fen: row[FEN_COLUMN],
            moves: options?.algebraic
                ? this.convertToAlgebraic(row[MOVES_COLUMN])
                : row[MOVES_COLUMN],
        };
    }

    /**
     * Converts any format whatsoever to Standard Algebraic Notation
     * @param {string} moveString the move string in any format
     * @returns {string} the move string in SAN
     */

    convertToAlgebraic(moveString) {
        const chess = new Chess();
        moveString.split(" ").forEach((move) => {
            chess.move(move, { sloppy: true });
        });
        return chess.pgn();
    }
}
