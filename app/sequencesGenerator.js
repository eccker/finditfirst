// Import the necessary module
const crypto = require('crypto');

// Function to generate random integers
function getRandomInt(max) {
  return crypto.randomInt(0, max);
}

// Function to generate a series of 6 unique random numbers from list L
function generateUniqueSeries(L, length) {
  const result = [];
  const usedIndices = new Set();

  while (result.length < length) {
    const randomIndex = getRandomInt(L.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      result.push(L[randomIndex]);
    }
  }

  return result;
}

// Function to generate M series of 12 random numbers from list L with specific matching requirement
function generateSeries(L, M) {
  const series = [];
  const fibonacci = [13, 21]; // Start the Fibonacci sequence

  for (let i = 0; i < M; i++) {
    let attempts = 0;
    let matchFound = false;

    while (!matchFound) {
      const firstHalf = generateUniqueSeries(L, 6);
      const secondHalf = generateUniqueSeries(L, 6);
      const firstHalfSet = new Set(firstHalf);
      const secondHalfSet = new Set(secondHalf);

      // Check if there's at least one common element
      for (const num of firstHalfSet) {
        if (secondHalfSet.has(num)) {
          matchFound = true;
          break;
        }
      }

      if (matchFound || attempts >= fibonacci[attempts >= fibonacci.length ? fibonacci.length - 1 : attempts]) {
        series.push([...firstHalf, ...secondHalf]);
        break;
      }

      attempts++;
      // Expand the Fibonacci sequence if necessary
      if (attempts >= fibonacci.length) {
        fibonacci.push(fibonacci[fibonacci.length - 1] + fibonacci[fibonacci.length - 2]);
      }
    }
  }
  
  return series;
}

let match = []
const maxLevel = 256
for (let index = 12; index < maxLevel; index++) {
    const L = Array.from({ length: index }, (_, i) => i + 1); 
    const M = 100; // Number of series to generate
    const generatedSeries = generateSeries(L,M)
    match.push(generatedSeries)
}
console.log(match.length)
console.log(match[0][0][0])
