const ask  = require("prompt-sync")()


const a = ask("Enter your score : ")


if (a >= 90){
    console.log("You got A ")
}
if (80 < a < 85){
    console.log("you got B")
}