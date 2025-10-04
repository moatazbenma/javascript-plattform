const ask = require("prompt-sync")




const name = ask("Put a number: ") 


if (name % 2 == 0) {
    console.log("even")
}
else{
    console.log("old")
}