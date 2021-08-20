# Chess Opening Info

Get opening ECO code, Opening name, and move list to reach that FEN, given the FEN of a position.

Easily used with JavaScript applications.

The dataset is due to https://github.com/niklasf/chess-openings. (TSV Format)

codes.json contains `FEN : {...otherInfo}`
and can be used like so:
```js
const getInfo = (FEN) => require('codes.json')[FEN];
```

openings.sqlite contains an SQLite3 table
```sql
CREATE TABLE openings (FEN PRIMARY KEY TEXT, ECO TEXT, NAME TEXT, MOVES TEXT);
```
and openings.js exposes a [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3/) API to access this database.

## Usage
```js
import { findEcoAndNameOfFen, findFenAndMovesOfName } from "openings.js";

const opening = findEcoAndNameOfFen(FEN);
console.log(`ECO : ${opening.eco}; Name : ${opening.name}`);

//returns FEN and Moves in Smith Notation (often used in chess programming)
//Smith notation : startSquareEndSquare. e.g 1.e4 -> e2e4 or 5. O-O -> e1g1
const opening = findFenAndMovesOfName(Name);
//returns FEN and Moves in Standard Algebraic Notation
const openingAlgebraic = findFenAndMovesOfName(Name, algebraic = true);
```
The conversion is done with the utility function exposed in convertMoveNotation.js, which converts any notation to [Standard Algebraic Notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)). It depends on the popular [chess.js](https://github.com/jhlywa/chess.js/) library, which you're probably already using if you are seeing this repo.

openings.json is simply the SQLite3 table exported to JSON format.
