# Sorting Algorithms — Complete Guide

> A comprehensive, single-page reference for *all* standard sorting algorithms: theory, step-by-step explanations, complexity, C++ implementations, example walkthroughs, interview questions, edge-cases, variations, and practice problems.

---

## Table of Contents

1. Quick overview & classification
2. Fundamental concepts (stability, in-place, comparison-based)
3. Bubble Sort
4. Selection Sort
5. Insertion Sort
6. Merge Sort (all variants)
7. Quick Sort (all variants)
8. Heap Sort
9. Counting Sort
10. Radix Sort
11. Bucket Sort
12. Shell Sort
13. Tim Sort (hybrid approach)
14. Cycle Sort
15. Pancake Sort
16. Bogo Sort (for completeness)
17. External sorting (brief)
18. Sorting networks (brief)
19. Common interview patterns & typical questions
20. Full C++ code collection (ready-to-run)
21. Demo walkthroughs (sample inputs + step traces)
22. Optimizations & trick questions
23. Cheat-sheet (table summary)
24. Practice problems (categorized) + sample solutions/hints

---

## 1) Quick overview & classification

**Sorting** = arranging elements in a specific order (ascending/descending) based on comparison or key values.

Important axes:

* **Comparison-based vs Non-comparison**: Comparison-based has O(n log n) lower bound; non-comparison can be linear
* **Stability**: Stable sorts preserve relative order of equal elements
* **In-place**: Uses O(1) extra space vs O(n) auxiliary space
* **Adaptive**: Performance improves on partially sorted data
* **Online**: Can sort data as it arrives

High level categories:

* **Simple O(n²) sorts**: Bubble, Selection, Insertion
* **Efficient O(n log n) sorts**: Merge, Quick, Heap
* **Linear time sorts**: Counting, Radix, Bucket (for specific data)
* **Hybrid sorts**: Tim Sort, Intro Sort (real-world implementations)

---

## 2) Fundamental concepts

* **Comparison model lower bound:** Any comparison-based sorting algorithm requires Ω(n log n) comparisons in worst case
* **Stability**: Stable sorts maintain relative order of equal keys. Important for multi-key sorting
* **In-place**: Algorithm uses O(1) extra space (excluding input array)
* **Adaptive**: Algorithm performs better on partially sorted input
* **Internal vs External**: Internal sorting fits in memory; external sorting handles data larger than memory

**Key properties to remember:**
- Stable + In-place + O(n log n): No such algorithm exists!
- Best practical sorts are either stable OR in-place, not both

---

## 3) Bubble Sort

**Idea:** Repeatedly step through list, compare adjacent elements, swap if wrong order.

**Complexities:**
* Best: O(n) - when array is already sorted
* Average: O(n²)
* Worst: O(n²)
* Space: O(1)
* Stable: Yes
* In-place: Yes
* Adaptive: Yes (with optimization)

**Pseudocode:**
```
for i from 0 to n-2:
  for j from 0 to n-2-i:
    if arr[j] > arr[j+1]: swap(arr[j], arr[j+1])
```

**C++ Implementation:**
```cpp
void bubble_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        bool swapped = false;
        for (int j = 0; j < n-1-i; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
                swapped = true;
            }
        }
        if (!swapped) break; // Optimization: early termination
    }
}
```

**When to use:** Educational purposes, very small datasets, nearly sorted data.
**Interview notes:** Always mention the optimization for early termination.

---

## 4) Selection Sort

**Idea:** Find minimum element and place it at beginning, repeat for remaining array.

**Complexities:**
* Best: O(n²)
* Average: O(n²)
* Worst: O(n²)
* Space: O(1)
* Stable: No (can be made stable with extra space)
* In-place: Yes
* Adaptive: No

**C++ Implementation:**
```cpp
void selection_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx != i) {
            swap(arr[i], arr[min_idx]);
        }
    }
}
```

**Key insight:** Makes exactly n-1 swaps, useful when swap cost is high.
**Variants:** Can be made stable by shifting instead of swapping.

---## 
5) Insertion Sort

**Idea:** Build sorted array one element at a time by inserting each element into its correct position.

**Complexities:**
* Best: O(n) - when array is already sorted
* Average: O(n²)
* Worst: O(n²) - when array is reverse sorted
* Space: O(1)
* Stable: Yes
* In-place: Yes
* Adaptive: Yes

**C++ Implementation:**
```cpp
void insertion_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

**Variants:**
- **Binary Insertion Sort**: Use binary search to find insertion position (reduces comparisons but not shifts)
- **Shell Sort**: Generalization using gap sequences

**When to use:** Small arrays (< 50 elements), nearly sorted data, online algorithms.

---

## 6) Merge Sort (All Variants)

**Idea:** Divide array into halves, recursively sort both halves, then merge sorted halves.

**Complexities:**
* Best: O(n log n)
* Average: O(n log n)
* Worst: O(n log n)
* Space: O(n) - for auxiliary array
* Stable: Yes
* In-place: No (standard version)
* Adaptive: No (standard version)

**Standard Recursive Implementation:**
```cpp
void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;
    
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }
    
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    for (i = left, k = 0; i <= right; i++, k++) {
        arr[i] = temp[k];
    }
}

void merge_sort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        merge_sort(arr, left, mid);
        merge_sort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}
