const ask = require("prompt-sync")()


const a = ask("Enter a word : ")



for(i = a.length - 1; i >= 0;i--){
        process.stdout.write(a[i]);
}

