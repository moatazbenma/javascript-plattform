const ask  = require("prompt-sync")()


const a = ask("Enter your score : ")


if (a >= 90){
    console.log("You got A ")
}
else if (a >= 80){
    console.log("you got B")
}