```

**Variants:**

1. **Bottom-up Merge Sort** (Iterative):
```cpp
void merge_sort_iterative(vector<int>& arr) {
    int n = arr.size();
    for (int size = 1; size < n; size *= 2) {
        for (int left = 0; left < n - size; left += 2 * size) {
            int mid = left + size - 1;
            int right = min(left + 2 * size - 1, n - 1);
            merge(arr, left, mid, right);
        }
    }
}
```

2. **In-place Merge Sort** (Complex, O(n log² n)):
Uses rotation-based merging to achieve O(1) space.

3. **3-way Merge Sort**:
Divides array into 3 parts instead of 2.

**When to use:** When stability is required, guaranteed O(n log n), external sorting.

---

## 7) Quick Sort (All Variants)

**Idea:** Choose pivot, partition array around pivot, recursively sort subarrays.

**Complexities:**
* Best: O(n log n) - balanced partitions
* Average: O(n log n)
* Worst: O(n²) - poor pivot choices
* Space: O(log n) - recursion stack
* Stable: No (standard version)
* In-place: Yes
* Adaptive: No (standard version)

**Standard Implementation (Lomuto Partition):**
```cpp
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high]; // Choose last element as pivot
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quick_sort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quick_sort(arr, low, pi - 1);
        quick_sort(arr, pi + 1, high);
    }
}
```

**Hoare Partition Scheme:**
```cpp
int hoare_partition(vector<int>& arr, int low, int high) {
    int pivot = arr[low];
    int i = low - 1, j = high + 1;
    
    while (true) {
        do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);
        
        if (i >= j) return j;
        swap(arr[i], arr[j]);
    }
}
```

**Variants:**

1. **Randomized Quick Sort**:
```cpp
int randomized_partition(vector<int>& arr, int low, int high) {
    int random = low + rand() % (high - low + 1);
    swap(arr[random], arr[high]);
    return partition(arr, low, high);
}
```

2. **3-Way Quick Sort (Dutch National Flag)**:
```cpp
void quick_sort_3way(vector<int>& arr, int low, int high) {
    if (low >= high) return;
    
    int lt = low, gt = high;
    int pivot = arr[low];
    int i = low + 1;
    
    while (i <= gt) {
        if (arr[i] < pivot) {
            swap(arr[lt++], arr[i++]);
        } else if (arr[i] > pivot) {
            swap(arr[i], arr[gt--]);
        } else {
            i++;
        }
    }
    
    quick_sort_3way(arr, low, lt - 1);
    quick_sort_3way(arr, gt + 1, high);
}
```

3. **Iterative Quick Sort**:
Uses explicit stack instead of recursion.

**Pivot Selection Strategies:**
- First/Last element (simple but can be worst-case)
- Random element (expected O(n log n))
- Median-of-three (first, middle, last)
- Median-of-medians (guaranteed O(n log n) but high constant)

**When to use:** General-purpose sorting, when average-case performance matters, in-place sorting needed.

---

## 8) Heap Sort

**Idea:** Build max heap, repeatedly extract maximum and place at end.

**Complexities:**
* Best: O(n log n)
* Average: O(n log n)
* Worst: O(n log n)
* Space: O(1)
* Stable: No
* In-place: Yes
* Adaptive: No

**Implementation:**
```cpp
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heap_sort(vector<int>& arr) {
    int n = arr.size();
    
    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}
