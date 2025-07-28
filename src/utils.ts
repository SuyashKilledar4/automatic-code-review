export function add(a: number, b: number) {
  return a + b;
}

// Function violating max-depth rule
export function nestedConditions(isValid: boolean) {
  if (isValid) {
    if (isValid) {
      if (isValid) {
        if (isValid) { // Exceeds max-depth of 3
          console.log('Too deeply nested!');
        }
      }
    }
  }
}

nestedConditions(true);

// Function violating max-lines-per-function rule
export function longFunction() {
  // Solving a real problem: Finding all prime numbers up to a given limit
  const limit = 100;
  const primes = [];

  for (let i = 2; i <= limit; i++) {
    let isPrime = true;

    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }

    if (isPrime) {
      primes.push(i);
    }
  }

  console.log('Prime numbers up to', limit, ':', primes);

  // Additional logic to exceed 50 lines
  const sumOfPrimes = primes.reduce((sum, num) => sum + num, 0);
  console.log('Sum of prime numbers:', sumOfPrimes);

  const primeSquares = primes.map((num) => num * num);
  console.log('Squares of prime numbers:', primeSquares);

  const evenPrimes = primes.filter((num) => num % 2 === 0);
  console.log('Even prime numbers:', evenPrimes);

  const primeCount = primes.length;
  console.log('Total number of primes:', primeCount);

  const primeDetails = primes.map((num) => ({
    number: num,
    square: num * num,
    isEven: num % 2 === 0,
  }));

  console.log('Prime details:', primeDetails);
}
