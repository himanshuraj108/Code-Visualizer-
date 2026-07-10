export function generateGenericSteps(algorithmId, input = {}) {
  const steps = [];

  if (algorithmId === "sliding-window") {
    const arr = input.arr || [2, 1, 5, 1, 3, 2];
    const k = input.k || 3;
    const n = arr.length;
    steps.push({ line: 1, description: `Start Sliding Window. Array: [${arr.join(", ")}], window size k = ${k}`, state: { array: [...arr], k, n } });
    let window_sum = 0;
    for (let i = 0; i < k; i++) window_sum += arr[i];
    steps.push({ line: 3, description: `Initialize first window sum (first ${k} elements): ${arr.slice(0, k).join(" + ")} = ${window_sum}`, state: { array: [...arr], k, n, window_sum } });
    let max_sum = window_sum;
    steps.push({ line: 4, description: `Set initial max_sum to first window sum = ${max_sum}`, state: { array: [...arr], k, n, window_sum, max_sum } });
    for (let i = 0; i < n - k; i++) {
      steps.push({ line: 5, description: `Slide window. Current index i = ${i}`, state: { array: [...arr], k, n, window_sum, max_sum, i } });
      const nextVal = arr[i + k];
      const prevVal = arr[i];
      window_sum += nextVal - prevVal;
      steps.push({ line: 6, description: `Add next value arr[${i + k}] (${nextVal}) and subtract previous value arr[${i}] (${prevVal}). New window sum = ${window_sum}`, state: { array: [...arr], k, n, window_sum, max_sum, i } });
      const updated = window_sum > max_sum;
      max_sum = Math.max(max_sum, window_sum);
      steps.push({ line: 7, description: updated ? `New window sum (${window_sum}) > max_sum. Update max_sum = ${max_sum}` : `New window sum (${window_sum}) <= max_sum (${max_sum}). Keep max_sum = ${max_sum}`, state: { array: [...arr], k, n, window_sum, max_sum, i } });
    }
    steps.push({ line: 8, description: `Finished sliding window. Maximum sum subarray of size ${k} is ${max_sum}`, state: { array: [...arr], k, n, window_sum, max_sum } });
  }

  else if (algorithmId === "two-pointers") {
    const arr = input.arr || [2, 3, 5, 6, 8, 10];
    const target = input.target || 9;
    const n = arr.length;
    steps.push({ line: 1, description: `Start Two Pointers. Target sum = ${target}`, state: { array: [...arr], target } });
    let left = 0, right = n - 1;
    steps.push({ line: 2, description: `Initialize left pointer at index 0 (val ${arr[left]}) and right pointer at index ${right} (val ${arr[right]})`, state: { array: [...arr], target, left, right } });
    while (left < right) {
      steps.push({ line: 3, description: `Loop check: left index ${left} < right index ${right}`, state: { array: [...arr], target, left, right } });
      const curr_sum = arr[left] + arr[right];
      steps.push({ line: 4, description: `Compute current sum: arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${curr_sum}`, state: { array: [...arr], target, left, right, curr_sum } });
      steps.push({ line: 5, description: `Check if sum matches target: ${curr_sum} == ${target}`, state: { array: [...arr], target, left, right, curr_sum } });
      if (curr_sum === target) {
        steps.push({ line: 6, description: `Sum matches target! Found pair at indices [${left}, ${right}] with values [${arr[left]}, ${arr[right]}]`, state: { array: [...arr], target, left, right, curr_sum, result: [left, right] } });
        break;
      } else if (curr_sum < target) {
        steps.push({ line: 7, description: `Sum ${curr_sum} < target ${target}. Shift left pointer to increase sum.`, state: { array: [...arr], target, left, right, curr_sum } });
        left++;
        steps.push({ line: 8, description: `Moved left pointer to index ${left} (val ${arr[left]})`, state: { array: [...arr], target, left, right, curr_sum } });
      } else {
        steps.push({ line: 9, description: `Sum ${curr_sum} > target ${target}. Shift right pointer to decrease sum.`, state: { array: [...arr], target, left, right, curr_sum } });
        right--;
        steps.push({ line: 10, description: `Moved right pointer to index ${right} (val ${arr[right]})`, state: { array: [...arr], target, left, right, curr_sum } });
      }
    }
  }

  else if (algorithmId === "prefix-sum") {
    const arr = input.arr || [4, 2, 7, 1, 3];
    const n = arr.length;
    steps.push({ line: 1, description: `Start Prefix Sum. Array: [${arr.join(", ")}]`, state: { array: [...arr] } });
    const prefix = new Array(n + 1).fill(0);
    steps.push({ line: 3, description: `Initialize prefix sum array of size ${n + 1} with zeros`, state: { array: [...arr], prefix: [...prefix] } });
    for (let i = 0; i < n; i++) {
      steps.push({ line: 4, description: `Process index i = ${i} (value ${arr[i]})`, state: { array: [...arr], prefix: [...prefix], i } });
      prefix[i + 1] = prefix[i] + arr[i];
      steps.push({ line: 5, description: `Compute prefix[${i + 1}] = prefix[${i}] (${prefix[i]}) + arr[${i}] (${arr[i]}) = ${prefix[i + 1]}`, state: { array: [...arr], prefix: [...prefix], i } });
    }
    steps.push({ line: 6, description: `Prefix sum array completed: [${prefix.join(", ")}]`, state: { array: [...arr], prefix: [...prefix] } });
  }

  else if (algorithmId === "kadane") {
    const arr = input.arr || [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    const n = arr.length;
    steps.push({ line: 1, description: `Start Kadane's Algorithm. Find maximum contiguous subarray sum.`, state: { array: [...arr] } });
    let max_so_far = arr[0];
    steps.push({ line: 2, description: `Initialize global max_so_far to first element = ${max_so_far}`, state: { array: [...arr], max_so_far } });
    let curr_max = arr[0];
    steps.push({ line: 2, description: `Initialize local curr_max to first element = ${curr_max}`, state: { array: [...arr], max_so_far, curr_max } });
    for (let i = 1; i < n; i++) {
      const val = arr[i];
      steps.push({ line: 3, description: `Scan element arr[${i}] = ${val}`, state: { array: [...arr], max_so_far, curr_max, i, val } });
      const startNew = val > curr_max + val;
      curr_max = Math.max(val, curr_max + val);
      steps.push({ line: 4, description: startNew ? `Subarray restarts at index ${i} (val ${val} > previous sum + ${val})` : `Extend subarray sum to ${curr_max}`, state: { array: [...arr], max_so_far, curr_max, i, val } });
      const updated = curr_max > max_so_far;
      max_so_far = Math.max(max_so_far, curr_max);
      steps.push({ line: 5, description: updated ? `Update global max_so_far = ${max_so_far}` : `Keep global max_so_far = ${max_so_far}`, state: { array: [...arr], max_so_far, curr_max, i, val } });
    }
    steps.push({ line: 6, description: `Kadane complete. Max sum is ${max_so_far}`, state: { array: [...arr], max_so_far, curr_max } });
  }

  else if (algorithmId === "dutch-national-flag") {
    const arr = [2, 0, 1, 1, 2, 0];
    const n = arr.length;
    steps.push({ line: 1, description: `Start Dutch National Flag. Input array: [${arr.join(", ")}]`, state: { array: [...arr] } });
    let low = 0, mid = 0, high = n - 1;
    steps.push({ line: 2, description: `Pointers initialized: low = 0, mid = 0, high = ${high}`, state: { array: [...arr], low, mid, high } });
    while (mid <= high) {
      steps.push({ line: 3, description: `Loop check: mid (${mid}) <= high (${high})`, state: { array: [...arr], low, mid, high } });
      const val = arr[mid];
      if (val === 0) {
        steps.push({ line: 4, description: `arr[mid] is 0. Swap arr[low] and arr[mid]`, state: { array: [...arr], low, mid, high, val } });
        [arr[low], arr[mid]] = [arr[mid], arr[low]];
        low++; mid++;
        steps.push({ line: 5, description: `Swapped. Increment low to ${low}, mid to ${mid}`, state: { array: [...arr], low, mid, high } });
      } else if (val === 1) {
        mid++;
        steps.push({ line: 6, description: `arr[mid] is 1. Increment mid to ${mid}`, state: { array: [...arr], low, mid, high, val } });
      } else {
        steps.push({ line: 7, description: `arr[mid] is 2. Swap arr[mid] and arr[high]`, state: { array: [...arr], low, mid, high, val } });
        [arr[mid], arr[high]] = [arr[high], arr[mid]];
        high--;
        steps.push({ line: 8, description: `Swapped. Decrement high to ${high}`, state: { array: [...arr], low, mid, high } });
      }
    }
    steps.push({ line: 9, description: `Sorted! Final array: [${arr.join(", ")}]`, state: { array: [...arr] } });
  }

  else if (algorithmId === "moores-voting") {
    const arr = [2, 2, 1, 1, 1, 2, 2];
    steps.push({ line: 1, description: `Start Moore's Voting. Find majority element.`, state: { array: [...arr] } });
    let candidate = null, count = 0;
    steps.push({ line: 2, description: `Initialize candidate = None, count = 0`, state: { array: [...arr], candidate: "None", count } });
    for (let idx = 0; idx < arr.length; idx++) {
      const num = arr[idx];
      steps.push({ line: 3, description: `Scan num = ${num} at index ${idx}`, state: { array: [...arr], candidate: candidate ?? "None", count, idx, num } });
      if (count === 0) {
        candidate = num;
        steps.push({ line: 4, description: `Count is 0. Set new candidate = ${candidate}`, state: { array: [...arr], candidate, count, idx } });
      }
      if (num === candidate) count++;
      else count--;
      steps.push({ line: 5, description: num === candidate ? `num matches candidate. Increment count to ${count}` : `num mismatch. Decrement count to ${count}`, state: { array: [...arr], candidate, count, idx } });
    }
    steps.push({ line: 6, description: `Finished voting. Majority candidate is ${candidate}`, state: { array: [...arr], candidate, count } });
  }

  else if (algorithmId === "floyd-cycle") {
    steps.push({ line: 1, description: `Start Floyd's Cycle Detection. Tortoise (slow) & Hare (fast) pointers.`, state: { list: "A -> B -> C -> D -> B (loop)" } });
    let slow = 0, fast = 0; // Indexes on representation: A(0), B(1), C(2), D(3)
    const nodes = ["A", "B", "C", "D"];
    steps.push({ line: 2, description: `Initialize slow and fast pointers at Node A`, state: { slow: "A", fast: "A" } });
    // Simulate steps
    steps.push({ line: 3, description: `Tortoise moves 1 step (A -> B). Hare moves 2 steps (A -> C).`, state: { slow: "B", fast: "C" } });
    steps.push({ line: 4, description: `Tortoise moves 1 step (B -> C). Hare moves 2 steps (C -> B).`, state: { slow: "C", fast: "B" } });
    steps.push({ line: 5, description: `Tortoise moves 1 step (C -> D). Hare moves 2 steps (B -> D). Pointers meet!`, state: { slow: "D", fast: "D", meet: "true" } });
    steps.push({ line: 6, description: `Pointers met! Cycle detected successfully.`, state: { slow: "D", fast: "D" } });
  }

  else if (algorithmId === "merge-intervals") {
    const intervals = [[1, 3], [2, 6], [8, 10]];
    steps.push({ line: 1, description: `Start Merge Intervals. Input: [[1, 3], [2, 6], [8, 10]]`, state: { intervals: "[[1,3], [2,6], [8,10]]" } });
    steps.push({ line: 2, description: `Sort intervals by start times.`, state: { intervals: "[[1,3], [2,6], [8,10]]" } });
    const merged = [[1, 3]];
    steps.push({ line: 3, description: `Initialize merged list with first interval: [[1, 3]]`, state: { merged: "[[1,3]]" } });
    // Compare next
    steps.push({ line: 4, description: `Compare next interval [2, 6] with last merged [1, 3]. Overlap check: 2 <= 3`, state: { current: "[2,6]", last_merged: "[1,3]" } });
    merged[0][1] = 6;
    steps.push({ line: 5, description: `Overlap found! Merge them by taking max end time: [1, max(3, 6)] -> [1, 6]`, state: { merged: "[[1,6]]" } });
    steps.push({ line: 4, description: `Compare next interval [8, 10] with last merged [1, 6]. Overlap check: 8 <= 6`, state: { current: "[8,10]", last_merged: "[1,6]" } });
    merged.push([8, 10]);
    steps.push({ line: 6, description: `No overlap (8 > 6). Append [8, 10] to merged list.`, state: { merged: "[[1,6], [8,10]]" } });
  }

  else if (algorithmId === "stack") {
    const ops = ["push(10)", "push(20)", "pop()", "push(30)"];
    const items = [];
    steps.push({ line: 2, description: `Initialize empty Stack representation`, state: { stack: [] } });
    for (const op of ops) {
      if (op.startsWith("push")) {
        const val = parseInt(op.match(/\d+/)[0]);
        items.push(val);
        steps.push({ line: 5, description: `Push ${val} onto the Stack. Elements are appended to top.`, state: { stack: [...items], operation: op } });
      } else {
        const val = items.pop();
        steps.push({ line: 7, description: `Pop item from top of Stack: removed ${val} (LIFO)`, state: { stack: [...items], operation: op, popped_value: val } });
      }
    }
  }

  else if (algorithmId === "queue") {
    const ops = ["enqueue(10)", "enqueue(20)", "dequeue()", "enqueue(30)"];
    const items = [];
    steps.push({ line: 2, description: `Initialize empty Queue representation`, state: { queue: [] } });
    for (const op of ops) {
      if (op.startsWith("enqueue")) {
        const val = parseInt(op.match(/\d+/)[0]);
        items.push(val);
        steps.push({ line: 5, description: `Enqueue ${val} at the rear of the queue.`, state: { queue: [...items], operation: op } });
      } else {
        const val = items.shift();
        steps.push({ line: 7, description: `Dequeue item from front of queue: removed ${val} (FIFO)`, state: { queue: [...items], operation: op, dequeued_value: val } });
      }
    }
  }

  else if (algorithmId === "linked-list") {
    const values = [10, 20, 30];
    const nodes = [];
    steps.push({ line: 5, description: `Initialize Singly Linked List`, state: { list: "None" } });
    for (let i = 0; i < values.length; i++) {
      const val = values[i];
      nodes.push(val);
      const listStr = nodes.join(" -> ") + " -> None";
      steps.push({ line: 7, description: `Create new node containing value ${val}`, state: { list: listStr, new_node: val } });
      steps.push({ line: 13, description: `Traverse and append node ${val} to tail`, state: { list: listStr } });
    }
  }

  else if (algorithmId === "circular-queue") {
    const k = 3;
    const queue = new Array(k).fill(null);
    steps.push({ line: 2, description: `Initialize Circular Queue of capacity ${k}. head = tail = -1`, state: { queue: "[Null, Null, Null]", head: -1, tail: -1 } });
    // Enqueue 10
    queue[0] = 10;
    steps.push({ line: 4, description: `Enqueue 10. Set head = 0, tail = 0`, state: { queue: "[10, Null, Null]", head: 0, tail: 0 } });
    // Enqueue 20
    queue[1] = 20;
    steps.push({ line: 4, description: `Enqueue 20. Move tail to 1`, state: { queue: "[10, 20, Null]", head: 0, tail: 1 } });
  }

  else if (algorithmId === "lru-cache") {
    steps.push({ line: 2, description: `Initialize LRU Cache with capacity = 2.`, state: { cache: "{}", order: "[]" } });
    steps.push({ line: 3, description: `Put (key: 1, val: 10). Add to cache.`, state: { cache: "{1: 10}", order: "[1]" } });
    steps.push({ line: 3, description: `Put (key: 2, val: 20). Add to cache.`, state: { cache: "{1: 10, 2: 20}", order: "[2, 1]" } });
    steps.push({ line: 3, description: `Get key 1. Cache hit. Move key 1 to most recently used.`, state: { cache: "{1: 10, 2: 20}", order: "[1, 2]" } });
  }

  else if (algorithmId === "counting-sort") {
    const arr = [4, 1, 3, 1, 3];
    steps.push({ line: 1, description: `Start Counting Sort. Array: [${arr.join(", ")}]`, state: { array: [...arr] } });
    const count = [0, 0, 0, 0, 0];
    steps.push({ line: 3, description: `Initialize counts array: [0, 0, 0, 0, 0]`, state: { array: [...arr], count: [...count] } });
    for (let i = 0; i < arr.length; i++) {
      count[arr[i]]++;
      steps.push({ line: 5, description: `Increment count for value ${arr[i]}`, state: { array: [...arr], count: [...count] } });
    }
  }

  else if (algorithmId === "radix-sort") {
    const arr = [170, 45, 75, 90, 802, 24, 2, 66];
    steps.push({ line: 1, description: `Start Radix Sort. Input: [170, 45, 75, 90, 802, 24, 2, 66]`, state: { array: [...arr] } });
    steps.push({ line: 4, description: `Sort by units digit (1s place)`, state: { array: [170, 90, 802, 2, 24, 45, 75, 66] } });
    steps.push({ line: 4, description: `Sort by tens digit (10s place)`, state: { array: [802, 2, 24, 45, 66, 170, 75, 90] } });
    steps.push({ line: 4, description: `Sort by hundreds digit (100s place)`, state: { array: [2, 24, 45, 66, 75, 90, 170, 802] } });
  }

  else if (algorithmId === "ternary-search") {
    const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17];
    const target = 13;
    steps.push({ line: 1, description: `Start Ternary Search. Find target 13 in [1, 3, 5, 7, 9, 11, 13, 15, 17]`, state: { array: [...arr], target } });
    steps.push({ line: 3, description: `Split search space. mid1 = 2 (val 5), mid2 = 6 (val 13)`, state: { array: [...arr], target, mid1: 2, mid2: 6 } });
    steps.push({ line: 5, description: `Target matches mid2! Return index 6.`, state: { array: [...arr], target, mid1: 2, mid2: 6, match: 6 } });
  }

  else if (algorithmId === "trie") {
    const words = ["cat", "car"];
    steps.push({ line: 6, description: `Initialize empty Trie root`, state: { trie: "Root" } });
    for (const word of words) {
      let currentPath = "Root";
      for (let j = 0; j < word.length; j++) {
        const char = word[j];
        currentPath += ` -> ${char}`;
        steps.push({ line: 9, description: `Check character '${char}' in Trie path`, state: { trie: currentPath, char, word } });
        steps.push({ line: 11, description: `Traverse down Trie node key '${char}'`, state: { trie: currentPath, word } });
      }
      steps.push({ line: 12, description: `Mark end of word for "${word}"`, state: { trie: currentPath, is_word: true } });
    }
  }

  else if (algorithmId === "segment") {
    const arr = [1, 3, 5, 7];
    const n = arr.length;
    const tree = new Array(2 * n).fill(0);
    steps.push({ line: 1, description: `Start Segment Tree build for input array: [${arr.join(", ")}]`, state: { array: [...arr], tree: [...tree] } });
    function build(start, end, node) {
      if (start === end) {
        tree[node] = arr[start];
        steps.push({ line: 3, description: `Leaf Node [${start}, ${end}]: set segmentTree[node ${node}] = ${arr[start]}`, state: { array: [...arr], tree: [...tree], node, start, end } });
        return;
      }
      const mid = Math.floor((start + end) / 2);
      build(start, mid, 2 * node);
      build(mid + 1, end, 2 * node + 1);
      tree[node] = tree[2 * node] + tree[2 * node + 1];
      steps.push({ line: 7, description: `Combine range [${start}, ${end}]: node ${node} = ${tree[node]}`, state: { array: [...arr], tree: [...tree], node, start, end } });
    }
    build(0, n - 1, 1);
  }

  else if (algorithmId === "knapsack") {
    const weights = [2, 3, 4];
    const values = [3, 4, 5];
    const W = 5;
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
    steps.push({ line: 3, description: `Initialize DP table with size ${n+1} x ${W+1}`, state: { dp: dp.map(r => [...r]) } });
    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= W; w++) {
        if (weights[i-1] <= w) {
          dp[i][w] = Math.max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w]);
        } else {
          dp[i][w] = dp[i-1][w];
        }
        steps.push({ line: 5, description: `DP cell [${i}][${w}] = ${dp[i][w]}`, state: { dp: dp.map(r => [...r]), i, w } });
      }
    }
    steps.push({ line: 10, description: `Finished. Max value for capacity ${W} is ${dp[n][W]}`, state: { dp: dp.map(r => [...r]) } });
  }

  if (steps.length === 0) {
    const name = algorithmId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const isSearch = algorithmId.includes("search");
    const isSort = algorithmId.includes("sort");

    if (isSearch) {
      const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
      const target = 23;
      steps.push({ line: 1, description: `Start ${name}. Target element = ${target}`, state: { array: [...arr], target } });
      steps.push({ line: 2, description: `Set boundary bounds. Left = 0, Right = 9`, state: { array: [...arr], target, left: 0, right: 9 } });
      steps.push({ line: 3, description: `Inspecting middle partition index 4 (val 16) < target ${target}. Go right.`, state: { array: [...arr], target, left: 5, right: 9, check_idx: 4 } });
      steps.push({ line: 5, description: `Target found at matching index 5! Value = 23`, state: { array: [...arr], target, left: 5, right: 9, check_idx: 5, found: "true" } });
    } else if (isSort) {
      const arr = [38, 27, 43, 3, 9, 82, 10];
      steps.push({ line: 1, description: `Start ${name}. Unsorted Array: [${arr.join(", ")}]`, state: { array: [...arr] } });
      steps.push({ line: 3, description: `Pass 1: Swap elements out of order. [27, 38, 3, 9, 43, 10, 82]`, state: { array: [27, 38, 3, 9, 43, 10, 82], comparing: [0, 1] } });
      steps.push({ line: 3, description: `Pass 2: Swap elements out of order. [27, 3, 9, 38, 10, 43, 82]`, state: { array: [27, 3, 9, 38, 10, 43, 82], comparing: [1, 2] } });
      steps.push({ line: 3, description: `Pass 3: Shift elements. [3, 9, 10, 27, 38, 43, 82]`, state: { array: [3, 9, 10, 27, 38, 43, 82], comparing: [3, 4] } });
      steps.push({ line: 5, description: `Sorted! Final output array: [3, 9, 10, 27, 38, 43, 82]`, state: { array: [3, 9, 10, 27, 38, 43, 82] } });
    } else {
      steps.push({ line: 1, description: `Initialize execution block for ${name}.`, state: { status: "Active" } });
      const sample = [5, 2, 8, 4];
      steps.push({ line: 2, description: `Scan items. Input structure data: [5, 2, 8, 4]`, state: { status: "Scanning", list: "[5, 2, 8, 4]" } });
      for (let idx = 0; idx < sample.length; idx++) {
        steps.push({ line: 3, description: `Process index ${idx} containing item val ${sample[idx]}`, state: { status: "Processing", idx, val: sample[idx], list: "[5, 2, 8, 4]" } });
      }
      steps.push({ line: 4, description: `${name} process finished successfully.`, state: { status: "Completed" } });
    }
  }

  return steps;
}
