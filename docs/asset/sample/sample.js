// Regex "y" and "u" flags
var a = /[a-zA-Z]+/gimyu;

// for..of loops
for(let x of y) { }

// Modules: import
import { foo as bar } from "file.js"

// Template strings
`Only on ${y} one line`
`This template string ${x} is on

multiple lines.`
`40 + 2 = ${ 40 + 2 }`
`The squares of the first 3 natural integers are ${[for (x of [1,2,3]) x*x].join(', ')}`
