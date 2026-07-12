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

  // ── Stack ──────────────────────────────────────────────────────────────────
  else if (algorithmId === "stack") {
    const ops = [5, 3, 8, 1, 7];
    let stack = [];
    steps.push({ line: 1, description: `🏗️ Create an empty stack. A stack is like a tower of plates — you can only add or remove from the TOP!`, state: { stack: [], operation: null } });
    for (const v of ops) {
      stack = [...stack, v];
      steps.push({ line: 2, description: `📥 PUSH ${v} onto the stack. It sits on TOP of all previous items. Stack top = ${v}`, state: { stack: [...stack], operation: "push", value: v } });
    }
    steps.push({ line: 3, description: `🔍 PEEK at top element = ${stack[stack.length - 1]}. We look without removing.`, state: { stack: [...stack], operation: "peek", value: stack[stack.length - 1] } });
    const popped = stack.pop();
    steps.push({ line: 4, description: `📤 POP removes the top element = ${popped}. It leaves the stack. Stack size is now ${stack.length}.`, state: { stack: [...stack], operation: "pop", value: popped } });
    steps.push({ line: 5, description: `✅ Stack operations complete! Remaining items: [${stack.join(", ")}]`, state: { stack: [...stack], operation: null } });
  }

  // ── Queue ──────────────────────────────────────────────────────────────────
  else if (algorithmId === "queue") {
    const ops = [10, 20, 30, 40];
    let queue = [];
    steps.push({ line: 1, description: `🏗️ Create an empty queue. A queue is like a line at a ticket counter — first to join is first to leave!`, state: { queue: [], operation: null } });
    for (const v of ops) {
      queue = [...queue, v];
      steps.push({ line: 2, description: `➕ ENQUEUE ${v}. It joins at the REAR (end of line). Queue is now: [${queue.join(" → ")}]`, state: { queue: [...queue], operation: "enqueue", value: v } });
    }
    const front = queue.shift();
    steps.push({ line: 3, description: `➖ DEQUEUE removes ${front} from the FRONT. It was first to arrive, first to leave! Remaining: [${queue.join(" → ")}]`, state: { queue: [...queue], operation: "dequeue", value: front } });
    steps.push({ line: 4, description: `✅ Queue operations complete! Front = ${queue[0]}, Rear = ${queue[queue.length - 1]}, Size = ${queue.length}`, state: { queue: [...queue], operation: null } });
  }

  // ── Min Stack ─────────────────────────────────────────────────────────────
  else if (algorithmId === "min-stack") {
    const ops = [5, 3, 8, 2, 7];
    let stack = [], minStack = [];
    steps.push({ line: 1, description: `🏗️ Create Min Stack. Uses TWO stacks: one for values, one to track minimum at each level.`, state: { stack: [], operation: null } });
    for (const v of ops) {
      stack = [...stack, v];
      const newMin = minStack.length === 0 ? v : Math.min(minStack[minStack.length - 1], v);
      minStack = [...minStack, newMin];
      steps.push({ line: 2, description: `📥 PUSH ${v}. Current min at this level = ${newMin}. MinStack tracks: [${minStack.join(", ")}]`, state: { stack: [...stack], min_stack: [...minStack], operation: "push", value: v, current_min: newMin } });
    }
    steps.push({ line: 3, description: `🔍 getMin() = ${minStack[minStack.length - 1]}. Retrieved in O(1) — no searching needed!`, state: { stack: [...stack], min_stack: [...minStack], current_min: minStack[minStack.length - 1] } });
  }

  // ── Linked List ────────────────────────────────────────────────────────────
  else if (algorithmId === "linked-list") {
    const values = [10, 20, 30, 40, 50];
    let list = [];
    steps.push({ line: 1, description: `🚂 Start building a Singly Linked List. Think of a train: each car (node) links to the NEXT car via a pointer!`, state: { list: [] } });
    for (let i = 0; i < values.length; i++) {
      list = [...list, values[i]];
      steps.push({ line: 2, description: `🔗 Append node with value ${values[i]}. ${i === 0 ? "This is the HEAD (first node)." : `Connected from node ${values[i-1]} → ${values[i]}.`} Tail = ${values[i]}`, state: { list: [...list], current: i, head: 0, tail: i } });
    }
    steps.push({ line: 5, description: `✅ List complete: HEAD[${list.join(" → ")}]→NULL. Length = ${list.length}`, state: { list: [...list], head: 0, tail: list.length - 1 } });
    // Traverse
    for (let i = 0; i < list.length; i++) {
      steps.push({ line: 7, description: `🔍 Traversing node ${i}: value = ${list[i]}. ${i < list.length - 1 ? `Move to next node →` : "Reached NULL. Traversal complete!"}`, state: { list: [...list], current: i, head: 0, tail: list.length - 1 } });
    }
  }

  // ── Doubly Linked List ────────────────────────────────────────────────────
  else if (algorithmId === "doubly-linked-list") {
    const values = [1, 2, 3, 4, 5];
    let list = [];
    steps.push({ line: 1, description: `🚂↔️ Doubly Linked List: each node has BOTH a .next and a .prev pointer — you can walk forward AND backward!`, state: { list: [] } });
    for (let i = 0; i < values.length; i++) {
      list = [...list, values[i]];
      steps.push({ line: 2, description: `🔗 Append ${values[i]}. ${i > 0 ? `Node ${values[i-1]}.next = ${values[i]} AND node ${values[i]}.prev = ${values[i-1]}` : "HEAD set to " + values[i]}`, state: { list: [...list], current: i } });
    }
    steps.push({ line: 5, description: `⬅️ Traverse backward from TAIL: ${[...list].reverse().join(" ← ")}`, state: { list: [...list], current: list.length - 1 } });
  }

  // ── Floyd's Cycle Detection ────────────────────────────────────────────────
  else if (algorithmId === "floyd-cycle") {
    const arr = [3, 1, 4, 2, 0, 3]; // index-based cycle: node 5 → node 3
    let slow = 0, fast = 0;
    steps.push({ line: 1, description: `🐢⚡ Floyd's Cycle Detection uses TWO pointers: SLOW (moves 1 step) and FAST (moves 2 steps). If there's a cycle, they MUST meet!`, state: { list: arr, slow: 0, fast: 0 } });
    for (let round = 0; round < 6; round++) {
      if (fast >= arr.length || arr[fast] >= arr.length) break;
      slow = arr[slow] ?? slow;
      const nf1 = arr[fast];
      if (nf1 === undefined || nf1 >= arr.length) break;
      fast = arr[nf1] ?? fast;
      steps.push({ line: 3, description: `Round ${round+1}: 🐢 SLOW at node ${slow}, ⚡ FAST at node ${fast}. ${slow === fast ? "🎯 COLLISION! Cycle detected!" : "Not met yet..."}`, state: { list: arr, slow, fast, hasCycle: slow === fast } });
      if (slow === fast) break;
    }
  }

  // ── LRU Cache ─────────────────────────────────────────────────────────────
  else if (algorithmId === "lru-cache") {
    const capacity = 3;
    let cache = {};
    let order = [];
    steps.push({ line: 1, description: `🗄️ Create LRU Cache with capacity = ${capacity}. LRU = Least Recently Used. Old unused items get evicted first!`, state: { cache: {}, order: [] } });
    const ops = [["put", 1, 10], ["put", 2, 20], ["put", 3, 30], ["get", 1], ["put", 4, 40], ["get", 2]];
    for (const op of ops) {
      if (op[0] === "put") {
        const [, key, val] = op;
        if (key in cache) { order = order.filter(k => k !== key); }
        else if (Object.keys(cache).length >= capacity) {
          const evict = order.shift();
          delete cache[evict];
          steps.push({ line: 5, description: `⚠️ Cache full! Evict LRU key=${evict} (least recently used). Make room for key=${key}.`, state: { cache: {...cache}, order: [...order] } });
        }
        cache[key] = val;
        order.push(key);
        steps.push({ line: 4, description: `📥 PUT(key=${key}, val=${val}). Cache: {${Object.entries(cache).map(([k,v])=>`${k}:${v}`).join(", ")}}. Access order: [${order.join("→")}]`, state: { cache: {...cache}, order: [...order] } });
      } else {
        const [, key] = op;
        const result = cache[key] ?? -1;
        if (key in cache) { order = order.filter(k => k !== key); order.push(key); }
        steps.push({ line: 3, description: `🔍 GET(key=${key}) = ${result}. ${result !== -1 ? `Move key=${key} to MOST recently used position.` : "Key not found!"}. Order: [${order.join("→")}]`, state: { cache: {...cache}, order: [...order] } });
      }
    }
  }

  // ── Circular Queue ─────────────────────────────────────────────────────────
  else if (algorithmId === "circular-queue") {
    const size = 4;
    let q = new Array(size).fill(null);
    let head = -1, tail = -1;
    steps.push({ line: 1, description: `⭕ Create Circular Queue with size ${size}. A circular queue reuses empty slots — super space-efficient!`, state: { queue: [...q] } });
    const ops = [10, 20, 30, 40];
    for (let i = 0; i < ops.length; i++) {
      if (head === -1) head = 0;
      tail = (tail + 1) % size;
      q[tail] = ops[i];
      steps.push({ line: 3, description: `ENQUEUE ${ops[i]}. Tail moves to index ${tail} (wraps around circularly). Queue: [${q.map(x => x === null ? "_" : x).join(", ")}]`, state: { queue: [...q], head_idx: head, tail_idx: tail, operation: "enqueue", value: ops[i] } });
    }
    const removed = q[head];
    q[head] = null;
    const prevHead = head;
    head = (head + 1) % size;
    steps.push({ line: 5, description: `DEQUEUE removes ${removed} from head index ${prevHead}. Head moves to ${head}. Queue: [${q.map(x => x === null ? "_" : x).join(", ")}]`, state: { queue: [...q], head_idx: head, tail_idx: tail, operation: "dequeue", value: removed } });
  }

  // ── Jump Search ───────────────────────────────────────────────────────────
  else if (algorithmId === "jump-search") {
    const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    const target = 13;
    const n = arr.length;
    const jump = Math.floor(Math.sqrt(n));
    steps.push({ line: 1, description: `🦘 Start Jump Search! Target = ${target}. Array length = ${n}. Jump step = √${n} ≈ ${jump}`, state: { array: [...arr], target, jump } });
    let prev = 0, curr = jump;
    while (curr < n && arr[curr] <= target) {
      steps.push({ line: 3, description: `🦘 Jump! Check index ${curr} (val ${arr[curr]}). ${arr[curr] <= target ? `${arr[curr]} ≤ ${target} → Jump again!` : "Overshot!"}`, state: { array: [...arr], target, check_idx: curr, left: prev, right: Math.min(curr, n-1) } });
      prev = curr;
      curr += jump;
    }
    steps.push({ line: 5, description: `🔍 Now do LINEAR SEARCH from index ${prev} to ${Math.min(curr, n-1)}`, state: { array: [...arr], target, left: prev, right: Math.min(curr, n-1) } });
    for (let i = prev; i <= Math.min(curr, n-1); i++) {
      if (arr[i] === target) {
        steps.push({ line: 6, description: `🎯 FOUND! arr[${i}] = ${arr[i]} = target ${target}!`, state: { array: [...arr], target, check_idx: i, result: i } });
        break;
      }
      steps.push({ line: 6, description: `Check index ${i} (val ${arr[i]}) ≠ ${target}. Move forward.`, state: { array: [...arr], target, check_idx: i } });
    }
  }

  // ── Exponential Search ────────────────────────────────────────────────────
  else if (algorithmId === "exponential-search") {
    const arr = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
    const target = 64;
    steps.push({ line: 1, description: `📈 Exponential Search! Find target = ${target}. First find the RANGE, then binary search within it.`, state: { array: [...arr], target } });
    if (arr[0] === target) {
      steps.push({ line: 2, description: `🎯 Found at index 0!`, state: { array: [...arr], target, check_idx: 0, result: 0 } });
    } else {
      let bound = 1;
      while (bound < arr.length && arr[bound] <= target) {
        steps.push({ line: 3, description: `🔢 Check bound = ${bound}, arr[${bound}] = ${arr[bound]}. ${arr[bound] <= target ? "Too small, double bound!" : "Overshot! Binary search in [" + Math.floor(bound/2) + ", " + Math.min(bound, arr.length-1) + "]"}`, state: { array: [...arr], target, check_idx: bound } });
        bound *= 2;
      }
      let low = Math.floor(bound / 2), high = Math.min(bound, arr.length - 1);
      steps.push({ line: 5, description: `🎯 Binary search in range [${low}, ${high}]`, state: { array: [...arr], target, left: low, right: high } });
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        steps.push({ line: 6, description: `Binary step: mid=${mid} → arr[${mid}]=${arr[mid]}. ${arr[mid] === target ? "🎯 FOUND!" : arr[mid] < target ? "Go right" : "Go left"}`, state: { array: [...arr], target, left: low, right: high, check_idx: mid } });
        if (arr[mid] === target) { steps.push({ line: 7, description: `🎯 Target ${target} found at index ${mid}!`, state: { array: [...arr], target, check_idx: mid, result: mid } }); break; }
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
      }
    }
  }

  // ── Next Permutation ──────────────────────────────────────────────────────
  else if (algorithmId === "next-permutation") {
    let nums = [1, 2, 3, 5, 4];
    steps.push({ line: 1, description: `🔢 Next Permutation of [${nums.join(", ")}]. Find the next lexicographically greater arrangement!`, state: { array: [...nums] } });
    let i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
      steps.push({ line: 2, description: `🔍 Scan right-to-left: nums[${i}]=${nums[i]} ≥ nums[${i+1}]=${nums[i+1]}. Move left...`, state: { array: [...nums], check_idx: i } });
      i--;
    }
    if (i >= 0) {
      steps.push({ line: 4, description: `📍 Found pivot at index ${i} (val=${nums[i]}). Now find smallest element > ${nums[i]} from the right.`, state: { array: [...nums], check_idx: i, left: i } });
      let j = nums.length - 1;
      while (nums[j] <= nums[i]) j--;
      steps.push({ line: 5, description: `🔄 Swap nums[${i}]=${nums[i]} with nums[${j}]=${nums[j]}`, state: { array: [...nums], left: i, right: j } });
      [nums[i], nums[j]] = [nums[j], nums[i]];
      steps.push({ line: 5, description: `After swap: [${nums.join(", ")}]`, state: { array: [...nums] } });
    }
    let l = i + 1, r = nums.length - 1;
    while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; }
    steps.push({ line: 7, description: `✅ Reverse suffix after pivot. Next Permutation = [${nums.join(", ")}]`, state: { array: [...nums] } });
  }

  // ── Best Time to Buy and Sell Stock ───────────────────────────────────────
  else if (algorithmId === "best-time-stock") {
    const prices = [7, 1, 5, 3, 6, 4];
    let minPrice = Infinity, maxProfit = 0;
    steps.push({ line: 1, description: `📈 Best Time to Buy/Sell Stock! Prices: [${prices.join(", ")}]. Find max profit with ONE buy and ONE sell.`, state: { array: [...prices] } });
    for (let i = 0; i < prices.length; i++) {
      const p = prices[i];
      const oldMin = minPrice;
      minPrice = Math.min(minPrice, p);
      const profit = p - minPrice;
      maxProfit = Math.max(maxProfit, profit);
      steps.push({
        line: 3, description: `Day ${i}: price = $${p}. ${p < oldMin ? `🛒 New best BUY price = $${p}!` : `💰 If sold today: profit = $${p} - $${minPrice} = $${profit}`}. Max profit so far = $${maxProfit}`,
        state: { array: [...prices], check_idx: i, min_price: minPrice, max_profit: maxProfit, profit }
      });
    }
    steps.push({ line: 8, description: `✅ Best profit = $${maxProfit}! Buy at $${minPrice} and sell at the optimal peak.`, state: { array: [...prices], max_profit: maxProfit } });
  }

  // ── Jump Game ──────────────────────────────────────────────────────────────
  else if (algorithmId === "jump-game") {
    const nums = [2, 3, 1, 1, 4];
    let maxReach = 0;
    steps.push({ line: 1, description: `🐸 Jump Game! Array = [${nums.join(", ")}]. Each value tells you the MAXIMUM jump length from that position. Can you reach the last index?`, state: { array: [...nums] } });
    let reachable = true;
    for (let i = 0; i < nums.length; i++) {
      if (i > maxReach) { reachable = false; steps.push({ line: 3, description: `❌ Index ${i} is UNREACHABLE (i=${i} > maxReach=${maxReach}). We're stuck!`, state: { array: [...nums], check_idx: i, max_reach: maxReach, reachable: false } }); break; }
      const reach = i + nums[i];
      maxReach = Math.max(maxReach, reach);
      steps.push({ line: 2, description: `🐸 At index ${i} (val=${nums[i]}): can jump to index ${reach}. Max reachable index = ${maxReach}`, state: { array: [...nums], check_idx: i, max_reach: maxReach, reachable: true } });
    }
    if (reachable) steps.push({ line: 5, description: `✅ YES! We can reach the last index ${nums.length - 1}! Max reach = ${maxReach}`, state: { array: [...nums], max_reach: maxReach, result: true } });
  }

  // ── Linear Search ─────────────────────────────────────────────────────────
  else if (algorithmId === "linear") {
    const arr = input.arr || [4, 8, 15, 16, 23, 42];
    const target = input.target || 23;
    steps.push({ line: 1, description: "🔍 Start Linear Search! Array: [" + arr.join(", ") + "], target = " + target, state: { array: [...arr], target } });
    let foundIdx = -1;
    for (let i = 0; i < arr.length; i++) {
      steps.push({ line: 3, description: "Checking element at index " + i + " (value " + arr[i] + "). Does it match target " + target + "?", state: { array: [...arr], target, check_idx: i } });
      if (arr[i] === target) {
        foundIdx = i;
        steps.push({ line: 4, description: "🎯 Found! arr[" + i + "] matches target " + target + "!", state: { array: [...arr], target, check_idx: i, result: i } });
        break;
      }
    }
    if (foundIdx === -1) {
      steps.push({ line: 6, description: "❌ Completed scan. Target " + target + " not found in array.", state: { array: [...arr], target, result: -1 } });
    }
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
