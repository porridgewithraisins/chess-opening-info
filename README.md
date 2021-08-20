# Chess Opening Info

Get opening ECO code, Opening name, given the FEN of a position, to be easily used with JavaScript applications.
Dataset is due to https://github.com/niklasf/chess-openings. (TSV Format)

openings.json contains FEN : {...otherInfo}
and can be used like so:
```js
const getInfo = (FEN) => require('codes.json')[FEN];
```

openings.sqlite contains an SQLite3 table
```sql
CREATE TABLE openings (FEN PRIMARY KEY TEXT, ECO TEXT, NAME TEXT, MOVES TEXT)
```
and openings.js exposes a [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3/) API to access this database.

openings.json is simply the sqlite table exported to JSON format.

The dataset stores moves in Smith Notation. A utility function depending on the popular [chess.js](https://github.com/jhlywa/chess.js/) which converts any notation to [Standard Algebraic Notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)) is exposed in convertMoveNotation.js