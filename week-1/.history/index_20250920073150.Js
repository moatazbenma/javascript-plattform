const moment = require("moment")


const birthDate = moment("2004-01-12", "YYYY-MM-DD")

const today = moment()


const years = today.diff(birthDate, "years")
const months = today.diff(birthDate.clone().add(years, "years"), "month")
const days = today.diff(birthDate.clone().add(years, "years").add(months, "months"), "days")




console.log(`You are ${years} years, ${months} months`)