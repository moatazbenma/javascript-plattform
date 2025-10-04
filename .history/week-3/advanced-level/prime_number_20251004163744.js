const ask = require("prompt-sync")();

const num = parseInt(ask("Enter a number: "));

let isPrime = true;

// Prime numbers are greater than 1
if (num <= 1) {
    isPrime = false;
} else {
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            isPrime = false;
            break;
        }
    }
}

if (isPrime) {
    console.log(`${num} is a prime number.`);
} else {
    console.log(`${num} is not a prime number.`);
}
