# Chess Opening Info
General datasets.

Also presents an SQLite api to interact with the dataset.

Easily used with JavaScript applications.

The original dataset is due to https://github.com/niklasf/chess-openings. (TSV Format)

codes.json contains `FEN : {...otherInfo}`
and can be used like so:
```js
const getInfo = (FEN) => require('codes.json')[FEN];
```
**Note**: Object[key] lookup (even from JSON) in extremely fast in JavaScript, so
if your only requirement is getting ECO Code and Name from an
FEN, you should probably just use this, and not bother with the SQLite API.

openings.sqlite contains an SQLite3 table
```sql
CREATE TABLE openings (FEN PRIMARY KEY TEXT, ECO TEXT, NAME TEXT, MOVES TEXT);
```
and openings.js exposes a [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3/) API to access this database.

openings.js depends on the popular [chess.js](https://github.com/jhlywa/chess.js/), which you probably already use if you need this repo.
## Usage
```js
import { Openings } from "./openings.js";

const op = new Openings("./data/openings.sqlite");
/*
    Note that all FENs are stored without the last two fields (the ply information),
    but the query looks for an instring, so both FENs with and without the ply information
    will work. Note that in FENs without the ply information, there is no space
    after the last field.
*/

console.log(
    op.findEcoAndNameOfFen(
        "rn1qkbnr/ppp2ppp/8/3p4/8/6PB/PPPPP3/RNBQ1RK1 b kq - 0 6"
    )
);
// Will give { eco: 'A00', name: 'Amar Opening: Gent Gambit' }


console.log(
    op.findEcoAndNameOfFen(
        "rn1qkbnr/ppp2ppp/8/3p4/8/6PB/PPPPP3/RNBQ1RK1 b kq -"
    )
);
// Will give { eco: 'A00', name: 'Amar Opening: Gent Gambit' }

/*
    returns FEN and Moves in Smith Notation (often used in chess programming)
    Smith notation : startSquareEndSquare. e.g 1.e4 -> e2e4 or 5. O-O -> e1g1 
*/
console.log(op.findFenAndMovesOfName("Nimzowitsch Defense: Wheeler Gambit"));

/* output
    {
        fen: 'r1bqkbnr/pppppppp/2n5/8/1P2P3/8/P1PP1PPP/RNBQKBNR b KQkq -',
        moves: 'e2e4 b8c6 b2b4'
    }
*/


// second argument `algebraic` is false by default, setting it to
// true converts the movelist to Standard Algebraic Notation
console.log(op.findFenAndMovesOfName("London System", true));
/* output
    {
        fen: 'rnbqkb1r/pppppp1p/5np1/8/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq -',
        moves: '1. d4 Nf6 2. Nf3 g6 3. Bf4'
    }
*/

// you can also use the standalone conversion function if you wish
console.log(op.convertToAlgebraic("e2e4 e7e5"));
// gives 1. e4 e5
// It can convert any other format to SAN too, so if you are using ICCF notation
// you can just as well pass it to this function, to get back the SAN.
```
openings.json is simply the SQLite3 table exported to JSON format.
