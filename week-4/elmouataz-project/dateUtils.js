function getCurrentDate() {
  return new Date().toLocaleDateString();
}

function getCurrentTime() {
  return new Date().toLocaleTimeString();
}

module.exports = { getCurrentDate, getCurrentTime };
