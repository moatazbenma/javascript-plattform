const ask = require("prompt-sync")()


a = parseInt(ask("Put a number : "))


for(i=1; i < 10; i++){
    console.log(`${a} * ${i} = ${a * i}`)
}