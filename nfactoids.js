(function() {

// n is the object holding all the properties of
// the current number

var n = {
  value: null,
  factorlist: [],
  factorstring: "",
  prime: null,
  square: null,
  squarefree: null,
  smooth: null,
  triangular: null,
  factorial: null,
  fibonacci: null,
  catalan: null,
  somos: null,
  duration: null
};


// vars providing access to the user interface

var input = document.getElementById("number-recog-input");
var inputLabel = document.getElementById("input-label");
var goButton = document.getElementById("go-button");
var clearButton = document.getElementById("clear-button");
var factorsCell = document.getElementById("factors-cell");
var primeCell = document.getElementById("prime-cell");
var squareCell = document.getElementById("square-cell");
var squareFreeCell = document.getElementById("square-free-cell");
var smoothCell = document.getElementById("smooth-cell");
var triangularCell = document.getElementById("triangular-cell");
var fibonacciCell = document.getElementById("fibonacci-cell");
var factorialCell = document.getElementById("factorial-cell");
var catalanCell = document.getElementById("catalan-cell");
var somosCell = document.getElementById("somos-cell");
var timerP = document.getElementById("timer");



// CALCULATE PROPERTIES OF NUMBERS

// Trial division for factoring integers. Start by extracting
// all powers of 2, then go through the odd primes in sequence,
// up to sqrt(N). 

function factor(N) {
  n.factorlist = [];
  var limit = Math.floor(Math.sqrt(N));
  var d = 3, q = N, r = 0;
  while ((q % 2) === 0) {
    n.factorlist.push(2);
    q = q / 2;
  }
  while (d <= limit) {
    if ((q % d) === 0) {
      n.factorlist.push(d);
      q = q / d;
    }
    else {
      d += 2;
    }
  }
  if (q > 1) {
        n.factorlist.push(q);
  }
  return(n.factorlist);
}


// Format the list of factors as a string with intercalated multiplication signs.
// Note: Be careful here. This function assumes that n.factorlist has already
// been computed by a prior call to factor(N).

function makeFactorString() {
  var i, flen, factors;
  flen = n.factorlist.length;
  if (flen === 0) {             // triggered only by N=0 and N=1
    return "";
  }
  else {
    factors = String(n.factorlist[0]);
    for (i = 1; i < flen; i++) {
      factors += " &times; " + n.factorlist[i];
    }
    return factors;
  }
}


// Detecting primes is trivial once we have the prime factors. Careful
// about calling factor(N) first.

function isPrime() {
  return n.factorlist.length === 1;
}


// We could also detect squares by checking to see that every factor
// appears an even number of times. But it's even easier to use the
// built-in sqrt function.

function isSquare(N) {
  var root = Math.floor(Math.sqrt(N));
  return root * root === N;
}


// Square-free means no repeated factors. We can check that directly
// in the factorlist (which comes to us already sorted). Careful
// about calling factor(N) first.

function isSquareFree() {
  var i, j, flen;
  flen = n.factorlist.length;
  if (flen < 2) {
    return true;
  }
  else {
    for (i = 0, j = 1; j < flen; i++, j++) {
      if (n.factorlist[i] === n.factorlist[j]) {
        return false;
      }
    }
    return true;
  }
}


// A square-root-smooth number is an integer N with no prime factor larger
// than sqrt(N). Just check the final item in the factorlist.

function isSmooth(N) {
  var flen = n.factorlist.length;
  return (flen > 1) && (n.factorlist[flen - 1] <= Math.sqrt(N));
}


// N is triangular if N = 1 + 2 + 3 + ... + k = k(k+1)/2. Solving k^2 + k - 2N == 0
// for k, we get a discriminate of sqrt(8N + 1). So N is triangular only if 8N + 1
// is a perfect square.
  
function isTriangular(N) {
  return isSquare(8 * N + 1);
}


// Fibonacci tests. Ira Gessel's trick is so pretty, but it fails
// when N^2 gets much beyond 10^15.
  
function gessel(N) {
  var s = 5 * N * N;
  return isSquare(s + 4) || isSquare(s - 4);
}
  


// So instead we just iterate the sequence until we either hit N (in which
// case N is Fibonacci) or exceed N (in which case it's not).

function isFibo(N) {
  var a = 0, b = 1, tmp;
  while (a < N) {
    tmp = a;              // Looking forward to saying [a, b] = [b, a+b] in ES6
    a = b;
    b = tmp + b;
  }
  return a === N;
}


// For factorials we divide by each successive 
// integer starting with 2. If the remainder is ever nonzero, N is not a
// factorial.

function isFactorial(N) {
  var d = 2, q = N, r = 0;
  while (q > 1 && r === 0) {
    r = q % d;
    q = q / d;
    d += 1;
  }
  return (q === 1 && r === 0);
}


// Recognize Catalan numbers by running the generator until c >= N.

function isCatalan(N) {
  var c = 1, k = 0;
  while (c < N) {
    k += 1;
    c = c * (4 * k - 2) / (k + 1);
  }
  return c === N;
}


// Likewise with the Somos sequence.

// NOTE: This version fails for 32606721084786, the largest Somos-$ number
// under 10^15.

function isSomos_failure (N) {
  var next = 1, S = [1, 1, 1, 1];
  while (next < N) {
    next = (S[3] * S[1] + S[2] * S[2]) / S[0];
    S.shift();
    S.push(next);
    console.log(next, S)
  }
  return next === N;
}

  
// Fix by rearrangement, dividing by S[0] before multiplying and summing.
  
function isSomos(N) {
  var next = 1, S = [1, 1, 1, 1];
  while (next < N) {
    next = S[3] * S[1] / S[0] + S[2] * S[2] / S[0];
    S.shift();
    S.push(next);
  }
  return next === N;
}




// EVENT HANDLERS AND OTHER ASPECTS OF UI


// The event handler for the input element, which collects the value of N, then
// runs the various recognizers and records their output.

function calculemus(ev) {
  var start, finish;             // for timing
  
  if (input.value === "") {          // no number in the input box
    inputLabel.className = "gray";   // not an error condition, keep the reminder low-key
    clearResults();                  // no results to display
  }
  else {                                               // evidently there's some input
    n.value = parseInt(input.value);                   // take only integer part of whatever the <number> input allows
    if (n.value > 0 && n.value < 1000000000000000) {   // verify that we're in range
      input.value = n.value;                           // rewrite the displayed value to match what parseInt returned
      inputLabel.className = "gray";                   // make sure we're not shouting in red letters
      start = performance.now();                       // grab current time at microsecond resolution
      n.factorlist = factor(n.value);                  // factor N and run all the recognizers
      n.factorstring = makeFactorString();
      n.prime = isPrime();
      n.square = isSquare(n.value);
      n.squarefree = isSquareFree();
      n.smooth = isSmooth(n.value);
      n.triangular = isTriangular(n.value);
      n.fibonacci = isFibo(n.value);
      n.factorial = isFactorial(n.value);
      n.catalan = isCatalan(n.value);
      n.somos = isSomos(n.value);
      finish = performance.now();                      // get ending time, and subtract start
      n.duration = finish - start;
      displayResults();
    }
    else {                                             // must be something fishy about the input
      inputLabel.className = "red";                    // flash instructions in red and clear the results
      clearResults();
    }
  }
}

function surveyProperties(start, end) {
  var i, count, zeros = [], sevens = [];
  clearResults();
  for (i = start; i <= end; i++) {
    n.value = i;
    n.factorlist = factor(n.value);
    count = 0;
    if (isPrime()) count++;
    if (isSquare(n.value)) count++;
    if (isSquareFree()) count++;
    if (isSmooth(n.value)) count++;
    if (isTriangular(n.value)) count++;
    if (isFibo(n.value)) count++;
    if (isFactorial(n.value)) count++;
    if (isCatalan(n.value)) count++;
    if (isSomos(n.value)) count++;
    if (count === 0) {
      zeros.push(i);
    }
    if (count === 7) {
      sevens.push(i);
    }
  }
  console.log("zeros", zeros);
  console.log("sevens", sevens);
}




// Convert boolean value to a one-character string: green checkmark,
// red scripty 'x', or gray '?'. 

function checkmark(val) {
  if (val === true) {
    return "<span class='green'>&checkmark;</span>";
  }
  else if (val === false) {
    return "<span class='red'>&cross;</span>";
  }
  else {
    return "<span class='gray'>?</span>";
  }
}


// Light up the screen with calculated results.

function displayResults() {
  factorsCell.innerHTML = "Prime factors: " + n.factorstring;
  primeCell.innerHTML = checkmark(n.prime);
  squareCell.innerHTML = checkmark(n.square);
  squareFreeCell.innerHTML = checkmark(n.squarefree);
  smoothCell.innerHTML = checkmark(n.smooth);
  triangularCell.innerHTML = checkmark(n.triangular);
  fibonacciCell.innerHTML = checkmark(n.fibonacci);
  factorialCell.innerHTML = checkmark(n.factorial);
  catalanCell.innerHTML = checkmark(n.catalan);
  somosCell.innerHTML = checkmark(n.somos);
  if (n.duration !== null) {
    timerP.innerHTML = "Elapsed time: " + n.duration.toFixed(3) + " ms."
  }
  else {
    timerP.innerHTML = "Elapsed time:"
  }
}


// Reset all the properties of n to null, convert a couple to other falsy types,
// then call displayResults to remove any stale data showing on the screen.

function clearResults() {
  var prop;
  for (prop in n) {
    n[prop] = null;
  }
  n.factorlist = [];
  n.factorstring = "";
  displayResults();
}


// Called at load time

function init() {
  input.value = "";
  clearResults();
}

  

// Call calculemus on either an input change event or a click on the Go button.
// The Clear button and window.onload both trigger init().

input.addEventListener("change", calculemus, false);

goButton.addEventListener("click", calculemus, false);

clearButton.addEventListener("click", init, false);

window.onload = init();

})()
