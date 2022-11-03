
// args : number of characters
const calculateReadingTime =  (char) => {
  const wordCount = char.trim().split(/\s+/ig).length
  // word per minute
  const wpm = 225

  return Math.ceil(wordCount / wpm)
}


module.exports = calculateReadingTime