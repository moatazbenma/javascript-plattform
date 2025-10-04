const ask = require("prompt-sync")




const name = ask("Put a number: ") 


if (name % 2 == 0) {
    console.log("That's even number")
}
else{
    console.log("That's old number")
}