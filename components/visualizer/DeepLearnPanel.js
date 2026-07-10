"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Clock, HardDrive, Zap, CheckCircle2, XCircle,
  AlertTriangle, ChevronDown, ChevronRight, Brain, Target,
  TrendingUp, Shield, Code2, ExternalLink
} from "lucide-react";
import { ALGORITHM_CODES } from "@/lib/algorithms/algorithmCode";
import { getAlgorithmById } from "@/lib/algorithms/index";

const LEARN_DB = {
  bubble: {
    title: "Bubble Sort",
    tagline: "Simplest sort — never use on large data. Best for learning how sorting works.",
    intuition: "Walk through the array comparing each pair of neighbors. If the left one is bigger, swap them. After one full pass, the largest element has \"bubbled\" to the end. After n-1 passes, the entire array is sorted.",
    analogy: "Students lined up by height. Walk the line — if a taller student stands before a shorter one, swap them. After one walk, the tallest is at the end. After n-1 walks, everyone is in order.",
    howItWorks: [
      "Compare arr[0] and arr[1]. If arr[0] > arr[1], swap them.",
      "Move to arr[1] and arr[2]. Swap if needed. Continue to end.",
      "After pass 1, the largest element is at the last position — done for good.",
      "On pass 2, repeat but stop one element earlier (last is already sorted).",
      "After n-1 passes, the array is fully sorted.",
      "Optimization: if a full pass makes zero swaps, the array is sorted early — exit.",
    ],
    complexity: {
      best:    { n: "O(n)",   why: "Array already sorted. With early-exit: 1 pass × n comparisons = O(n). Zero swaps." },
      average: { n: "O(n²)",  why: "n-1 passes. Pass i does n-i-1 comparisons. Total: (n-1)+(n-2)+…+1 = n(n-1)/2 ≈ n²/2 = O(n²)." },
      worst:   { n: "O(n²)",  why: "Reverse-sorted array. Every comparison results in a swap. Same formula: n(n-1)/2 = O(n²)." },
      space:   { n: "O(1)",   why: "In-place. Only swaps within the original array. No extra memory needed." },
      stable:  true,
      stableWhy: "Only swaps when arr[j] > arr[j+1] (strict greater-than). Equal elements are NEVER swapped, so their relative order is preserved.",
    },
    use: ["Learning and teaching sorting concepts", "Tiny arrays (n < 10)", "Nearly sorted data with early-exit"],
    avoid: ["Any dataset with n > 100", "Performance-critical applications", "Large or random data"],
    mistakes: [
      { wrong: "Inner loop goes to n instead of n-i-1", fix: "The last i elements are already sorted. Comparing them wastes time. Always use n-i-1 as the bound." },
      { wrong: "Using >= instead of > in swap condition", fix: "Using >= makes it unstable — equal elements get swapped unnecessarily. Use strict > only." },
      { wrong: "Not adding early-exit optimization", fix: "Add a 'swapped' boolean. If no swaps happen in a full pass, the array is sorted. Return immediately." },
    ],
    memory: "BIG numbers BUBBLE UP to the RIGHT — like bubbles in water rising to the surface. After pass k, the k largest elements are in their final positions at the right end.",
  },
  selection: {
    title: "Selection Sort",
    tagline: "Always finds the minimum — does fewest writes of any sort. O(n) swaps total.",
    intuition: "Scan the entire unsorted portion to find the minimum element. Place it at the start of the unsorted portion. Grow the sorted portion by one. Repeat.",
    analogy: "Sorting cards in your hand: look at all cards, pick the lowest, put it first. Look at remaining, pick lowest, put it second. Repeat until done.",
    howItWorks: [
      "Start: sorted portion is empty (left side), unsorted is whole array.",
      "Scan entire unsorted portion to find index of minimum element.",
      "Swap that minimum with the first element of the unsorted portion.",
      "The sorted portion grows by one (boundary moves right by one).",
      "Repeat until the sorted portion covers the whole array.",
    ],
    complexity: {
      best:    { n: "O(n²)", why: "Even on sorted arrays, selection sort ALWAYS scans the entire unsorted portion. It cannot detect that it's already sorted." },
      average: { n: "O(n²)", why: "Always exactly n(n-1)/2 comparisons. Pass i scans n-i elements. Sum: (n-1)+(n-2)+…+1 = n(n-1)/2 = O(n²)." },
      worst:   { n: "O(n²)", why: "Same as best case. Performance is independent of input order." },
      space:   { n: "O(1)",  why: "Completely in-place. Only min_idx variable as extra storage." },
      stable:  false,
      stableWhy: "The swap operation can jump an element over equal elements. [2a, 2b, 1]: swap 1 with 2a gives [1, 2b, 2a]. The two 2s are now reversed.",
    },
    use: ["When write operations are expensive (O(n) swaps vs O(n²) for bubble)", "Memory-constrained systems", "Teaching/learning"],
    avoid: ["When stability is required", "Large datasets — always O(n²), no early exit possible"],
    mistakes: [
      { wrong: "Starting inner loop from 0", fix: "Elements before i are already sorted. Always start inner loop from i+1." },
      { wrong: "Swapping after every comparison", fix: "Track the minimum INDEX throughout the inner loop. Do ONE swap at the end of each outer iteration." },
    ],
    memory: "SELECTION sort: SELECT the minimum, put it in place, forget it. Like picking the shortest person from a group, placing them at the front, then repeating with the remaining group.",
  },
  insertion: {
    title: "Insertion Sort",
    tagline: "Like sorting playing cards — insert each element into its correct position.",
    intuition: "Maintain a sorted portion on the left. Take each new element and insert it into the correct position in the sorted portion by shifting larger elements one step right to make room.",
    analogy: "Sorting cards in your hand. Pick up one card at a time. Slide it left past all cards that are bigger than it, until it's in the right spot. The held cards are always sorted.",
    howItWorks: [
      "Index 0 is trivially sorted (a single element is always sorted).",
      "Take arr[1]. Compare with arr[0]. If arr[0] > arr[1], shift arr[0] right and insert arr[1] before it.",
      "Take arr[2]. Scan left through sorted portion, shifting larger elements right until you find arr[2]'s correct position. Insert.",
      "Repeat for arr[3], arr[4], … arr[n-1].",
      "The sorted portion grows from left to right one element at a time.",
    ],
    complexity: {
      best:    { n: "O(n)",  why: "Array already sorted. For each element, the while loop condition (arr[j] > key) is immediately false. Only n-1 comparisons, zero shifts." },
      average: { n: "O(n²)", why: "Each element shifts about halfway through the sorted portion on average. Total shifts: 1+2+…+(n-1) on average ≈ n²/4 = O(n²)." },
      worst:   { n: "O(n²)", why: "Reverse-sorted array. arr[i] must travel all the way to index 0 every time. Shifts: 1+2+…+(n-1) = n(n-1)/2 = O(n²)." },
      space:   { n: "O(1)",  why: "In-place. Only the 'key' variable as extra storage." },
      stable:  true,
      stableWhy: "The while condition uses strict > (not >=). Equal elements are never shifted past each other. Their original relative order is always preserved.",
    },
    use: ["Small arrays (n < 50) — fastest of the O(n²) sorts in practice", "Nearly sorted data — approaches O(n)", "Online algorithm: sort a data stream as it arrives", "As part of TimSort (Python/Java use this for small subarrays)"],
    avoid: ["Large random datasets — use Merge Sort or Quick Sort"],
    mistakes: [
      { wrong: "Using >= instead of > in while condition", fix: "That makes it unstable. Use strict > so equal elements are never displaced." },
      { wrong: "Forgetting to save arr[i] in 'key' before shifting", fix: "Shifting overwrites arr[i]. You MUST save the value first, before the while loop." },
      { wrong: "Setting j = i instead of j = i-1", fix: "j should be the LAST element of the sorted portion, which is at index i-1." },
    ],
    memory: "Think of sorting cards: pick up a card, slide it LEFT past all bigger cards until it's in the right spot. That's insertion sort. Pick, slide, place. Pick, slide, place.",
  },
  merge: {
    title: "Merge Sort",
    tagline: "Divide and Conquer — guaranteed O(n log n) in ALL cases. The gold standard.",
    intuition: "Split array in half recursively until each piece has 1 element (trivially sorted). Then merge adjacent sorted pieces — always picking the smaller front element — back into larger sorted pieces. The merge step is O(n) and runs log n times.",
    analogy: "Sorting a pile of papers. Split pile in half, give half to a friend. Both split again, keep splitting until everyone holds 1 paper. Now merge: you and your neighbor both show your sorted piles and build a combined sorted pile by always taking the smaller top paper.",
    howItWorks: [
      "BASE CASE: if array has ≤ 1 elements, return it (already sorted).",
      "DIVIDE: find midpoint = len(arr) // 2. Split into left = arr[:mid] and right = arr[mid:].",
      "CONQUER: recursively mergeSort(left) and mergeSort(right).",
      "MERGE: use two pointers i=0, j=0. While both arrays have elements, pick the smaller front: if left[i] ≤ right[j], take left[i], else take right[j].",
      "Append any remaining elements from either array.",
      "Return the merged, sorted array.",
    ],
    complexity: {
      best:    { n: "O(n log n)", why: "Even on sorted arrays, merge sort always divides and merges every element. log n recursion levels (halving each time). O(n) merge work at each level. Total: n × log n." },
      average: { n: "O(n log n)", why: "Always log n levels of recursion (n → n/2 → n/4 → … → 1 takes log n steps). At each level, merging all pairs totals exactly n comparisons. Result: n log n." },
      worst:   { n: "O(n log n)", why: "Performance does NOT depend on input order. Always exactly log n levels, always O(n) merge work per level. This is merge sort's greatest strength over quicksort." },
      space:   { n: "O(n)",       why: "Merging requires an auxiliary array. Cannot merge two sorted arrays in-place efficiently. This is merge sort's main disadvantage vs heap sort and quicksort." },
      stable:  true,
      stableWhy: "In the merge step, when left[i] == right[j], we always take from left first (using ≤ not <). Equal elements from the left half always appear before equal elements from the right half.",
    },
    use: ["When guaranteed O(n log n) worst-case is needed", "Sorting linked lists (no random access needed)", "External sorting (data too large for RAM)", "When stability is required for large data", "Parallelizable — both halves can sort on separate CPUs"],
    avoid: ["Memory-limited environments (requires O(n) extra space)", "Small arrays where insertion sort's low overhead wins"],
    mistakes: [
      { wrong: "Forgetting the base case", fix: "Without 'if len(arr) <= 1: return arr', the recursion is infinite. Always check base case first." },
      { wrong: "Not appending leftover elements after merge loop", fix: "After the main while loop, one array may still have elements. Always append all of left[i:] and right[j:] to result." },
      { wrong: "Modifying the original array instead of returning new", fix: "In top-down merge sort, each call returns a new sorted array. Don't try to sort in-place." },
    ],
    memory: "DIVIDE until single elements. CONQUER by merging up. The recursion tree has log n LEVELS. Each level does n total WORK. Total = n × log n. The tree has log n levels because halving n gives log n steps.",
  },
  quick: {
    title: "Quick Sort",
    tagline: "Fastest in practice — in-place, cache-friendly. But O(n²) worst case.",
    intuition: "Choose a pivot. Rearrange so all elements < pivot are to its left, all > pivot are to its right. Pivot is now in its final sorted position. Recursively sort left and right sub-arrays. No merge step needed — sorting is done in-place.",
    analogy: "Organizing a classroom by height: pick any student as pivot. All shorter students go left, taller go right. Pivot is now correctly placed. Independently sort the left group and right group using the same process.",
    howItWorks: [
      "Choose pivot (commonly: last element, random element, or median-of-three).",
      "Partition: i starts at low-1. For each j from low to high-1: if arr[j] ≤ pivot, increment i and swap arr[i] with arr[j].",
      "After loop: swap pivot (arr[high]) with arr[i+1]. Pivot is now at its FINAL position.",
      "Return pivot index. Recursively sort arr[low..pivot-1] and arr[pivot+1..high].",
      "No merge needed — array is sorted in-place.",
    ],
    complexity: {
      best:    { n: "O(n log n)", why: "When pivot always splits array exactly in half, recursion depth is log n. Each level does O(n) partitioning work. Total: n log n." },
      average: { n: "O(n log n)", why: "With random data, pivot splits array roughly evenly on average (even 1/3 and 2/3 splits give O(n log n)). Average case is n log n with a very small constant (~2× faster than merge sort in practice)." },
      worst:   { n: "O(n²)",      why: "If pivot is always the min or max (happens with sorted/reverse-sorted arrays using last-element pivot), each partition creates sub-arrays of size 0 and n-1. Recursion depth becomes n instead of log n. Total: n²." },
      space:   { n: "O(log n)",   why: "No extra array needed (in-place). But recursion uses stack space. Average depth is O(log n). Worst case: O(n) stack depth (skewed partitions)." },
      stable:  false,
      stableWhy: "Partitioning moves elements around by their value relative to pivot, without regard for their original order. Equal elements can end up in different relative positions.",
    },
    use: ["General-purpose sorting — fastest on average for random data", "When in-place sorting is needed (O(log n) space vs merge sort's O(n))", "Cache-sensitive code (sequential memory access during partitioning)"],
    avoid: ["When worst-case O(n²) is unacceptable — use merge sort or heap sort", "Already-sorted data with bad pivot choice", "When stability is required"],
    mistakes: [
      { wrong: "Always using first or last element as pivot on sorted data", fix: "This gives worst-case O(n²). Fix: randomize pivot by swapping a random element to arr[high] before partitioning." },
      { wrong: "Incorrect partition bounds", fix: "i starts at low-1. Inner loop j goes from low to high-1 (NOT including arr[high] = pivot). Swap arr[i+1] with arr[high] after loop." },
      { wrong: "Recursive calls including the pivot index", fix: "Pivot is ALREADY in final position. Recurse on arr[low..pi-1] and arr[pi+1..high], NOT including pi." },
    ],
    memory: "PICK a pivot → PARTITION around it (pivot is in FINAL position) → RECURSE on left and right. The PARTITION step is the heart. Everything left of pivot is smaller, everything right is larger — forever.",
  },
  heap: {
    title: "Heap Sort",
    tagline: "Guaranteed O(n log n) worst-case with O(1) space — best of both worlds.",
    intuition: "Build a max-heap (largest element at root). Repeatedly: swap root with last unsorted element (placing the max in its final position), shrink the heap, restore the heap property (heapify). After n-1 extractions, array is sorted.",
    analogy: "Tournament bracket (max-heap): largest player is always at the top. After the champion is placed (moved to end), the remaining players re-compete to find the new champion. Repeat until all are ranked.",
    howItWorks: [
      "PHASE 1 — Build Max-Heap: rearrange array so parent ≥ children for all nodes. Start heapify from index n//2-1 down to 0. This takes O(n) time.",
      "The root (arr[0]) is now the maximum element of the array.",
      "PHASE 2 — Extract: swap arr[0] (max) with arr[n-1]. This places the max in its final sorted position.",
      "Reduce heap size by 1. Call heapify(arr, new_size, 0) to restore heap property.",
      "Repeat extraction until heap size is 1. Array is fully sorted in ascending order.",
    ],
    complexity: {
      best:    { n: "O(n log n)", why: "Building heap: O(n). Extracting n elements, each requiring heapify O(log n): O(n log n). Total always O(n log n) — no best-case shortcut." },
      average: { n: "O(n log n)", why: "Always O(n) build + O(n log n) extraction. Input order doesn't significantly affect performance." },
      worst:   { n: "O(n log n)", why: "Unlike quicksort, heap sort NEVER degrades to O(n²). The heap structure guarantees log n height regardless of input. This makes it preferable in real-time systems." },
      space:   { n: "O(1)",       why: "Heap is built within the original array. No extra memory. This is heap sort's key advantage over merge sort (which needs O(n) extra space)." },
      stable:  false,
      stableWhy: "Heapify moves elements far from their original positions. Equal elements can end up in any relative order.",
    },
    use: ["When BOTH O(n log n) worst-case AND O(1) space are required simultaneously", "Embedded systems with tight memory", "Real-time systems where worst-case guarantees matter", "Finding top-k elements efficiently"],
    avoid: ["General use — quicksort is 2-3× faster in practice", "When stability is required", "Cache-sensitive code — heap's non-sequential memory access causes cache misses"],
    mistakes: [
      { wrong: "Wrong child indices in heapify", fix: "For 0-indexed arrays: left child of i = 2i+1, right child = 2i+2, parent of i = (i-1)//2." },
      { wrong: "Building heap top-down O(n log n) instead of bottom-up O(n)", fix: "Start heapify from index n//2-1 (last non-leaf node), go down to 0. This is O(n) not O(n log n)." },
      { wrong: "Using min-heap for ascending sort", fix: "For ascending order, use MAX-HEAP. Max at root gets extracted to end first. Min-heap gives descending order." },
    ],
    memory: "BUILD the max-heap (O(n)). EXTRACT max to end, SHRINK heap, HEAPIFY (O(log n) each). n extractions × log n = O(n log n). Always guaranteed. Always O(1) space.",
  },
  binary: {
    title: "Binary Search",
    tagline: "O(log n) search on sorted arrays — each step eliminates HALF the remaining elements.",
    intuition: "On a sorted array, check the middle element. If it equals the target, done. If target is smaller, it must be in the LEFT half — discard the right. If larger, discard the left. Repeat on the remaining half. Each step halves the search space.",
    analogy: "Looking up a word in a dictionary. Open to the middle page. If your word comes BEFORE this page alphabetically, flip to the middle of the LEFT half. If AFTER, flip to the middle of the RIGHT half. Each flip eliminates half the remaining pages.",
    howItWorks: [
      "PREREQUISITE: Array MUST be sorted. Binary search gives WRONG answers on unsorted arrays.",
      "Set left = 0, right = n-1 (start with whole array as search space).",
      "Calculate mid = (left + right) // 2.",
      "If arr[mid] == target: FOUND. Return mid.",
      "If arr[mid] < target: target is in RIGHT half. Set left = mid + 1.",
      "If arr[mid] > target: target is in LEFT half. Set right = mid - 1.",
      "If left > right: search space is empty. Target not in array. Return -1.",
    ],
    complexity: {
      best:    { n: "O(1)",     why: "Target is at the midpoint on the very first check. One comparison, done." },
      average: { n: "O(log n)", why: "After k comparisons, search space is n/2^k. Search stops when n/2^k = 1, so k = log₂(n). For n=1,000,000: at most 20 comparisons!" },
      worst:   { n: "O(log n)", why: "Target is at the very end or not present. Still only O(log n) checks. For n=1,000,000,000 (1 billion): at most 30 comparisons." },
      space:   { n: "O(1)",     why: "Iterative version uses only left, right, mid variables. Recursive version: O(log n) call stack depth." },
      stable:  null,
      stableWhy: "Not applicable — binary search is a SEARCH algorithm, not a sort.",
    },
    use: ["Searching in any sorted array", "Finding insertion position (lower/upper bound)", "Binary search on the answer (monotone functions on a range)", "Any problem where you can eliminate half the possibilities each step"],
    avoid: ["Unsorted arrays — sort first (O(n log n)), then search is O(log n). If searching only once, linear O(n) is better.", "Linked lists — no O(1) random access. Use linear search."],
    mistakes: [
      { wrong: "mid = (left + right) / 2 in 32-bit integer languages (C++, Java)", fix: "left + right can overflow INT_MAX. Always use: mid = left + (right - left) / 2." },
      { wrong: "Loop condition left < right instead of left <= right", fix: "Using < misses the case where the target is the last remaining element. Always use <=." },
      { wrong: "Searching an unsorted array", fix: "Binary search REQUIRES sorted input. Results are undefined on unsorted arrays." },
    ],
    memory: "Open a BOOK to the MIDDLE. Too early? Go to middle of RIGHT half. Too late? Go to middle of LEFT half. Each flip HALVES the remaining pages. log₂(1000) ≈ 10. Binary search on 1000 elements: at most 10 comparisons.",
  },
  bfs: {
    title: "Breadth-First Search (BFS)",
    tagline: "Level-by-level exploration — guarantees SHORTEST PATH in unweighted graphs.",
    intuition: "Explore all nodes at distance 1 from source. Then all at distance 2. Then 3. And so on. Uses a QUEUE (FIFO) so nodes discovered earlier are processed earlier — ensuring we always find the closest nodes first.",
    analogy: "A rumor spreading at school. Day 1: you tell your 3 friends. Day 2: each of your friends tells their unaware friends. Day 3: those people tell their unaware friends. BFS spreads outward in expanding circles, like ripples in water.",
    howItWorks: [
      "Mark source node as visited. Add it to queue.",
      "While queue is not empty: dequeue the front node (call it 'current').",
      "For each neighbor of 'current': if unvisited, mark as visited AND add to queue.",
      "Continue until queue is empty.",
      "All reachable nodes have been visited in order of their distance from source.",
    ],
    complexity: {
      best:    { n: "O(V+E)", why: "V = vertices, E = edges. Each vertex is enqueued and dequeued exactly once: O(V). Each edge is examined exactly once when processing its source vertex: O(E). Total: O(V+E)." },
      average: { n: "O(V+E)", why: "Always processes every reachable vertex and edge exactly once." },
      worst:   { n: "O(V+E)", why: "Dense graph (E = V²): O(V²). Sparse graph (E ≈ V): O(V). Always linear in graph size." },
      space:   { n: "O(V)",   why: "Queue can hold at most V vertices (entire frontier). Visited set holds at most V nodes." },
      stable:  null,
      stableWhy: "Not applicable.",
    },
    use: ["Shortest path in UNWEIGHTED graphs (BFS guarantees minimum hops)", "Level-order tree traversal", "Finding all nodes within k hops", "Testing if graph is bipartite (2-colorable)", "Social network distance ('degrees of separation')"],
    avoid: ["Weighted graphs — use Dijkstra's algorithm", "Very memory-limited systems on wide graphs (queue can be huge)", "Finding any path (not shortest) — DFS uses less memory"],
    mistakes: [
      { wrong: "Marking nodes visited AFTER dequeuing instead of BEFORE enqueuing", fix: "Mark as visited WHEN YOU ENQUEUE. Otherwise the same node gets added to the queue multiple times from different neighbors, causing incorrect results and wasted work." },
      { wrong: "Using a stack (LIFO) instead of a queue (FIFO)", fix: "A stack gives DFS behavior, not BFS. Use a deque with append (enqueue at back) and popleft (dequeue from front)." },
      { wrong: "Not marking source as visited before starting", fix: "Add source to visited BEFORE the main loop. Otherwise it gets added again when a neighbor points back to it." },
    ],
    memory: "BFS = BREADTH first = go WIDE. Like a RIPPLE in water — distance 1, distance 2, distance 3. QUEUE (first in, first out) ensures closer nodes are processed first. This is WHY BFS finds shortest paths.",
  },
  dfs: {
    title: "Depth-First Search (DFS)",
    tagline: "Go as deep as possible before backtracking — uses a stack (or recursion).",
    intuition: "Start at source. Follow one path as deep as possible. When you hit a dead end (no unvisited neighbors), backtrack to the last choice point and try another path. Uses a STACK (LIFO) — either explicit or via recursion's call stack.",
    analogy: "Exploring a maze: always follow the left wall. Go forward until you hit a dead end. Backtrack to the last junction and try the next unexplored path. You fully explore one corridor before moving to the next.",
    howItWorks: [
      "Mark source as visited.",
      "For each unvisited neighbor of source: recursively apply DFS.",
      "When all neighbors of a node are visited, return (backtrack).",
      "Continue until all reachable nodes are visited.",
    ],
    complexity: {
      best:    { n: "O(V+E)", why: "Visit each vertex once: O(V). Process each edge once: O(E). Total: O(V+E)." },
      average: { n: "O(V+E)", why: "Always linear in graph size." },
      worst:   { n: "O(V+E)", why: "Dense graph: O(V²). Sparse: O(V)." },
      space:   { n: "O(V)",   why: "Recursion stack can be as deep as V for a path-shaped graph. Iterative DFS uses explicit stack of at most V nodes." },
      stable:  null,
      stableWhy: "Not applicable.",
    },
    use: ["Detecting cycles in a directed/undirected graph", "Topological sorting of a DAG", "Finding strongly connected components (Kosaraju's, Tarjan's)", "Solving mazes and puzzles with backtracking", "Tree traversals (preorder, inorder, postorder)"],
    avoid: ["Finding SHORTEST paths — DFS finds A path, not the shortest. Use BFS.", "Very deep graphs in recursive DFS — risk of stack overflow. Use iterative DFS."],
    mistakes: [
      { wrong: "Using DFS to find shortest paths", fix: "DFS explores one deep path first. It does NOT guarantee the shortest path. Use BFS for shortest paths in unweighted graphs." },
      { wrong: "Not marking nodes as visited before recursion", fix: "Without the visited check, DFS enters infinite loops on cyclic graphs. Mark before recursing." },
      { wrong: "Stack overflow on very deep graphs with recursive DFS", fix: "Convert to iterative DFS: use an explicit stack and a while loop. Avoids Python/Java recursion limits." },
    ],
    memory: "DFS = DEPTH first = go DEEP. Like diving to the BOTTOM of the ocean before swimming sideways. STACK (last in, first out) keeps us going deeper. Backtrack when stuck.",
  },
  "sliding-window": {
    title: "Sliding Window Pattern",
    tagline: "O(n) subarray processing — avoids redundant calculations by sliding a window across the array.",
    intuition: "Instead of re-computing the sum or property of every subarray from scratch (which takes O(k * n)), keep track of the current window's state. When you slide the window one element to the right, subtract the element leaving the window and add the element entering the window. This reduces the time complexity to O(n).",
    analogy: "A moving train on a track. As the train moves forward, only the passenger boarding at the front station and the passenger exiting at the rear station change. The rest of the passengers inside the train remain the same.",
    howItWorks: [
      "Initialize two pointers or define a fixed window size k.",
      "Calculate the sum or state of the first window (indices 0 to k-1).",
      "Slide the window by moving the pointers right one by one.",
      "Subtract the element that left the window (at index i) and add the new element (at index i + k).",
      "Update the maximum, minimum, or target state at each step."
    ],
    complexity: {
      best:    { n: "O(n)", why: "Single pass over the array of size n." },
      average: { n: "O(n)", why: "We slide the window from start to end, visiting each element at most twice (once to enter, once to exit)." },
      worst:   { n: "O(n)", why: "Even in the worst case, the window traverses the array linearly." },
      space:   { n: "O(1)", why: "Only standard variables like window_sum and pointers are stored." },
      stable:  null,
      stableWhy: "Not applicable.",
    },
    use: ["Finding maximum/minimum sum subarray of size K", "Finding longest subarray with sum <= K", "Substring search with dynamic constraints"],
    avoid: ["Non-contiguous subarrays or subset problems", "When the order of elements doesn't matter"],
    mistakes: [
      { wrong: "Re-computing window sum on every slide", fix: "Only add the incoming element and subtract the outgoing element. Do not use sum() inside the loop." },
      { wrong: "Off-by-one errors on window boundaries", fix: "Double check bounds: the element to add is at i + k, and the element to remove is at i." }
    ],
    memory: "A SLIDING WINDOW slides like a magnifying glass. You only add the front, drop the back. Don't look at the middle again!",
    code: `def max_sum_subarray(arr, k):
    n = len(arr)
    if n < k: return 0
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(n - k):
        window_sum += arr[i + k] - arr[i]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
    questions: [
      { name: "LeetCode 209: Minimum Size Subarray Sum", url: "https://leetcode.com/problems/minimum-size-subarray-sum/" },
      { name: "LeetCode 3: Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { name: "LeetCode 438: Find All Anagrams in a String", url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/" },
      { name: "LeetCode 567: Permutation in String", url: "https://leetcode.com/problems/permutation-in-string/" },
      { name: "LeetCode 1004: Max Consecutive Ones III", url: "https://leetcode.com/problems/max-consecutive-ones-iii/" }
    ]
  },
  "two-pointers": {
    title: "Two Pointers Pattern",
    tagline: "Two pointers traversing from opposite directions or at different speeds to solve searching/sorting in O(n).",
    intuition: "Instead of nested loops (O(n²)), use two pointers (left and right) starting at different positions (e.g., indices 0 and n-1). Based on the comparison of values, move either left pointer inward or right pointer inward. Since both pointers move towards each other, you process the array in O(n) time.",
    analogy: "Two people starting at opposite ends of a bridge and walking towards each other until they meet in the middle.",
    howItWorks: [
      "Initialize left pointer at index 0 and right pointer at index n-1.",
      "Perform comparison or operations on arr[left] and arr[right].",
      "If the sum/result matches target, return the values/indices.",
      "If the sum/result is smaller than target, increment left pointer to increase values.",
      "If the sum/result is larger than target, decrement right pointer to decrease values."
    ],
    complexity: {
      best:    { n: "O(1)", why: "If the target is found at the first check of left and right elements." },
      average: { n: "O(n)", why: "Each step moves at least one pointer inward, taking at most n steps." },
      worst:   { n: "O(n)", why: "Pointers traverse the entire array before meeting in the middle." },
      space:   { n: "O(1)", why: "Only requires two pointer variables (left, right)." },
      stable:  null,
      stableWhy: "Not applicable.",
    },
    use: ["Finding pairs in sorted arrays that sum to target", "Reversing an array in-place", "Detecting cycles (Fast/Slow pointers)", "Container with most water problem"],
    avoid: ["Unsorted arrays (unless you sort them first)", "Problems where element adjacency is required"],
    mistakes: [
      { wrong: "Using two pointers on unsorted arrays for sum targets", fix: "The movement logic relies on sorted order. Sort the array first or use a Hash Map." },
      { wrong: "Incorrect loop termination condition", fix: "Use 'while left < right' instead of '<=' to avoid comparing an element with itself." }
    ],
    memory: "TWO POINTERS meet in the middle. Low sum? Move Left up. High sum? Move Right down.",
    code: `def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        curr_sum = arr[left] + arr[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
    questions: [
      { name: "LeetCode 167: Two Sum II - Input Array Is Sorted", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
      { name: "LeetCode 15: 3Sum", url: "https://leetcode.com/problems/3sum/" },
      { name: "LeetCode 11: Container With Most Water", url: "https://leetcode.com/problems/container-with-most-water/" },
      { name: "LeetCode 125: Valid Palindrome", url: "https://leetcode.com/problems/valid-palindrome/" },
      { name: "LeetCode 42: Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/" }
    ]
  },
  "prefix-sum": {
    title: "Prefix Sum Pattern",
    tagline: "O(1) range query preprocessing — precomputes cumulative sums for instant subarray sum lookups.",
    intuition: "Precompute the cumulative sum of the array at each index. Once computed, the sum of any subarray from index i to j can be found instantly in O(1) time using the formula: prefix[j+1] - prefix[i]. This eliminates the need to iterate through elements for every range query.",
    analogy: "Odometer readings. If you want to know how many miles you drove on Tuesday, subtract the odometer reading of Monday night from the odometer reading of Tuesday night.",
    howItWorks: [
      "Create a prefix array of size n+1 initialized to 0.",
      "Fill the prefix array: prefix[i+1] = prefix[i] + arr[i].",
      "For any range query from index L to R (inclusive), return prefix[R+1] - prefix[L].",
      "Enjoy instant range queries in O(1) time instead of O(N)."
    ],
    complexity: {
      best:    { n: "O(n) preprocessing", why: "Takes one pass to pre-calculate all cumulative sums." },
      average: { n: "O(n) preprocessing", why: "Calculates n cumulative sums linearly." },
      worst:   { n: "O(n) preprocessing", why: "Same as average. Range queries are always O(1) regardless of input." },
      space:   { n: "O(n)", why: "Requires an extra array of size n+1 to store prefix sums." },
      stable:  null,
      stableWhy: "Not applicable.",
    },
    use: ["Frequent range sum query operations", "Subarray sum equals K problems", "Equilibrium index search"],
    avoid: ["Dynamic arrays with frequent updates (updating an element takes O(n) to rebuild prefix sum). Use Segment Trees or Fenwick Trees instead."],
    mistakes: [
      { wrong: "Off-by-one indexing errors", fix: "Make prefix array size n+1. Cumulative sum up to index i (0-based) is stored at prefix[i+1] to handle base case prefix[0]=0." },
      { wrong: "Rebuilding prefix array for every query", fix: "Build the prefix sum array EXACTLY ONCE. Subsequent queries just look up indices." }
    ],
    memory: "PREFIX SUM is like an odometer. Tuesday's trip is just (End of Tuesday) - (Start of Tuesday).",
    code: `def prefix_sum(arr):
    n = len(arr)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    return prefix`,
    questions: [
      { name: "LeetCode 303: Range Sum Query - Immutable", url: "https://leetcode.com/problems/range-sum-query-immutable/" },
      { name: "LeetCode 560: Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
      { name: "LeetCode 525: Contiguous Array", url: "https://leetcode.com/problems/contiguous-array/" },
      { name: "LeetCode 724: Find Pivot Index", url: "https://leetcode.com/problems/find-pivot-index/" },
      { name: "LeetCode 238: Product of Array Except Self", url: "https://leetcode.com/problems/product-of-array-except-self/" }
    ]
  },
  "kadane": {
    title: "Kadane's Algorithm",
    tagline: "Maximum subarray sum in O(n) time — dynamic programming tracking maximum contiguous values.",
    intuition: "For each element, decide whether to add it to the existing running subarray or start a brand new subarray at this element. This decision is made by comparing: arr[i] vs (curr_max + arr[i]). By keeping track of the overall maximum, we find the maximum subarray sum in a single linear pass.",
    analogy: "Deciding whether to continue a business partnership. If your partner's debt is so high that joining them makes you poorer than just starting your own business from scratch, you start your own business. If not, you stay together.",
    howItWorks: [
      "Initialize max_so_far and curr_max to arr[0].",
      "Iterate through the array starting from index 1.",
      "At each element, compute new curr_max = max(arr[i], curr_max + arr[i]).",
      "Update max_so_far = max(max_so_far, curr_max).",
      "Return max_so_far as the maximum subarray sum."
    ],
    complexity: {
      best:    { n: "O(n)", why: "Always requires scanning the array exactly once." },
      average: { n: "O(n)", why: "Linear pass checking element transitions." },
      worst:   { n: "O(n)", why: "Performs exactly n-1 transitions." },
      space:   { n: "O(1)", why: "Uses only two scalar state variables." },
      stable:  null,
      stableWhy: "Not applicable.",
    },
    use: ["Maximum contiguous subarray sum (positive/negative integers)", "Buy/sell stock single transaction maximization"],
    avoid: ["Non-contiguous subarray sum problems", "When tracking indices is complex (though it can be modified to do so)"],
    mistakes: [
      { wrong: "Initializing variables to 0", fix: "If the array contains only negative numbers, returning 0 is incorrect. Initialize both variables to arr[0]." },
      { wrong: "Misinterpreting the dynamic programming step", fix: "Remember the choice: start fresh at current element vs extend previous subarray." }
    ],
    memory: "KADANE'S choice: Extend previous sum, or Start fresh at current element. Choose the maximum.",
    code: `def max_subarray_sum(arr):
    max_so_far = curr_max = arr[0]
    for x in arr[1:]:
        curr_max = max(x, curr_max + x)
        max_so_far = max(max_so_far, curr_max)
    return max_so_far`,
    questions: [
      { name: "LeetCode 53: Maximum Subarray", url: "https://leetcode.com/problems/maximum-subarray/" },
      { name: "LeetCode 918: Maximum Sum Circular Subarray", url: "https://leetcode.com/problems/maximum-sum-circular-subarray/" },
      { name: "LeetCode 121: Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { name: "LeetCode 152: Maximum Product Subarray", url: "https://leetcode.com/problems/maximum-product-subarray/" },
      { name: "LeetCode 978: Longest Turbulent Subarray", url: "https://leetcode.com/problems/longest-turbulent-subarray/" }
    ]
  }
};

const DIFF_COLORS = {
  best:    { bg: "#ecfdf5", border: "#a7f3d0", badge: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "#10b981" },
  average: { bg: "#fffbeb", border: "#fde68a", badge: "bg-amber-100 text-amber-800 border-amber-200",   dot: "#f59e0b" },
  worst:   { bg: "#fef2f2", border: "#fecaca", badge: "bg-rose-100 text-rose-800 border-rose-200",     dot: "#f43f5e" },
  space:   { bg: "#eff6ff", border: "#bfdbfe", badge: "bg-blue-100 text-blue-800 border-blue-200",     dot: "#3b82f6" },
};

function Section({ title, icon: Icon, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "20" }}>
            <Icon size={15} style={{ color }} />
          </div>
          <span className="text-sm font-bold text-slate-900">{title}</span>
        </div>
        {open ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 border-t border-slate-100">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DeepLearnPanel({ algorithmId, selectedCategory, preferredLanguage = "python" }) {
  let data = LEARN_DB[algorithmId];
  const algoCodeConfig = ALGORITHM_CODES[algorithmId];
  const langCodeLines = algoCodeConfig?.[preferredLanguage]?.code || algoCodeConfig?.python?.code || [];
  const displayCode = langCodeLines.map(l => l.code).join("\n");

  if (!data && algorithmId) {
    const name = algorithmId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const algoMeta = getAlgorithmById(algorithmId);
    data = {
      title: name,
      tagline: `Learn the concepts, complexity constraints, and execution patterns of ${name}.`,
      intuition: `This algorithm performs operations efficiently. It organizes nodes/elements, checks boundary conditions, and outputs results in ${algoMeta?.complexity?.time || "optimal"} time complexity.`,
      analogy: `Think of searching for a keyword in a dictionary, sorting books on a shelf, or checking paths on a city map.`,
      howItWorks: [
        "Initialize pointer bounds, arrays, or node structures.",
        "Scan or traverse elements to check target constraints.",
        "Perform comparison comparisons and updates in place.",
        "Terminate execution and return calculated output."
      ],
      complexity: {
        best:    { n: algoMeta?.complexity?.time || "O(n)", why: "Optimal conditions met." },
        average: { n: algoMeta?.complexity?.time || "O(n)", why: "Standard distribution." },
        worst:   { n: algoMeta?.complexity?.time || "O(n)", why: "Full boundary scanned." },
        space:   { n: algoMeta?.complexity?.space || "O(1)", why: "Auxiliary space allocations." },
        stable:  null
      },
      use: [
        "Solving standard problems in algorithmic challenges.",
        "Optimizing tasks that require linear or binary scale scans."
      ],
      avoid: [
        "When simpler solutions satisfy time-bound constraints.",
        "If hardware bounds restrict stack recursion depths."
      ],
      memory: "Map indices, draw bounds, and simulate step changes to recall the flow.",
      mistakes: [
        { wrong: "Out of bounds traversal", fix: "Verify indices do not exceed list boundary thresholds." }
      ],
      questions: [
        { name: `LeetCode: Practice Questions relating to ${name}`, url: "https://leetcode.com/problemset/all/" }
      ]
    };
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
        <div className="text-center max-w-sm">
          <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Select an Algorithm</h3>
          <p className="text-slate-500 text-sm">Pick any algorithm from the sidebar to get a complete deep-dive learning guide.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-extrabold font-display mb-1">{data.title}</h2>
              <p className="text-blue-100 text-sm font-medium leading-relaxed">{data.tagline}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Brain size={22} className="text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs text-blue-200 font-medium">Best</div>
              <div className="text-sm font-extrabold font-mono">{data.complexity.best.n}</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-xs text-blue-200 font-medium">Average</div>
              <div className="text-sm font-extrabold font-mono">{data.complexity.average.n}</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-xs text-blue-200 font-medium">Worst</div>
              <div className="text-sm font-extrabold font-mono">{data.complexity.worst.n}</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-xs text-blue-200 font-medium">Space</div>
              <div className="text-sm font-extrabold font-mono">{data.complexity.space.n}</div>
            </div>
            {data.complexity.stable !== null && (
              <>
                <div className="w-px h-8 bg-white/20" />
                <div className="text-center">
                  <div className="text-xs text-blue-200 font-medium">Stable</div>
                  <div className={`text-sm font-extrabold ${data.complexity.stable ? "text-emerald-300" : "text-rose-300"}`}>
                    {data.complexity.stable ? "Yes" : "No"}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Section title="The Intuition" icon={Target} color="#3b82f6">
          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">{data.intuition}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">Real-World Analogy</div>
              <p className="text-sm text-amber-900 leading-relaxed">{data.analogy}</p>
            </div>
          </div>
        </Section>

        <Section title="Step-by-Step: How It Works" icon={ChevronRight} color="#7c3aed">
          <ol className="mt-4 space-y-2">
            {data.howItWorks.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-xs font-bold text-violet-700 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Complexity: The WHY Behind the Numbers" icon={TrendingUp} color="#059669">
          <div className="mt-4 space-y-3">
            {["best", "average", "worst", "space"].map(k => {
              const c = data.complexity[k];
              const meta = DIFF_COLORS[k];
              if (!c) return null;
              return (
                <div key={k} className="rounded-xl border p-4" style={{ backgroundColor: meta.bg, borderColor: meta.border }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.dot }} />
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border capitalize ${meta.badge}`}>{k} case</span>
                    <span className="ml-auto text-sm font-extrabold font-mono text-slate-800">{c.n}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.why}</p>
                </div>
              );
            })}
            {data.complexity.stable !== null && (
              <div className="rounded-xl border p-4 bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  {data.complexity.stable
                    ? <CheckCircle2 size={14} className="text-emerald-600" />
                    : <XCircle size={14} className="text-rose-600" />}
                  <span className="text-xs font-bold text-slate-700">Stability: {data.complexity.stable ? "Stable" : "Not Stable"}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{data.complexity.stableWhy}</p>
              </div>
            )}
          </div>
        </Section>

        <Section title="When to Use / Avoid" icon={Shield} color="#d97706">
          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Use when</span>
              </div>
              <ul className="space-y-1.5">
                {data.use.map((u, i) => (
                  <li key={i} className="text-sm text-emerald-900 flex items-start gap-2">
                    <span className="text-emerald-500 shrink-0 mt-1">•</span>{u}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={14} className="text-rose-600" />
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Avoid when</span>
              </div>
              <ul className="space-y-1.5">
                {data.avoid.map((a, i) => (
                  <li key={i} className="text-sm text-rose-900 flex items-start gap-2">
                    <span className="text-rose-500 shrink-0 mt-1">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section title="Common Mistakes" icon={AlertTriangle} color="#dc2626">
          <div className="mt-4 space-y-3">
            {data.mistakes.map((m, i) => (
              <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-start gap-2 px-4 py-3 bg-rose-50 border-b border-rose-100">
                  <XCircle size={13} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-rose-800">{m.wrong}</p>
                </div>
                <div className="flex items-start gap-2 px-4 py-3 bg-emerald-50">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-900 leading-relaxed">{m.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {displayCode && (
          <Section title="Code Implementation" icon={Code2} color="#2563eb">
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-900 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                <span className="text-xs font-semibold text-slate-300 capitalize">{preferredLanguage} Implementation</span>
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                <code>{displayCode}</code>
              </pre>
            </div>
          </Section>
        )}

        {data.questions && data.questions.length > 0 && (
          <Section title="Recommended Practice Questions" icon={BookOpen} color="#7c3aed">
            <div className="mt-4 space-y-2">
              {data.questions.map((q, i) => (
                <a
                  key={i}
                  href={q.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 rounded-xl transition-all group"
                >
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-violet-700">{q.name}</span>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-violet-600 transition-colors" />
                </a>
              ))}
            </div>
          </Section>
        )}

        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-amber-600" />
            <span className="text-sm font-bold text-amber-900">Memory Trick — Never Forget This</span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed font-medium">{data.memory}</p>
        </div>

      </div>
    </div>
  );
}
