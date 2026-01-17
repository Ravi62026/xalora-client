import React, { useState } from "react";
import { Layout } from "../components";

const MathematicalAlgorithms = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Number Theory Algorithms
  const numberTheory = [
    {
      id: "gcd-lcm",
      name: "GCD and LCM",
      complexity: { gcd: "O(log min(a,b))", lcm: "O(log min(a,b))" },
      description: "Greatest Common Divisor and Least Common Multiple - fundamental number theory operations.",
      code: `// Euclidean Algorithm for GCD
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Recursive GCD
int gcdRecursive(int a, int b) {
    return b == 0 ? a : gcdRecursive(b, a % b);
}

// LCM using GCD
int lcm(int a, int b) {
    if (a == 0 || b == 0) return 0;
    return (a / gcd(a, b)) * b; // Careful with overflow
}

// Extended Euclidean Algorithm (for Bézout's identity)
tuple<int, int, int> extendedGCD(int a, int b) {
    if (b == 0) {
        return {a, 1, 0}; // gcd, x, y where a*x + b*y = gcd
    }

    auto [g, x1, y1] = extendedGCD(b, a % b);
    int x = y1;
    int y = x1 - (a / b) * y1;

    return {g, x, y};
}`
    },
    {
      id: "prime-numbers",
      name: "Prime Numbers and Primality Testing",
      complexity: { trial: "O(√n)", sieve: "O(n log log n)" },
      description: "Check if a number is prime and generate prime numbers efficiently.",
      code: `// Trial division primality test
bool isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;

    // Check divisors from 5 to √n, skipping even numbers
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}

// Sieve of Eratosthenes
vector<int> sieveOfEratosthenes(int n) {
    vector<bool> isPrime(n + 1, true);
    vector<int> primes;

    isPrime[0] = isPrime[1] = false;

    for (long long i = 2; i <= n; i++) {
        if (isPrime[i]) {
            primes.push_back(i);

            // Mark multiples of i as composite
            for (long long j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }

    return primes;
}

// Miller-Rabin primality test (probabilistic)
bool millerRabinTest(long long n, long long a) {
    long long s = n - 1;
    int r = 0;

    while (s % 2 == 0) {
        s /= 2;
        r++;
    }

    // Compute a^s mod n
    long long x = modPow(a, s, n);
    if (x == 1 || x == n - 1) return true;

    for (int i = 1; i < r; i++) {
        x = (x * x) % n;
        if (x == n - 1) return true;
    }

    return false;
}

long long modPow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;

    while (exp > 0) {
        if (exp % 2 == 1) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp /= 2;
    }

    return result;
}`
    },
    {
      id: "modular-arithmetic",
      name: "Modular Arithmetic",
      complexity: { basic: "O(1)", pow: "O(log exp)" },
      description: "Arithmetic operations modulo m, including modular inverse and exponentiation.",
      code: `// Modular exponentiation (fast power)
long long modPow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;

    while (exp > 0) {
        if (exp % 2 == 1) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp /= 2;
    }

    return result;
}

// Modular inverse using Extended Euclidean Algorithm
long long modInverse(long long a, long long m) {
    auto [g, x, y] = extendedGCD(a, m);
    if (g != 1) return -1; // No inverse exists

    return (x % m + m) % m; // Ensure positive
}

// Fermat's Little Theorem for prime modulus (when p doesn't divide a)
long long modInversePrime(long long a, long long p) {
    return modPow(a, p - 2, p);
}

// Chinese Remainder Theorem
long long chineseRemainder(vector<long long>& remainders,
                          vector<long long>& moduli) {
    int n = remainders.size();
    long long product = 1;

    for (long long mod : moduli) {
        product *= mod;
    }

    long long result = 0;
    for (int i = 0; i < n; i++) {
        long long pp = product / moduli[i];
        result += remainders[i] * modInverse(pp, moduli[i]) * pp;
        result %= product;
    }

    return result;
}`
    }
  ];

  // Combinatorics
  const combinatorics = [
    {
      id: "factorial-permutations",
      name: "Factorial and Permutations",
      complexity: { factorial: "O(n)", permutations: "O(n! × n)" },
      description: "Calculate factorials and generate all permutations of a set.",
      code: `// Factorial with memoization
vector<long long> factorialMemo(21, -1);

long long factorial(int n) {
    if (n < 0) return 0;
    if (n == 0 || n == 1) return 1;

    if (factorialMemo[n] != -1) return factorialMemo[n];

    return factorialMemo[n] = n * factorial(n - 1);
}

// P(n, k) = n! / (n-k)! - permutations of k items from n
long long permutations(int n, int k) {
    if (k > n) return 0;
    return factorial(n) / factorial(n - k);
}

// C(n, k) = n! / (k! × (n-k)!) - combinations
long long combinations(int n, int k) {
    if (k > n) return 0;
    if (k == 0 || k == n) return 1;

    // Use symmetry: C(n,k) = C(n,n-k)
    k = min(k, n - k);

    long long result = 1;
    for (int i = 1; i <= k; i++) {
        result *= (n - k + i);
        result /= i;
    }

    return result;
}

// Generate all permutations (backtracking)
void generatePermutations(vector<int>& nums, int start,
                         vector<vector<int>>& result) {
    if (start == nums.size()) {
        result.push_back(nums);
        return;
    }

    for (int i = start; i < nums.size(); i++) {
        swap(nums[start], nums[i]);
        generatePermutations(nums, start + 1, result);
        swap(nums[start], nums[i]); // backtrack
    }
}`
    },
    {
      id: "fibonacci-matrix",
      name: "Matrix Exponentiation for Fibonacci",
      complexity: { time: "O(log n)", space: "O(1)" },
      description: "Compute nth Fibonacci number in O(log n) using matrix exponentiation.",
      code: `using Matrix = vector<vector<long long>>;

// Matrix multiplication
Matrix multiply(const Matrix& A, const Matrix& B, long long mod = 0) {
    int n = A.size();
    int m = B[0].size();
    int p = A[0].size();

    Matrix result(n, vector<long long>(m, 0));

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            for (int k = 0; k < p; k++) {
                result[i][j] += A[i][k] * B[k][j];
                if (mod) result[i][j] %= mod;
            }
        }
    }

    return result;
}

// Matrix exponentiation
Matrix matrixPow(Matrix A, long long exp, long long mod = 0) {
    int n = A.size();
    Matrix result(n, vector<long long>(n, 0));

    // Identity matrix
    for (int i = 0; i < n; i++) {
        result[i][i] = 1;
    }

    while (exp > 0) {
        if (exp % 2 == 1) {
            result = multiply(result, A, mod);
        }
        A = multiply(A, A, mod);
        exp /= 2;
    }

    return result;
}

// Fibonacci using matrix exponentiation
long long fibonacciMatrix(long long n, long long mod = 0) {
    if (n == 0) return 0;
    if (n == 1 || n == 2) return 1;

    // Fibonacci matrix: [[1, 1], [1, 0]]
    Matrix fibMatrix = {{1, 1}, {1, 0}};

    Matrix result = matrixPow(fibMatrix, n - 1, mod);

    return result[0][0]; // F(n)
}

// General linear recurrence using matrix exponentiation
vector<long long> linearRecurrence(vector<long long>& coeffs,
                                  vector<long long>& initial, long long n) {
    int k = coeffs.size();

    // Build companion matrix
    Matrix companion(k, vector<long long>(k, 0));

    for (int i = 0; i < k - 1; i++) {
        companion[i + 1][i] = 1;
    }

    for (int i = 0; i < k; i++) {
        companion[i][k - 1] = coeffs[k - 1 - i];
    }

    if (n < k) return {initial[n]};

    Matrix powered = matrixPow(companion, n - k + 1);
    vector<long long> result(k);

    for (int i = 0; i < k; i++) {
        result[i] = 0;
        for (int j = 0; j < k; j++) {
            result[i] += powered[i][j] * initial[k - 1 - j];
        }
    }

    return result;
}`
    }
  ];

  // Numerical Algorithms
  const numericalAlgorithms = [
    {
      id: "binary-exponentiation",
      name: "Binary Exponentiation",
      complexity: { time: "O(log exp)", space: "O(1)" },
      description: "Fast computation of a^b mod m using exponentiation by squaring.",
      code: `// Binary exponentiation (iterative)
long long binaryPow(long long base, long long exp, long long mod = 0) {
    long long result = 1;
    base %= mod; // In case base >= mod

    while (exp > 0) {
        if (exp % 2 == 1) { // If exp is odd
            if (mod) result = (result * base) % mod;
            else result *= base;
        }

        if (mod) base = (base * base) % mod;
        else base *= base;

        exp /= 2; // Divide exp by 2
    }

    return result;
}

// Recursive binary exponentiation
long long binaryPowRecursive(long long base, long long exp, long long mod = 0) {
    if (exp == 0) return 1;

    long long half = binaryPowRecursive(base, exp / 2, mod);

    if (mod) {
        long long result = (half * half) % mod;
        if (exp % 2 == 1) {
            result = (result * (base % mod)) % mod;
        }
        return result;
    } else {
        long long result = half * half;
        if (exp % 2 == 1) {
            result *= base;
        }
        return result;
    }
}

// Matrix exponentiation (for Fibonacci, etc.)
vector<vector<long long>> matrixMultiply(const vector<vector<long long>>& A,
                                        const vector<vector<long long>>& B,
                                        long long mod = 0) {
    int n = A.size();
    int m = B[0].size();
    int p = A[0].size();

    vector<vector<long long>> result(n, vector<long long>(m, 0));

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            for (int k = 0; k < p; k++) {
                if (mod) {
                    result[i][j] = (result[i][j] + A[i][k] * B[k][j]) % mod;
                } else {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }
    }

    return result;
}`
    },
    {
      id: "sieve-algorithms",
      name: "Advanced Sieve Algorithms",
      complexity: { linear: "O(n)", segmented: "O(n log log √n)" },
      description: "Efficient prime generation and factorization algorithms.",
      code: `// Linear Sieve (find smallest prime factor)
vector<int> linearSieve(int n) {
    vector<int> minPrime(n + 1, 0);
    vector<int> primes;

    for (int i = 2; i <= n; i++) {
        if (minPrime[i] == 0) { // i is prime
            minPrime[i] = i;
            primes.push_back(i);
        }

        // Mark multiples of primes
        for (int p : primes) {
            if (i * p > n) break;
            minPrime[i * p] = p;

            // Optimization: each composite marked by smallest prime
            if (i % p == 0) break;
        }
    }

    return minPrime;
}

// Factorize using smallest prime factors
map<int, int> factorize(int n, const vector<int>& minPrime) {
    map<int, int> factors;

    while (n > 1) {
        int p = minPrime[n];
        int count = 0;

        while (n % p == 0) {
            n /= p;
            count++;
        }

        factors[p] = count;
    }

    return factors;
}

// Segmented Sieve for large ranges
vector<int> segmentedSieve(long long low, long long high) {
    long long limit = sqrt(high) + 1;
    vector<bool> mark(limit + 1, true);
    vector<long long> primes;

    // Sieve up to sqrt(high)
    for (long long i = 2; i <= limit; i++) {
        if (mark[i]) {
            primes.push_back(i);
            for (long long j = i * i; j <= limit; j += i) {
                mark[j] = false;
            }
        }
    }

    // Sieve the segment [low, high]
    vector<bool> segment(high - low + 1, true);
    for (long long p : primes) {
        long long start = max(p * p, (low + p - 1) / p * p);

        for (long long j = start; j <= high; j += p) {
            segment[j - low] = false;
        }
    }

    // Handle low = 1
    if (low == 1) segment[0] = false;

    vector<int> result;
    for (long long i = 0; i < segment.size(); i++) {
        if (segment[i]) {
            result.push_back(low + i);
        }
    }

    return result;
}`
    }
  ];

  // Advanced Mathematical Algorithms
  const advancedMath = [
    {
      id: "fft",
      name: "Fast Fourier Transform (FFT)",
      complexity: { time: "O(n log n)", space: "O(n)" },
      description: "Efficient computation of discrete Fourier transform, used in signal processing and polynomial multiplication.",
      code: `using cd = complex<double>;
const double PI = acos(-1);

void fft(vector<cd>& a, bool invert) {
    int n = a.size();

    // Bit reversal permutation
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n / 2;
        for (; j >= bit; bit /= 2) j -= bit;
        j += bit;
        if (i < j) swap(a[i], a[j]);
    }

    // Cooley-Tukey FFT
    for (int len = 2; len <= n; len <<= 1) {
        double ang = 2 * PI / len * (invert ? -1 : 1);
        cd wlen(cos(ang), sin(ang));

        for (int i = 0; i < n; i += len) {
            cd w(1, 0);
            for (int j = 0; j < len / 2; j++) {
                cd u = a[i + j], v = a[i + j + len / 2] * w;
                a[i + j] = u + v;
                a[i + j + len / 2] = u - v;
                w *= wlen;
            }
        }
    }

    if (invert) {
        for (cd& x : a) x /= n;
    }
}

// Multiply two polynomials using FFT
vector<long long> multiplyPolynomials(vector<long long> a, vector<long long> b) {
    int n = 1;
    while (n < a.size() + b.size()) n <<= 1;

    vector<cd> fa(n), fb(n);
    for (int i = 0; i < a.size(); i++) fa[i] = a[i];
    for (int i = 0; i < b.size(); i++) fb[i] = b[i];

    fft(fa, false);
    fft(fb, false);

    for (int i = 0; i < n; i++) fa[i] *= fb[i];
    fft(fa, true);

    vector<long long> result(n);
    for (int i = 0; i < n; i++) {
        result[i] = round(fa[i].real());
    }

    return result;
}`
    },
    {
      id: "gaussian-elimination",
      name: "Gaussian Elimination",
      complexity: { time: "O(n³)", space: "O(n²)" },
      description: "Solve system of linear equations, find matrix rank, and compute determinants.",
      code: `class GaussianElimination {
private:
    vector<vector<double>> matrix;
    int n, m;

public:
    GaussianElimination(vector<vector<double>> mat) : matrix(mat) {
        n = matrix.size();
        m = matrix[0].size();
    }

    // Forward elimination with partial pivoting
    int forwardElimination() {
        for (int i = 0; i < n; i++) {
            // Find pivot row
            int pivotRow = i;
            for (int j = i + 1; j < n; j++) {
                if (abs(matrix[j][i]) > abs(matrix[pivotRow][i])) {
                    pivotRow = j;
                }
            }

            // Swap rows
            if (pivotRow != i) {
                swap(matrix[i], matrix[pivotRow]);
            }

            // Eliminate below
            for (int j = i + 1; j < n; j++) {
                double factor = matrix[j][i] / matrix[i][i];
                for (int k = i; k < m; k++) {
                    matrix[j][k] -= factor * matrix[i][k];
                }
            }
        }

        return 0; // Success
    }

    // Back substitution
    vector<double> backSubstitution() {
        vector<double> solution(n);

        for (int i = n - 1; i >= 0; i--) {
            solution[i] = matrix[i][m - 1];

            for (int j = i + 1; j < n; j++) {
                solution[i] -= matrix[i][j] * solution[j];
            }

            if (abs(matrix[i][i]) > 1e-10) {
                solution[i] /= matrix[i][i];
            }
        }

        return solution;
    }

    // Solve system Ax = b
    vector<double> solve() {
        forwardElimination();
        return backSubstitution();
    }

    // Compute matrix rank
    int rank() {
        forwardElimination();
        int rank = 0;

        for (int i = 0; i < n; i++) {
            bool nonZero = false;
            for (int j = 0; j < m - 1; j++) { // Exclude augmented column
                if (abs(matrix[i][j]) > 1e-10) {
                    nonZero = true;
                    break;
                }
            }
            if (nonZero) rank++;
        }

        return rank;
    }
};`
    }
  ];

  // Interview Problems
  const interviewProblems = [
    {
      name: "Pow(x, n)",
      difficulty: "Medium",
      description: "Implement pow(x, n) without using library functions",
      hint: "Use binary exponentiation"
    },
    {
      name: "Super Pow",
      difficulty: "Medium",
      description: "Calculate a^b mod 1337 where b is very large",
      hint: "Euler's theorem and Chinese Remainder Theorem"
    },
    {
      name: "Count Primes",
      difficulty: "Easy",
      description: "Count primes less than n",
      hint: "Sieve of Eratosthenes"
    },
    {
      name: "Integer Break",
      difficulty: "Medium",
      description: "Break integer into sum of integers to maximize product",
      hint: "Mathematical analysis of optimal breaking"
    }
  ];

  const renderComplexityBadge = (complexity) => {
    if (!complexity) return null;

    let color = "bg-gray-100 text-gray-800";
    if (complexity.includes("O(log")) color = "bg-blue-100 text-blue-800";
    if (complexity.includes("O(n)") && !complexity.includes("n²")) color = "bg-green-100 text-green-800";
    if (complexity.includes("O(n²)") || complexity.includes("O(n³)")) color = "bg-yellow-100 text-yellow-800";

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
        {complexity}
      </span>
    );
  };

  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Mathematical Algorithms
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master the mathematical foundations of algorithms including number theory, combinatorics, and numerical methods.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-all duration-300 ${activeSection === "overview"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("number-theory")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "number-theory"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Number Theory
            </button>
            <button
              onClick={() => setActiveSection("combinatorics")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "combinatorics"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Combinatorics
            </button>
            <button
              onClick={() => setActiveSection("numerical")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "numerical"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Numerical
            </button>
            <button
              onClick={() => setActiveSection("advanced")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${activeSection === "advanced"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              Advanced
            </button>
          </div>

          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 sm:p-8 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Mathematical Algorithms Overview</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-emerald-400 mb-4">Why Mathematical Algorithms Matter</h3>
                  <p className="text-gray-300 mb-6">
                    Mathematical algorithms form the foundation of computer science. They solve problems
                    involving numbers, counting, optimization, and computational mathematics that appear
                    frequently in coding interviews and real-world applications.
                  </p>

                  <h3 className="text-2xl font-semibold text-emerald-400 mb-4">Key Areas</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">🔢</span>
                      <span><strong>Number Theory:</strong> Primes, GCD, modular arithmetic</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">📊</span>
                      <span><strong>Combinatorics:</strong> Permutations, combinations, counting</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">⚡</span>
                      <span><strong>Efficient Computation:</strong> Fast exponentiation, matrix operations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-400 mr-2">🔬</span>
                      <span><strong>Advanced Math:</strong> FFT, linear algebra, numerical methods</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-emerald-400 mb-4">Common Applications</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Cryptography</h4>
                      <p className="text-gray-300">RSA encryption, modular arithmetic, primality testing</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Competitive Programming</h4>
                      <p className="text-gray-300">Fast computation, combinatorial problems, optimization</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-2">Data Science</h4>
                      <p className="text-gray-300">Statistical computations, matrix operations, signal processing</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-emerald-400 mb-3">Time Complexity</h4>
                  <p className="text-gray-300">Often O(log n) or O(n)</p>
                  <p className="text-sm text-gray-400 mt-2">Some advanced algorithms: O(n log n)</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">Space Complexity</h4>
                  <p className="text-gray-300">Usually O(1) or O(n)</p>
                  <p className="text-sm text-gray-400 mt-2">Matrices may require O(n²)</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50 p-6 rounded-xl">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">Key Techniques</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Modular arithmetic</li>
                    <li>• Matrix operations</li>
                    <li>• Bit manipulation</li>
                    <li>• Number properties</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Number Theory Section */}
          {activeSection === "number-theory" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Number Theory Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {numberTheory.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(algorithm.complexity).map(([key, value]) => (
                            <span key={key}>
                              {renderComplexityBadge(`${key.toUpperCase()}: ${value}`)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{algorithm.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{algorithm.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Combinatorics Section */}
          {activeSection === "combinatorics" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Combinatorics Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {combinatorics.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-teal-500 hover:shadow-2xl hover:shadow-teal-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(algorithm.complexity).map(([key, value]) => (
                            <span key={key}>
                              {renderComplexityBadge(`${key.toUpperCase()}: ${value}`)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{algorithm.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{algorithm.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Numerical Algorithms Section */}
          {activeSection === "numerical" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Numerical Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {numericalAlgorithms.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(algorithm.complexity).map(([key, value]) => (
                            <span key={key}>
                              {renderComplexityBadge(`${key.toUpperCase()}: ${value}`)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{algorithm.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{algorithm.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Algorithms Section */}
          {activeSection === "advanced" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Advanced Mathematical Algorithms</h2>

              <div className="grid grid-cols-1 gap-8">
                {advancedMath.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/20"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{algorithm.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(algorithm.complexity).map(([key, value]) => (
                            <span key={key}>
                              {renderComplexityBadge(`${key.toUpperCase()}: ${value}`)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">{algorithm.description}</p>

                      <div className="bg-gray-700/50 p-4 rounded-xl">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">C++ Implementation</h4>
                        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{algorithm.code}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practice Problems Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Practice Problems & Interview Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-green-400 mb-3">🟢 Easy Math Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Happy Number</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Add Digits (digital root)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Excel Sheet Column Number</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>Factorial Trailing Zeroes</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">🟡 Medium Math Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Divide Two Integers (without division)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Fraction to Recurring Decimal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Sqrt(x) (binary search)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Max Points on a Line</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Evaluate Reverse Polish Notation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                <h3 className="text-xl font-semibold text-red-400 mb-3">🔴 Hard Math Problems</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Median of Two Sorted Arrays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Maximum Gap (bucket sort)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Count of Smaller Numbers After Self</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>The Skyline Problem</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>Basic Calculator III</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interview Questions */}
            <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Interview Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewProblems.map((problem, idx) => (
                  <div key={idx} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-cyan-400 font-semibold">{problem.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${problem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-300' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-red-900/50 text-red-300'
                        }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{problem.description}</p>
                    <p className="text-xs text-gray-400 italic">{problem.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mathematical Algorithms Cheat Sheet */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 p-8 transition-all duration-500 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Mathematical Algorithms Cheat Sheet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">Key Formulas & Identities</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">GCD(a,b) × LCM(a,b):</span>
                    <span className="text-green-400 font-mono">= a × b</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Euler's Totient:</span>
                    <span className="text-blue-400 font-mono">φ(n) = n × ∏(1 - 1/p)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Fermat's Little:</span>
                    <span className="text-purple-400 font-mono">a^(p-1) ≡ 1 (mod p)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Chinese Remainder:</span>
                    <span className="text-cyan-400 font-mono">Solve x ≡ a_i (mod m_i)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">Complexity Classes</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Primality Testing:</div>
                    <div className="text-gray-400">Trial: O(√n), Miller-Rabin: O(k × log³n)</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Exponentiation:</div>
                    <div className="text-gray-400">Binary: O(log exp), Matrix: O(log n)</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">FFT:</div>
                    <div className="text-gray-400">O(n log n) for polynomial multiplication</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded">
                    <div className="text-cyan-400 font-medium mb-1">Gaussian Elimination:</div>
                    <div className="text-gray-400">O(n³) for linear systems</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MathematicalAlgorithms;

