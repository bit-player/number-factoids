
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

function clearResults() {
  var prop;
  for (prop in n) {
    n[prop] = null;
  }
  n.factorlist = [];
  n.factorstring = "";
  displayResults();
}


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



function factor(N) {
  n.factorlist = [];
  var limit = Math.floor(Math.sqrt(N));
  var d = 2, q = N, r = 0;
  while (d <= limit) {
    if ((q % d) === 0) {
      n.factorlist.push(d);
      q = q / d;
    }
    else {
      d = (d === 2) ? 3 : d + 2;
    }
  }
  if (q > 1) {
        n.factorlist.push(q);
  }
  return(n.factorlist);
}

function makeFactorString() {
  var i, flen, factors;
  flen = n.factorlist.length;
  if (flen === 0) {
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


function isTriangular(N) {
  var r = Math.floor(Math.sqrt(2 * N));
  return r * (r + 1) === 2 * N;
}

// Looking forward to saying [a, b] = [b, a+b] in ES6

function isFibo(N) {
  var a = 0, b = 1, tmp;
  while (a < N) {
    tmp = a;
    a = b;
    b = tmp + b;
  }
  return a === N;
}

function isPrime() {
  return n.factorlist.length === 1;
}

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



function isSquare(N) {
  var root = Math.floor(Math.sqrt(N));
  return root * root === N;
}

function isSmooth(N) {
  var flen = n.factorlist.length;
  return (flen > 1) && (n.factorlist[flen - 1] <= Math.sqrt(N));
}



function isFactorial(N) {
  var d = 2, q = N, r = 0;
  while (q > 1 && r === 0) {
    r = q % d;
    q = q / d;
    d += 1;
  }
  return (q === 1 && r === 0);
}

function isCatalan(N) {
  var c = 1, m = 0;
  while (c < N) {
    c = c * (4 * m + 2) / (m + 2);
    m += 1;
  }
  return c === N;
}

function isSomos(N) {
  var next;
  var i = 0;
  var a = [1, 1, 1, 1];
  while (a[0] < N) {
    next = (a[3] * a[1] + a[2] * a[2]) / a[0];
    a.shift();
    a.push(next);
    i += 1;
  }
  return a[0] === N;
}

function calculemus(ev) {
  var start, finish;
  
  if (input.value === "") {
    inputLabel.className = "gray";
    clearResults();    
  }
  else {
    n.value = parseInt(input.value);
    if (n.value > 0 && n.value < 1000000000000000) {
      input.value = n.value;
      start = (new Date()).getTime();
      inputLabel.className = "gray";
      n.factorlist = factor(n.value);
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
      finish = (new Date()).getTime();
      n.duration = finish - start;
      displayResults();
    }
    else {
      inputLabel.className = "red";
      clearResults();
    }
  }
}


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
    timerP.innerHTML = "Elapsed time: " + n.duration + " ms."
  }
  else {
    timerP.innerHTML = "Elapsed time:"
  }
}

function init() {
  input.value = "";
  clearResults();
}



goButton.addEventListener("click", calculemus, false);

clearButton.addEventListener("click", init, false);


input.addEventListener("change", calculemus, false);

window.onload = init();