```

**Key insights:**
- Building heap takes O(n) time, not O(n log n)
- Not cache-friendly due to random memory access
- Guaranteed O(n log n) performance

**When to use:** When guaranteed O(n log n) and O(1) space is needed, real-time systems.

---## 9) C
ounting Sort

**Idea:** Count occurrences of each element, then reconstruct sorted array.

**Complexities:**
* Best: O(n + k) where k is range of input
* Average: 
---EEPROM).
mory, h mel (flas is criticaoperationsng write en minimizise:** Whhen to u
**W
```
n writes;
}tur    re  }
    
         }
 }
        ;
    s++write         ;
       pos])item, arr[ap(      sw        [pos]) {
  != arrem    if (it   
               pos++;
   [pos])  == arrile (itemwh      
          
                }
    tem) pos++;r[i] < if (ar     i        
   +) {n; i+<  1; i tart += cycle_snt i (i       for 
           ;
       cycle_start pos =          tart) {
 != cycle_sos (p     while 
   cyclef ate rest oRot    //   
      }
            ites++;
  wr     
      arr[pos]); swap(item,            {
rt) cycle_sta(pos !=    if ion
     positrrecte item at co  // Plac        
   pos++;
   = arr[pos])  = (itemwhile
        atesplic  // Skip du           
nue;
   tie_start) conos == cycl       if (p  
  }
           pos++;
   tem)(arr[i] < i     if      {
   n; i++) i < + 1;  cycle_start i =for (int    o
    m should gre itewheion ind posit      // F       
  tart;
 _spos = cycle       int tart];
 arr[cycle_s int item = 
       rt++) {cle_sta cyrt < n - 1;ycle_sta = 0; ctartt cycle_sr (in
    fo
    ();= arr.sizeint n 
    ites = 0;   int wr {
  arr)int>&vector<t(cle_sor
int cypcpn:**
```plementatio
**Im.
xpensive es aree operationhen writemory or wr flash m fos - usefulwriteory  mem** Minimizesre:*Key featue: No

* AdaptivYes
*: ace* In-plStable: No

* Space: O(1)²)
* rst: O(n
* Wo(n²) O
* Average:: O(n²) Best:**
*mplexitiesn.

**Coiol positto its finairectly  dementng each elaciby plf writes umber oes nmiz* Mini:*
**Ideale Sort

## 14) Cycl.

---
 cruciativeness areity and adapn stabilations, whed applicworluse:** Real-en to Wh```

**
}

    }   }    }
           
  d, end); mit,r, starerge(ar m      
          end) {if (mid <                     
n - 1);
   ,  2 - 1+ size *rt (sta = min     int end       1;
e -  + sizd = start    int mi {
        2)* ize  start += s< n;rt  0; sta = startfor (int
        = 2) { *; size < nn_run; sizet size = mir (in  fo
  g runsgin merStart  //     
  
nd);
    } err, i,range(aon_sort_ti      inser
  , n - 1); - 1min_runn(i +  = mindnt e  i   
   in_run) {n; i += m= 0; i <  for (int i   tion sort
 ng insern_run usi size mil runs ofndividua   // Sort i   
 e
  sizunum rnim 32; // Mimin_run =    int );
rr.size(t n = a  in arr) {
  r<int>&_sort(vectooid tim```cpp
v**
ept:n Conctatioplemenmplified ImYes

**Si* Adaptive: No
ace: 
* In-plsStable: Ye(n)
* pace: Og n)
* SO(n loorst:  log n)
* Wverage: O(n Aed data
*already sort(n) - for *
* Best: Oes:*xiti*Comple
*d data
ucturetrly s highmode forng  Gallopier runs
-rgt for lage sor mer
- Usesl runsor smalrt frtion sonsees i Usces)
-enqud subse(sorteting runs xises entifi:**
- Ideeatures
**Key Fnd Java.
in Python a sort, used oninsertind  asortng merge mbinialgorithm corting e sotablid sbrHy** a:**Idepproach)

brid A (Hyort# 13) Tim S
#.

---
ed systemsembedd is needed, ationplement simple imarrays, whendium-sized e:** Me**When to us 3, 1

5, 7,, 1 1: ... 2^k -*:equence*s sibbard'. **H) + 1
4 + 3×2^(k-14^ksequence**: ewick's dg**Se, 1
3. 0, 13, 4., 121, 42: ..^k - 1)/ence**: (3Knuth's sequ. **, 1
2n/8, ... n/2, n/4, equence**:'s sShell
1. **Sequences:**r Gap opula
**P
  }
}
```    }
  mp;
    arr[j] = te                 }
      - gap];
  rr[jj] = a      arr[
          ap) {j -= gap] > temp;  gj -ap && arr[ j >= g = i;    for (j
                
     j;nt          i[i];
  arr int temp =       ) {
      n; i++ gap; i <int i = for (ort
       tion sped inser gapormerf/ P  /
      p /= 2) {gaap > 0;  / 2; g(int gap = nce
    for due gap and rewith larg // Start 
    
   .size();t n = arr{
    in& arr) (vector<int>rtell_sosh
void ```cpp*
ence:*qu seinals origwith Shell'ementation mpl
**Itive: Yes
Adapce: Yes
* In-plae: No
* 1)
* Stabl* Space: O(ces
uenrst gap seqor wo²) fO(n* Worst: 
uenceoriginal seqr Shell's ^(3/2)) foe: O(nraguence
* Aveap seqdepends on gg n) - (n loBest: O*
* mplexities:*Coirst.

**ar apart f fntselemesort equences to gap sing tion sort usnserf iralization oIdea:** Gene
**Sort
ell ## 12) Sh.

---

s neededr time iase linean average-cwhet numbers, ting-poindata, floastributed ormly di:** Unifen to use
**Wh``
   }
}
`
 };
        x++] = num    arr[id      ) {
  bucketnum :  (int   for      ;
cket.end())bugin(), bucket.be sort() {
       : bucketsket (auto& buc
    for idx = 0;nt ate
    ioncatents and c/ Sort bucke   
    /
 
    });sh_back(numt_idx].puts[bucke    bucke   ;
 geanval) / r (num - min_count - 1) *(bucket_ucket_idx =     int barr) {
    : (int num or 
    fe elementsistribut
    // D
    unt);s(bucket_coet> buckr<int>toor<vec
    vect  val + 1;
  x_val - min_ range = ma intze();
   rr.siount = aket_c   int buc());
 .endarrrr.begin(), ment(a = *min_elemin_val
    int .end());egin(), arrt(arr.beneleml = *max_va int max_  
   
  urn;) retarr.empty(){
    if (<int>& arr) int(vectorsort_ucket_`cpp
void bgers):**
``or inte (fcket SortGeneric Bu
```

**
}   }
      }   ] = num;
dx++[iarr            ) {
bucketfloat num : r (
        fos) {ucket& bucket : bonst auto  for (c  x = 0;
 ids
    intenate bucketcat
    // Con    

    }t.end());), buckebegin(t(bucket.  sor     ets) {
 ucket : buck (auto& b    foral buckets
iduort indiv
    // S  }
    ;
  ck(num)sh_bat_idx].puuckets[bucke       b
 t in [0, 1) inpu // Assumes num;x = n *et_idcknt bu      i: arr) {
   (float num ors
    finto buckette elements istribu/ D    /
);
    s(n bucket<float>>or<vector
    vectate buckets
    // Cre    eturn;
n <= 1) r
    if (r.size();n = ar  int r) {
  oat>& arflsort(vector<t_void bucke*
```cpp
 [0,1)):*ted data in distribu uniformlyntation (foremehm

**Implg algoritket sortin buc onive: Depends No
* Adapte:
* In-placis stable)lying sort  (if underYes* Stable: 
 k)O(n +* Space: ket
o to one bucts glemenen all e wh O(n²) -t:* Worsn
≈ n k  O(n) whek) ≈k + + n²/(n age: O
* Averucketser of b numb) where k isest: O(n + k**
* Bplexities:**Comenate.

then concat bucket, t eachs, soro buckets intelementDistribute ea:** Idt Sort

**# 11) Bucke
---

#ed.
ime is need tinearen lings, whrs/strh integeixed-widtith fs wge datasete:** Larto ushen on

**Wplementatiomplex im
- More cgsth strinriable-leng vaan handle- Cant digit
ost significts from m, sorchive approaecurs:**
- R Sortt) Radixficant Digi Signi (Most`

**MSD   }
}
``;
 rr, exp)_for_radix(artunting_so
        co) {10 exp *= > 0;val / exp 1; max_exp = for (int digit
     by each rt 
    // Soend());
   (), arr.eginnt(arr.b= *max_eleme_val 
    int maxrn;
    y()) retuptr.emf (ar   i
 r) {t>& arctor<int(ve_sor
void radix  }
}
;
  [i]= outputi]         arr[); i++) {
size( 0; i < arr.r (int i =back
    fo   // Copy 
    
 
    }-;]-xp) % 10 / et[(arr[i] coun
       rr[i];= a] - 1] exp) % 10r[i] / ount[(ar    output[c   --) {
 ; i- 1; i >= 0rr.size() t i = a (infor  ut array
  tpuild ou/ B 
    /  
    }
 t[i - 1]; += count[i]    coun
    i++) {< 10;  = 1; i for (int iount
    umulative c
    // C
    }
    p) % 10]++;um / excount[(n         arr) {
(int num :t
    for each digiof es t occurrenc
    // Coun
    0);nt(10, r<int> cou    vector.size());
t(arpuoutnt> vector<iexp) {
    arr, int tor<int>& ecix(vor_rad_sort_f counting
void`cpption:**
``ementaplt Digit) ImanignificLeast S

**LSD (: NoaptiveAdNo
* -place: : Yes
* In* Stable(n + k)
: O* Space
 k)) × (n +O(d)
* Worst: + k) O(d × (n 
* Average:gitf di ois ranges, k  digits number of ire d whe × (n + k))* Best: O(d**
mplexities:
**Co.
cant digitsignifieast m l fro, startingers/charactdigits individual rt byIdea:** So

**Radix Sort

## 10) 
---.
arge rangesfor le ivit be prohibexity cancomplers, space th integ works wis:** Onlyionimitat**L.
s crucialr time iwhen lineantegers,  ill range ofmao use:** S
**When t
}
```
  }  ut[i];
= outpi]        arr[); i++) {
 < arr.size( i nt i = 0;
    for (ial arraygin ori topy back// Co   
    
    }
 -;in_val]- mnt[arr[i] -       coui];
 arr[1] = l] - _vaarr[i] - minnt[ut[cou        outp
0; i--) {) - 1; i >= ize(arr.snt i = for (i
    lity)or stabiackwards ftraverse b (put arrayBuild out   //     
    }

 t[i - 1];oun] += c     count[i i++) {
   e; rang 1; i <nt i =
    for (iity)stabilt (for ounve catimulCu
    //    }
    
  min_val]++;num -count[
        r) { arum :t nin
    for (cesrrenccu Count o   
    //e());
 put(arr.sizouttor<int>     vecge, 0);
 count(ranector<int>  
    v1;
  l + val - min_va= max_ange    int rnd());
  arr.earr.begin(),n_element(= *mil va  int min_.end());
  rr(), ainarr.begment(_eleval = *maxt max_in       

 return;)) mpty( (arr.e    ifarr) {
& <int>sort(vector counting_
voidcpp**
```ntation:*Impleme
*ve: No
apti
* Ad: Non-place* Ible: Yes
 Sta)
*O(ke:  k)
* Spacst: O(n + + k)
* WorO(n* 
**Efficient O(n log n) sorts**: Merge, Quick, Heap
* **Linear time sorts**: Counting, Radix, Bucket (for specific data)
* **Hybrid sorts**: Tim Sort, Intro Sort (real-world implementations)

---

## 2) Fundamental concepts

* **Comparison model lower bound:** Any comparison-based sorting algorithm requires Ω(n log n) comparisons in worst case
* **Stability**: Stable sorts maintain relative order of equal keys. Important for multi-key sorting
* **In-place**: Algorithm uses O(1) extra space (excluding input array)
* **Adaptive**: Algorithm performs better on partially sorted input
* **Internal vs External**: Internal sorting fits in memory; external sorting handles data larger than memory

**Key properties to remember:**
- Stable + In-place + O(n log n): No such algorithm exists!
- Best practical sorts are either stable OR in-place, not both

---

## 3) Bubble Sort

**Idea:** Repeatedly step through list, compare adjacent elements, swap if wrong order.

**Complexities:**
* Best: O(n) - when array is already sorted
* Average: O(n²)
* Worst: O(n²)
* Space: O(1)
* Stable: Yes
* In-place: Yes
* Adaptive: Yes (with optimization)

**Pseudocode:**
```
for i from 0 to n-2:
  for j from 0 to n-2-i:
    if arr[j] > arr[j+1]: swap(arr[j], arr[j+1])
```

**C++ Implementation:**
```cpp
void bubble_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        bool swapped = false;
        for (int j = 0; j < n-1-i; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
                swapped = true;
            }
        }
        if (!swapped) break; // Optimization: early termination
    }
}
```

**When to use:** Educational purposes, very small datasets, nearly sorted data.
**Interview notes:** Always mention the optimization for early termination.

---## 4) 
Selection Sort

**Idea:** Find minimum element and place it at beginning, repeat for remaining array.

**Complexities:**
* Best: O(n²)
* Average: O(n²)
* Worst: O(n²)
* Space: O(1)
* Stable: No (can be made stable with extra space)
* In-place: Yes
* Adaptive: No

**C++ Implementation:**
```cpp
void selection_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx != i) {
            swap(arr[i], arr[min_idx]);
        }
    }
}
```

**Key insight:** Makes exactly n-1 swaps, useful when swap cost is high.
**Variants:** Can be made stable by shifting instead of swapping.

---

## 5) Insertion Sort

**Idea:** Build sorted array one element at a time by inserting each element into its correct position.

**Complexities:**
* Best: O(n) - when array is already sorted
* Average: O(n²)
* Worst: O(n²) - when array is reverse sorted
* Space: O(1)
* Stable: Yes
* In-place: Yes
* Adaptive: Yes

**C++ Implementation:**
```cpp
void insertion_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

**Variants:**
- **Binary Insertion Sort**: Use binary search to find insertion position (reduces comparisons but not shifts)
- **Shell Sort**: Generalization using gap sequences

**When to use:** Small arrays (< 50 elements), nearly sorted data, online algorithms.

---#
# 6) Merge Sort (All Variants)

**Idea:** Divide array into halves, recursively sort both halves, then merge sorted halves.

**Complexities:**
* Best: O(n log n)
* Average: O(n log n)
* Worst: O(n log n)
* Space: O(n) - for auxiliary array
* Stable: Yes
* In-place: No (standard version)
* Adaptive: No (standard version)

**Standard Recursive Implementation:**
```cpp
void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;
    
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }
    
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    for (i = left, k = 0; i <= right; i++, k++) {
        arr[i] = temp[k];
    }
}

void merge_sort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        merge_sort(arr, left, mid);
        merge_sort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}
```

**Variants:**

1. **Bottom-up Merge Sort** (Iterative):
```cpp
void merge_sort_iterative(vector<int>& arr) {
    int n = arr.size();
    for (int size = 1; size < n; size *= 2) {
        for (int left = 0; left < n - size; left += 2 * size) {
            int mid = left + size - 1;
            int right = min(left + 2 * size - 1, n - 1);
            merge(arr, left, mid, right);
        }
    }
}
```

2. **In-place Merge Sort** (Complex, O(n log² n)):
Uses rotation-based merging to achieve O(1) space.

3. **3-way Merge Sort**:
Divides array into 3 parts instead of 2.

**When to use:** When stability is required, guaranteed O(n log n), external sorting.

---## 7) 
Quick Sort (All Variants)

**Idea:** Choose pivot, partition array around pivot, recursively sort subarrays.

**Complexities:**
* Best: O(n log n) - balanced partitions
* Average: O(n log n)
* Worst: O(n²) - poor pivot choices
* Space: O(log n) - recursion stack
* Stable: No (standard version)
* In-place: Yes
* Adaptive: No (standard version)

**Standard Implementation (Lomuto Partition):**
```cpp
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high]; // Choose last element as pivot
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quick_sort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quick_sort(arr, low, pi - 1);
        quick_sort(arr, pi + 1, high);
    }
}
```

**Hoare Partition Scheme:**
```cpp
int hoare_partition(vector<int>& arr, int low, int high) {
    int pivot = arr[low];
    int i = low - 1, j = high + 1;
    
    while (true) {
        do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);
        
        if (i >= j) return j;
        swap(arr[i], arr[j]);
    }
}
```

**Variants:**

1. **Randomized Quick Sort**:
```cpp
int randomized_partition(vector<int>& arr, int low, int high) {
    int random = low + rand() % (high - low + 1);
    swap(arr[random], arr[high]);
    return partition(arr, low, high);
}
```

2. **3-Way Quick Sort (Dutch National Flag)**:
```cpp
void quick_sort_3way(vector<int>& arr, int low, int high) {
    if (low >= high) return;
    
    int lt = low, gt = high;
    int pivot = arr[low];
    int i = low + 1;
    
    while (i <= gt) {
        if (arr[i] < pivot) {
            swap(arr[lt++], arr[i++]);
        } else if (arr[i] > pivot) {
            swap(arr[i], arr[gt--]);
        } else {
            i++;
        }
    }
    
    quick_sort_3way(arr, low, lt - 1);
    quick_sort_3way(arr, gt + 1, high);
}
```

**Pivot Selection Strategies:**
- First/Last element (simple but can be worst-case)
- Random element (expected O(n log n))
- Median-of-three (first, middle, last)
- Median-of-medians (guaranteed O(n log n) but high constant)

**When to use:** General-purpose sorting, when average-case performance matters, in-place sorting needed.

---##
 8) Heap Sort

**Idea:** Build max heap, repeatedly extract maximum and place at end.

**Complexities:**
* Best: O(n log n)
* Average: O(n log n)
* Worst: O(n log n)
* Space: O(1)
* Stable: No
* In-place: Yes
* Adaptive: No

**Implementation:**
```cpp
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heap_sort(vector<int>& arr) {
    int n = arr.size();
    
    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}
```

**Key insights:**
- Building heap takes O(n) time, not O(n log n)
- Not cache-friendly due to random memory access
- Guaranteed O(n log n) performance

**When to use:** When guaranteed O(n log n) and O(1) space is needed, real-time systems.

---

## 9) Counting Sort

**Idea:** Count occurrences of each element, then reconstruct sorted array.

**Complexities:**
* Best: O(n + k) where k is range of input
* Average: O(n + k)
* Worst: O(n + k)
* Space: O(k)
* Stable: Yes
* In-place: No
* Adaptive: No

**Implementation:**
```cpp
void counting_sort(vector<int>& arr) {
    if (arr.empty()) return;
    
    int max_val = *max_element(arr.begin(), arr.end());
    int min_val = *min_element(arr.begin(), arr.end());
    int range = max_val - min_val + 1;
    
    vector<int> count(range, 0);
    vector<int> output(arr.size());
    
    // Count occurrences
    for (int num : arr) {
        count[num - min_val]++;
    }
    
    // Cumulative count (for stability)
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    
    // Build output array (traverse backwards for stability)
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i] - min_val] - 1] = arr[i];
        count[arr[i] - min_val]--;
    }
    
    // Copy back to original array
    for (int i = 0; i < arr.size(); i++) {
        arr[i] = output[i];
    }
}
```

**When to use:** Small range of integers, when linear time is crucial.
**Limitations:** Only works with integers, space complexity can be prohibitive for large ranges.

---## 
10) Radix Sort

**Idea:** Sort by individual digits/characters, starting from least significant digit.

**Complexities:**
* Best: O(d × (n + k)) where d is number of digits, k is range of digit
* Average: O(d × (n + k))
* Worst: O(d × (n + k))
* Space: O(n + k)
* Stable: Yes
* In-place: No
* Adaptive: No

**LSD (Least Significant Digit) Implementation:**
```cpp
void counting_sort_for_radix(vector<int>& arr, int exp) {
    vector<int> output(arr.size());
    vector<int> count(10, 0);
    
    // Count occurrences of each digit
    for (int num : arr) {
        count[(num / exp) % 10]++;
    }
    
    // Cumulative count
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // Build output array
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    // Copy back
    for (int i = 0; i < arr.size(); i++) {
        arr[i] = output[i];
    }
}

void radix_sort(vector<int>& arr) {
    if (arr.empty()) return;
    
    int max_val = *max_element(arr.begin(), arr.end());
    
    // Sort by each digit
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
        counting_sort_for_radix(arr, exp);
    }
}
```

**MSD (Most Significant Digit) Radix Sort:**
- Recursive approach, sorts from most significant digit
- Can handle variable-length strings
- More complex implementation

**When to use:** Large datasets with fixed-width integers/strings, when linear time is needed.

---

## 11) Bucket Sort

**Idea:** Distribute elements into buckets, sort each bucket, then concatenate.

**Complexities:**
* Best: O(n + k) where k is number of buckets
* Average: O(n + n²/k + k) ≈ O(n) when k ≈ n
* Worst: O(n²) - when all elements go to one bucket
* Space: O(n + k)
* Stable: Yes (if underlying sort is stable)
* In-place: No
* Adaptive: Depends on bucket sorting algorithm

**Implementation (for uniformly distributed data in [0,1)):**
```cpp
void bucket_sort(vector<float>& arr) {
    int n = arr.size();
    if (n <= 1) return;
    
    // Create buckets
    vector<vector<float>> buckets(n);
    
    // Distribute elements into buckets
    for (float num : arr) {
        int bucket_idx = n * num; // Assumes input in [0, 1)
        buckets[bucket_idx].push_back(num);
    }
    
    // Sort individual buckets
    for (auto& bucket : buckets) {
        sort(bucket.begin(), bucket.end());
    }
    
    // Concatenate buckets
    int idx = 0;
    for (const auto& bucket : buckets) {
        for (float num : bucket) {
            arr[idx++] = num;
        }
    }
}
```

**When to use:** Uniformly distributed data, floating-point numbers, when average-case linear time is needed.

---##
 12) Shell Sort

**Idea:** Generalization of insertion sort using gap sequences to sort elements far apart first.

**Complexities:**
* Best: O(n log n) - depends on gap sequence
* Average: O(n^(3/2)) for Shell's original sequence
* Worst: O(n²) for worst gap sequences
* Space: O(1)
* Stable: No
* In-place: Yes
* Adaptive: Yes

**Implementation with Shell's original sequence:**
```cpp
void shell_sort(vector<int>& arr) {
    int n = arr.size();
    
    // Start with large gap and reduce
    for (int gap = n / 2; gap > 0; gap /= 2) {
        // Perform gapped insertion sort
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j;
            
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
}
```

**Popular Gap Sequences:**
1. **Shell's sequence**: n/2, n/4, n/8, ..., 1
2. **Knuth's sequence**: (3^k - 1)/2: ..., 121, 40, 13, 4, 1
3. **Sedgewick's sequence**: 4^k + 3×2^(k-1) + 1
4. **Hibbard's sequence**: 2^k - 1: ..., 15, 7, 3, 1

**When to use:** Medium-sized arrays, when simple implementation is needed, embedded systems.

---

## 13) Tim Sort (Hybrid Approach)

**Idea:** Hybrid stable sorting algorithm combining merge sort and insertion sort, used in Python and Java.

**Key Features:**
- Identifies existing runs (sorted subsequences)
- Uses insertion sort for small runs
- Uses merge sort for larger runs
- Galloping mode for highly structured data

**Complexities:**
* Best: O(n) - for already sorted data
* Average: O(n log n)
* Worst: O(n log n)
* Space: O(n)
* Stable: Yes
* In-place: No
* Adaptive: Yes

**Simplified Implementation Concept:**
```cpp
void tim_sort(vector<int>& arr) {
    int n = arr.size();
    int min_run = 32; // Minimum run size
    
    // Sort individual runs of size min_run using insertion sort
    for (int i = 0; i < n; i += min_run) {
        int end = min(i + min_run - 1, n - 1);
        insertion_sort_range(arr, i, end);
    }
    
    // Start merging runs
    for (int size = min_run; size < n; size *= 2) {
        for (int start = 0; start < n; start += size * 2) {
            int mid = start + size - 1;
            int end = min(start + size * 2 - 1, n - 1);
            
            if (mid < end) {
                merge(arr, start, mid, end);
            }
        }
    }
}
```

**When to use:** Real-world applications, when stability and adaptiveness are crucial.

---#
# 14) Cycle Sort

**Idea:** Minimizes number of writes by placing each element directly to its final position.

**Complexities:**
* Best: O(n²)
* Average: O(n²)
* Worst: O(n²)
* Space: O(1)
* Stable: No
* In-place: Yes
* Adaptive: No

**Key feature:** Minimizes memory writes - useful for flash memory or when write operations are expensive.

**Implementation:**
```cpp
int cycle_sort(vector<int>& arr) {
    int writes = 0;
    int n = arr.size();
    
    for (int cycle_start = 0; cycle_start < n - 1; cycle_start++) {
        int item = arr[cycle_start];
        int pos = cycle_start;
        
        // Find position where item should go
        for (int i = cycle_start + 1; i < n; i++) {
            if (arr[i] < item) pos++;
        }
        
        if (pos == cycle_start) continue;
        
        // Skip duplicates
        while (item == arr[pos]) pos++;
        
        // Place item at correct position
        if (pos != cycle_start) {
            swap(item, arr[pos]);
            writes++;
        }
        
        // Rotate rest of cycle
        while (pos != cycle_start) {
            pos = cycle_start;
            
            for (int i = cycle_start + 1; i < n; i++) {
                if (arr[i] < item) pos++;
            }
            
            while (item == arr[pos]) pos++;
            
            if (item != arr[pos]) {
                swap(item, arr[pos]);
                writes++;
            }
        }
    }
    
    return writes;
}
```

**When to use:** When minimizing write operations is critical (flash memory, EEPROM).

---

## 15) Pancake Sort

**Idea:** Sort by flipping prefixes of the array (like flipping pancakes).

**Complexities:**
* Best: O(n)
* Average: O(n²)
* Worst: O(n²)
* Space: O(1)
* Stable: No
* In-place: Yes
* Adaptive: No

**Implementation:**
```cpp
void flip(vector<int>& arr, int i) {
    int start = 0;
    while (start < i) {
        swap(arr[start], arr[i]);
        start++;
        i--;
    }
}

int find_max(vector<int>& arr, int n) {
    int max_idx = 0;
    for (int i = 1; i < n; i++) {
        if (arr[i] > arr[max_idx]) {
            max_idx = i;
        }
    }
    return max_idx;
}

void pancake_sort(vector<int>& arr) {
    int n = arr.size();
    
    for (int curr_size = n; curr_size > 1; curr_size--) {
        int max_idx = find_max(arr, curr_size);
        
        if (max_idx != curr_size - 1) {
            // Move maximum to front
            if (max_idx != 0) {
                flip(arr, max_idx);
            }
            // Move maximum to correct position
            flip(arr, curr_size - 1);
        }
    }
}
```

**When to use:** Theoretical interest, when only flip operations are allowed.

---## 1
6) Bogo Sort (For Completeness)

**Idea:** Randomly shuffle array until it becomes sorted.

**Complexities:**
* Best: O(n) - if array is already sorted
* Average: O((n+1)!) - factorial time
* Worst: Unbounded (may never terminate)
* Space: O(1)
* Stable: No
* In-place: Yes
* Adaptive: No

**Implementation:**
```cpp
bool is_sorted(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] < arr[i-1]) return false;
    }
    return true;
}

void bogo_sort(vector<int>& arr) {
    while (!is_sorted(arr)) {
        random_shuffle(arr.begin(), arr.end());
    }
}
```

**When to use:** Never in practice! Only for educational/humor purposes.

---

## 17) External Sorting (Brief)

**Problem:** Sorting data that doesn't fit in memory.

**Approach:** 
1. Divide data into chunks that fit in memory
2. Sort each chunk and write to disk
3. Merge sorted chunks using k-way merge

**Example - External Merge Sort:**
```cpp
// Pseudocode for external merge sort
void external_merge_sort(string input_file, string output_file, int memory_limit) {
    // Phase 1: Create sorted runs
    vector<string> temp_files;
    create_sorted_runs(input_file, temp_files, memory_limit);
    
    // Phase 2: Merge runs
    while (temp_files.size() > 1) {
        vector<string> new_temp_files;
        for (int i = 0; i < temp_files.size(); i += k) {
            string merged_file = merge_k_files(temp_files, i, min(i+k, temp_files.size()));
            new_temp_files.push_back(merged_file);
        }
        temp_files = new_temp_files;
    }
    
    rename(temp_files[0], output_file);
}
```

**Applications:** Database sorting, big data processing, when data > RAM.

---

## 18) Sorting Networks (Brief)

**Idea:** Fixed sequence of compare-and-swap operations that work for any input.

**Properties:**
- Parallel execution possible
- Fixed number of comparisons
- Data-independent execution time

**Example - Bitonic Sort Network:**
- Recursively builds bitonic sequences
- O(n log² n) comparisons
- Suitable for parallel hardware

**When to use:** Parallel processing, hardware implementations, GPU sorting.

---

## 19) Common Interview Patterns & Typical Questions

**Pattern A - Basic Implementation:**
* Implement merge sort, quick sort from scratch
* Explain time/space complexity trade-offs
* When to use which sorting algorithm?

**Pattern B - Stability & Properties:**
* Make an unstable sort stable
* Sort with minimal swaps (selection sort property)
* Sort in-place with O(n log n) time

**Pattern C - Custom Comparisons:**
* Sort array of strings by length
* Sort 2D points by distance from origin
* Sort with custom objects

**Pattern D - Optimization Problems:**
* Sort colors (Dutch National Flag - 3-way partition)
* Sort array with only 0s, 1s, and 2s
* Merge k sorted arrays

**Pattern E - Analysis Questions:**
* Why is comparison-based sorting O(n log n) lower bound?
* Explain why quicksort is preferred over merge sort
* When would you use counting sort vs radix sort?

**Tricky Interview Questions:**

1. **Sort an array in O(n) time:** Only possible with non-comparison sorts (counting, radix, bucket)

2. **Sort a nearly sorted array:** Use insertion sort (adaptive) or Tim sort

3. **Sort with minimal memory:** Use heap sort (O(1) space, O(n log n) time)

4. **Sort stability requirement:** Use merge sort or stable versions of other algorithms

5. **External sorting:** Discuss k-way merge for data larger than memory

6. **Parallel sorting:** Discuss merge sort parallelization, bitonic sort

---

## 20) Full C++ Code Collection (Ready-to-run)

```cpp
#include <bits/stdc++.h>
using namespace std;

// Bubble Sort
void bubble_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        bool swapped = false;
        for (int j = 0; j < n-1-i; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

// Selection Sort
void selection_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx != i) {
            swap(arr[i], arr[min_idx]);
        }
    }
}

// Insertion Sort
void insertion_sort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// Merge Sort
void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;
    
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }
    
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    
    for (i = left, k = 0; i <= right; i++, k++) {
        arr[i] = temp[k];
    }
}

void merge_sort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        merge_sort(arr, left, mid);
        merge_sort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

// Quick Sort
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quick_sort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quick_sort(arr, low, pi - 1);
        quick_sort(arr, pi + 1, high);
    }
}

// Heap Sort
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heap_sort(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

// Counting Sort
void counting_sort(vector<int>& arr) {
    if (arr.empty()) return;
    
    int max_val = *max_element(arr.begin(), arr.end());
    int min_val = *min_element(arr.begin(), arr.end());
    int range = max_val - min_val + 1;
    
    vector<int> count(range, 0);
    vector<int> output(arr.size());
    
    for (int num : arr) {
        count[num - min_val]++;
    }
    
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i] - min_val] - 1] = arr[i];
        count[arr[i] - min_val]--;
    }
    
    for (int i = 0; i < arr.size(); i++) {
        arr[i] = output[i];
    }
}

// Test function
void print_array(const vector<int>& arr) {
    for (int x : arr) cout << x << " ";
    cout << "\n";
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    
    cout << "Original array: ";
    print_array(arr);
    
    // Test different sorting algorithms
    vector<int> temp = arr;
    
    bubble_sort(temp);
    cout << "Bubble sort: ";
    print_array(temp);
    
    temp = arr;
    selection_sort(temp);
    cout << "Selection sort: ";
    print_array(temp);
    
    temp = arr;
    insertion_sort(temp);
    cout << "Insertion sort: ";
    print_array(temp);
    
    temp = arr;
    merge_sort(temp, 0, temp.size() - 1);
    cout << "Merge sort: ";
    print_array(temp);
    
    temp = arr;
    quick_sort(temp, 0, temp.size() - 1);
    cout << "Quick sort: ";
    print_array(temp);
    
    temp = arr;
    heap_sort(temp);
    cout << "Heap sort: ";
    print_array(temp);
    
    temp = arr;
    counting_sort(temp);
    cout << "Counting sort: ";
    print_array(temp);
    
    return 0;
}
```

---## 21) D
emo Walkthroughs (Step-by-step traces)

### Bubble Sort Trace: `arr = [64, 34, 25, 12, 22]`

**Pass 1:**
- Compare 64,34 → swap → [34, 64, 25, 12, 22]
- Compare 64,25 → swap → [34, 25, 64, 12, 22]
- Compare 64,12 → swap → [34, 25, 12, 64, 22]
- Compare 64,22 → swap → [34, 25, 12, 22, 64]

**Pass 2:**
- Compare 34,25 → swap → [25, 34, 12, 22, 64]
- Compare 34,12 → swap → [25, 12, 34, 22, 64]
- Compare 34,22 → swap → [25, 12, 22, 34, 64]

**Continue until sorted:** [12, 22, 25, 34, 64]

### Quick Sort Trace: `arr = [10, 7, 8, 9, 1, 5]`

**Initial call:** quicksort(arr, 0, 5)
- Pivot = 5 (last element)
- Partition: [1, 5, 8, 9, 10, 7] (pivot at index 1)
- Recursively sort [1] and [8, 9, 10, 7]

**Right subarray:** quicksort(arr, 2, 5)
- Pivot = 7, Partition: [1, 5, 7, 9, 10, 8] (pivot at index 2)
- Recursively sort [] and [9, 10, 8]

**Continue until sorted:** [1, 5, 7, 8, 9, 10]

### Merge Sort Trace: `arr = [38, 27, 43, 3]`

```
                [38, 27, 43, 3]
                /             \
        [38, 27]                 [43, 3]
        /     \                   /     \
    [38]     [27]             [43]     [3]
        \     /                 \     /
        [27, 38]               [3, 43]
             \                   /
              [3, 27, 38, 43]
```

**Merge steps:**
1. Merge [38] and [27] → [27, 38]
2. Merge [43] and [3] → [3, 43]
3. Merge [27, 38] and [3, 43] → [3, 27, 38, 43]

### Heap Sort Trace: `arr = [4, 10, 3, 5, 1]`

**Build Max Heap:**
- Start: [4, 10, 3, 5, 1]
- Heapify from index 1: [4, 10, 3, 5, 1] (no change)
- Heapify from index 0: [10, 5, 3, 4, 1]

**Extract elements:**
1. Swap 10 and 1: [1, 5, 3, 4, 10], heapify: [5, 4, 3, 1, 10]
2. Swap 5 and 1: [1, 4, 3, 5, 10], heapify: [4, 1, 3, 5, 10]
3. Continue until sorted: [1, 3, 4, 5, 10]

---

## 22) Optimizations & Trick Questions

**Common Optimizations:**

1. **Hybrid Approaches:**
   - Use insertion sort for small subarrays (< 10-50 elements)
   - Switch to heap sort when quicksort recursion depth exceeds 2*log(n)

2. **Quicksort Optimizations:**
   - Median-of-three pivot selection
   - 3-way partitioning for arrays with many duplicates
   - Tail recursion elimination

3. **Memory Access Patterns:**
   - Merge sort: not cache-friendly due to auxiliary array
   - Heap sort: poor cache locality due to heap structure
   - Quick sort: good cache locality for partitioning

**Trick Questions:**

1. **"Sort an array of 0s, 1s, and 2s"**
   - Use Dutch National Flag algorithm (3-way partitioning)
   - O(n) time, O(1) space

2. **"Sort without using comparison operators"**
   - Use counting sort, radix sort, or bucket sort

3. **"Sort a linked list"**
   - Merge sort works well (O(1) space for linked lists)
   - Quick sort is harder due to no random access

4. **"Find kth largest element"**
   - Use quickselect algorithm (average O(n))
   - Or use min-heap of size k

5. **"Sort array with limited range"**
   - Use counting sort for O(n + k) time

---

## 23) Cheat Sheet (Table Summary)

| Algorithm     | Best Time | Avg Time  | Worst Time | Space | Stable | In-place | Adaptive |
|---------------|-----------|-----------|------------|-------|--------|----------|----------|
| Bubble        | O(n)      | O(n²)     | O(n²)      | O(1)  | Yes    | Yes      | Yes      |
| Selection     | O(n²)     | O(n²)     | O(n²)      | O(1)  | No     | Yes      | No       |
| Insertion     | O(n)      | O(n²)     | O(n²)      | O(1)  | Yes    | Yes      | Yes      |
| Merge         | O(n log n)| O(n log n)| O(n log n) | O(n)  | Yes    | No       | No       |
| Quick         | O(n log n)| O(n log n)| O(n²)      | O(log n)| No   | Yes      | No       |
| Heap          | O(n log n)| O(n log n)| O(n log n) | O(1)  | No     | Yes      | No       |
| Counting      | O(n+k)    | O(n+k)    | O(n+k)     | O(k)  | Yes    | No       | No       |
| Radix         | O(d(n+k)) | O(d(n+k)) | O(d(n+k))  | O(n+k)| Yes    | No       | No       |
| Bucket        | O(n+k)    | O(n)      | O(n²)      | O(n)  | Yes    | No       | No       |
| Shell         | O(n log n)| O(n^1.5)  | O(n²)      | O(1)  | No     | Yes      | Yes      |
| Tim           | O(n)      | O(n log n)| O(n log n) | O(n)  | Yes    | No       | Yes      |

**When to use which:**

- **Small arrays (n < 50):** Insertion Sort
- **General purpose:** Quick Sort or Merge Sort
- **Stability required:** Merge Sort or Tim Sort
- **Memory constrained:** Heap Sort or Shell Sort
- **Nearly sorted data:** Insertion Sort or Tim Sort
- **Integer range small:** Counting Sort
- **Fixed-width integers:** Radix Sort
- **Uniformly distributed:** Bucket Sort

---

## 24) Practice Problems (Categorized)

**Beginner Level:**

1. **Implement Basic Sorts**
   - Code bubble, selection, insertion sort from scratch
   - Compare their performance on different inputs

2. **Sort Analysis**
   - Count number of swaps in bubble sort
   - Find minimum number of swaps to sort array

3. **Custom Comparisons**
   - Sort strings by length
   - Sort points by distance from origin

**Intermediate Level:**

4. **Dutch National Flag**
   - Sort array of 0s, 1s, and 2s in one pass
   - Hint: Use 3-way partitioning

5. **Merge K Sorted Arrays**
   - Use min-heap or divide-and-conquer approach
   - Time: O(n log k) where n is total elements

6. **Sort Colors**
   - Given array with red, white, blue - sort in-place
   - Same as Dutch National Flag problem

7. **Pancake Sorting**
   - Sort array using only flip operations
   - Find minimum number of flips needed

**Advanced Level:**

8. **External Sorting**
   - Sort file larger than available memory
   - Implement k-way merge algorithm

9. **Parallel Sorting**
   - Implement parallel merge sort
   - Design bitonic sorting network

10. **Custom Data Structures**
    - Sort linked list using merge sort
    - Sort array of custom objects

**Competitive Programming:**

11. **Inversion Count**
    - Count number of inversions using merge sort
    - Time: O(n log n)

12. **Kth Largest Element**
    - Use quickselect algorithm
    - Average time: O(n)

13. **Sort by Frequency**
    - Sort elements by their frequency of occurrence
    - Use counting + custom comparator

**Sample Solutions/Hints:**

**Dutch National Flag (0s, 1s, 2s):**
```cpp
void sort_colors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low++], nums[mid++]);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high--]);
        }
    }
}
```

**Merge K Sorted Arrays:**
```cpp
vector<int> merge_k_arrays(vector<vector<int>>& arrays) {
    priority_queue<pair<int, pair<int, int>>, 
                   vector<pair<int, pair<int, int>>>, 
                   greater<pair<int, pair<int, int>>>> pq;
    
    // Initialize heap with first element of each array
    for (int i = 0; i < arrays.size(); i++) {
        if (!arrays[i].empty()) {
            pq.push({arrays[i][0], {i, 0}});
        }
    }
    
    vector<int> result;
    while (!pq.empty()) {
        auto curr = pq.top();
        pq.pop();
        
        int val = curr.first;
        int array_idx = curr.second.first;
        int elem_idx = curr.second.second;
        
        result.push_back(val);
        
        if (elem_idx + 1 < arrays[array_idx].size()) {
            pq.push({arrays[array_idx][elem_idx + 1], 
                    {array_idx, elem_idx + 1}});
        }
    }
    
    return result;
}
```

---

## Real-Life Applications

**1. Database Systems:**
- External merge sort for large datasets
- B-tree sorting for disk-based storage
- Query optimization using sorted indices

**2. Operating Systems:**
- Process scheduling (priority-based sorting)
- Memory management (sorting free blocks)
- File system organization

**3. Graphics & Gaming:**
- Z-buffer sorting for 3D rendering
- Collision detection (sort by spatial coordinates)
- Animation keyframe sorting

**4. Data Analytics:**
- Sorting large datasets for analysis
- MapReduce sorting phase
- Time-series data organization

**5. Search Engines:**
- Ranking search results
- Index construction and maintenance
- Relevance score sorting

**6. Financial Systems:**
- Transaction processing by timestamp
- Risk assessment sorting
- Portfolio optimization

---

## Mini Quiz Section

**Question 1:** Which sorting algorithm has the best worst-case time complexity while using O(1) space?
a) Quick Sort  b) Merge Sort  c) Heap Sort  d) Shell Sort

**Answer:** c) Heap Sort - O(n log n) worst-case time with O(1) space.

**Question 2:** Which property is impossible to achieve simultaneously?
a) Stable + In-place  b) O(n log n) + Stable  c) Stable + In-place + O(n log n)  d) In-place + O(n log n)

**Answer:** c) No algorithm can be stable, in-place, and O(n log n) simultaneously.

**Question 3:** For sorting an array of 1 million integers in range [0, 100], which is most efficient?
a) Quick Sort  b) Merge Sort  c) Counting Sort  d) Heap Sort

**Answer:** c) Counting Sort - O(n + k) = O(1,000,000 + 100) is much better than O(n log n).

**Question 4:** Which algorithm performs best on nearly sorted data?
a) Selection Sort  b) Insertion Sort  c) Heap Sort  d) Quick Sort

**Answer:** b) Insertion Sort - O(n) time on nearly sorted data due to its adaptive nature.

**Question 5:** What is the minimum number of comparisons needed to sort n e