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

// Example usage
// const L = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // List L of N elements
const L = Array.from({ length: 12 }, (_, i) => i + 1); // List L of 100 elements from 1 to 100

const M = 100; // Number of series to generate

// const result = generateSeries(L, M);
// console.log(result);

// Validation function to check the generated series
function validateSeries(series) {
    for (let i = 0; i < series.length; i++) {
      const singleSeries = series[i];
      
      // Check that each series has exactly 12 numbers
      if (singleSeries.length !== 12) {
        return `Series ${i + 1} does not have exactly 12 numbers.`;
      }
  
      const firstHalf = singleSeries.slice(0, 6);
      const secondHalf = singleSeries.slice(6, 12);
  
      // Check that first 6 numbers are unique
      if (new Set(firstHalf).size !== 6) {
        return `First 6 numbers in series ${i + 1} are not unique.`;
      }
  
      // Check that last 6 numbers are unique
      if (new Set(secondHalf).size !== 6) {
        return `Last 6 numbers in series ${i + 1} are not unique.`;
      }
  
      // Check for at least one matching number between the first 6 and last 6 numbers
      const firstHalfSet = new Set(firstHalf);
      const matchFound = secondHalf.some(num => firstHalfSet.has(num));
  
      if (!matchFound) {
        return `No matching number found between the first 6 and last 6 numbers in series ${i + 1}.`;
      }
    }
    
    return "All series meet the specifications and requirements.";
  }
  
  // Example usage with generated series
  const generatedSeries = generateSeries(Array.from({ length: 100 }, (_, i) => i + 1), 5);
  
  const validationResult = validateSeries(generatedSeries);
  console.log(validationResult);
  
  // Printing generated series for verification
  console.log(generatedSeries);
  

// // Import the necessary module
// const crypto = require('crypto');

// // Function to generate random integers
// function getRandomInt(max) {
//   return crypto.randomInt(0, max);
// }

// // Function to generate a series of 6 unique random numbers from list L
// function generateUniqueSeries(L, length) {
//   const result = [];
//   const usedIndices = new Set();

//   while (result.length < length) {
//     const randomIndex = getRandomInt(L.length);
//     if (!usedIndices.has(randomIndex)) {
//       usedIndices.add(randomIndex);
//       result.push(L[randomIndex]);
//     }
//   }

//   return result;
// }

// // Function to generate M series of 12 random numbers from list L
// function generateSeries(L, M) {
//   const series = [];
  
//   for (let i = 0; i < M; i++) {
//     const firstHalf = generateUniqueSeries(L, 6);
//     const secondHalf = generateUniqueSeries(L, 6);
//     const singleSeries = [...firstHalf, ...secondHalf];
//     series.push(singleSeries);
//   }
  
//   return series;
// }

// // Example usage
// const L = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // List L of N elements
// const M = 100; // Number of series to generate

// const result = generateSeries(L, M);
// console.log(result);



// // // Import the necessary module
// // const crypto = require('crypto');

// // // Function to generate random integers
// // function getRandomInt(max) {
// //   return crypto.randomInt(0, max);
// // }

// // // Function to generate M series of 12 random numbers from list L
// // function generateSeries(L, M) {
// //   const series = [];
  
// //   for (let i = 0; i < M; i++) {
// //     const singleSeries = [];
// //     for (let j = 0; j < 12; j++) {
// //       const randomIndex = getRandomInt(L.length);
// //       singleSeries.push(L[randomIndex]);
// //     }
// //     series.push(singleSeries);
// //   }
  
// //   return series;
// // }

// // // Example usage
// // const L = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // List L of N elements
// // const M = 5; // Number of series to generate

// // const result = generateSeries(L, M);
// // console.log(result);
