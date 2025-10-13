const math = require('./math');
const stringUtils = require('./stringUtils');
const logger = require('./logger');
const dateUtils = require('./dateUtils');

const sum = math.add(5, 10);
const product = math.multiply(4, 6);
logger.logInfo(`Sum: ${sum}, Product: ${product}`);

const word = "el mouataz";
const capitalizedWord = stringUtils.capitalize(word);
const reversedWord = stringUtils.reverse(word);
logger.logInfo(`Original: ${word}, Capitalized: ${capitalizedWord}, Reversed: ${reversedWord}`);

const today = dateUtils.getCurrentDate();
const timeNow = dateUtils.getCurrentTime();
logger.logInfo(`Today is ${today}, Current time is ${timeNow}`);
