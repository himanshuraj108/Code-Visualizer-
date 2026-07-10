"use client";
export const ALGORITHM_CODES = {
  bubble: {
    python: {
      code: [
        { line: 1, code: "def bubble_sort(arr):",                              annotation: "Define function" },
        { line: 2, code: "    n = len(arr)",                                   annotation: "Get length" },
        { line: 3, code: "    for i in range(n - 1):",                         annotation: "n-1 passes" },
        { line: 4, code: "        for j in range(n - i - 1):",                annotation: "Inner loops scan" },
        { line: 5, code: "            if arr[j] > arr[j + 1]:",               annotation: "Out of order?" },
        { line: 6, code: "                arr[j], arr[j+1] = arr[j+1], arr[j]", annotation: "Swap elements" },
        { line: 7, code: "    return arr",                                      annotation: "Return sorted" }
      ]
    },
    cpp: {
      code: [
        { line: 1, code: "void bubbleSort(vector<int>& arr) {",                 annotation: "Function declaration" },
        { line: 2, code: "    int n = arr.size();",                            annotation: "Get array size" },
        { line: 3, code: "    for (int i = 0; i < n - 1; i++) {",              annotation: "Passes loops" },
        { line: 4, code: "        for (int j = 0; j < n - i - 1; j++) {",      annotation: "Compare bounds" },
        { line: 5, code: "            if (arr[j] > arr[j + 1])",               annotation: "Wrong order?" },
        { line: 6, code: "                swap(arr[j], arr[j + 1]);",          annotation: "Perform swap" },
        { line: 7, code: "    }",                                              annotation: "" },
        { line: 8, code: "}",                                                  annotation: "" }
      ]
    },
    java: {
      code: [
        { line: 1, code: "public void bubbleSort(int[] arr) {",                annotation: "Method definition" },
        { line: 2, code: "    int n = arr.length;",                            annotation: "Get size" },
        { line: 3, code: "    for (int i = 0; i < n - 1; i++) {",              annotation: "Outer pass" },
        { line: 4, code: "        for (int j = 0; j < n - i - 1; j++) {",      annotation: "Inner loops scan" },
        { line: 5, code: "            if (arr[j] > arr[j + 1]) {",             annotation: "Compare items" },
        { line: 6, code: "                int temp = arr[j];",                 annotation: "Swap using temp" },
        { line: 7, code: "                arr[j] = arr[j + 1];",               annotation: "" },
        { line: 8, code: "                arr[j + 1] = temp;",                 annotation: "" },
        { line: 9, code: "            }",                                      annotation: "" },
        { line: 10, code: "        }",                                         annotation: "" },
        { line: 11, code: "    }",                                             annotation: "" },
        { line: 12, code: "}",                                                 annotation: "" }
      ]
    },
    javascript: {
      code: [
        { line: 1, code: "function bubbleSort(arr) {",                          annotation: "Define function" },
        { line: 2, code: "    const n = arr.length;",                          annotation: "Get length" },
        { line: 3, code: "    for (let i = 0; i < n - 1; i++) {",              annotation: "Pass loops" },
        { line: 4, code: "        for (let j = 0; j < n - i - 1; j++) {",      annotation: "Check bounds" },
        { line: 5, code: "            if (arr[j] > arr[j + 1]) {",             annotation: "Compare items" },
        { line: 6, code: "                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];", annotation: "Swap items" },
        { line: 7, code: "            }",                                      annotation: "" },
        { line: 8, code: "        }",                                          annotation: "" },
        { line: 9, code: "    }",                                              annotation: "" },
        { line: 10, code: "    return arr;",                                   annotation: "Return array" },
        { line: 11, code: "}",                                                 annotation: "" }
      ]
    }
  },
  selection: {
    python: {
      code: [
        { line: 1, code: "def selection_sort(arr):",                            annotation: "Define selection sort" },
        { line: 2, code: "    n = len(arr)",                                   annotation: "Get length" },
        { line: 3, code: "    for i in range(n - 1):",                         annotation: "Scan positions to fill" },
        { line: 4, code: "        min_idx = i",                                annotation: "Assume current is minimum" },
        { line: 5, code: "        for j in range(i + 1, n):",                  annotation: "Search remaining unsorted" },
        { line: 6, code: "            if arr[j] < arr[min_idx]:",                 annotation: "Found smaller element?" },
        { line: 7, code: "                min_idx = j",                        annotation: "Update min index" },
        { line: 8, code: "        arr[i], arr[min_idx] = arr[min_idx], arr[i]", annotation: "Swap minimum to front" },
        { line: 9, code: "    return arr",                                     annotation: "Sorted array" }
      ]
    }
  },
  insertion: {
    python: {
      code: [
        { line: 1, code: "def insertion_sort(arr):",                            annotation: "Define insertion sort" },
        { line: 2, code: "    for i in range(1, len(arr)):",                   annotation: "Loop from second item" },
        { line: 3, code: "        key = arr[i]",                               annotation: "Item to insert" },
        { line: 4, code: "        j = i - 1",                                  annotation: "Index of sorted section" },
        { line: 5, code: "        while j >= 0 and arr[j] > key:",             annotation: "Shift larger items right" },
        { line: 6, code: "            arr[j + 1] = arr[j]",                    annotation: "Perform shift" },
        { line: 7, code: "            j -= 1",                                 annotation: "Move left" },
        { line: 8, code: "        arr[j + 1] = key",                           annotation: "Insert element" },
        { line: 9, code: "    return arr",                                     annotation: "Done" }
      ]
    }
  },
  merge: {
    python: {
      code: [
        { line: 1, code: "def merge_sort(arr):",                               annotation: "Merge sort main" },
        { line: 2, code: "    if len(arr) <= 1: return arr",                    annotation: "Base case" },
        { line: 3, code: "    mid = len(arr) // 2",                            annotation: "Divide in half" },
        { line: 4, code: "    left = merge_sort(arr[:mid])",                   annotation: "Sort left half" },
        { line: 5, code: "    right = merge_sort(arr[mid:])",                  annotation: "Sort right half" },
        { line: 6, code: "    return merge(left, right)",                      annotation: "Merge halves" },
        { line: 7, code: "def merge(left, right):",                            annotation: "Merge helper" },
        { line: 8, code: "    res = []",                                       annotation: "" }
      ]
    }
  },
  quick: {
    python: {
      code: [
        { line: 1, code: "def quick_sort(arr, low, high):",                     annotation: "Quick sort main" },
        { line: 2, code: "    if low < high:",                                 annotation: "Base case partition" },
        { line: 3, code: "        pi = partition(arr, low, high)",             annotation: "Find partition pivot" },
        { line: 4, code: "        quick_sort(arr, low, pi - 1)",               annotation: "Sort left half" },
        { line: 5, code: "        quick_sort(arr, pi + 1, high)",              annotation: "Sort right half" }
      ]
    }
  },
  heap: {
    python: {
      code: [
        { line: 1, code: "def heap_sort(arr):",                                annotation: "Heap sort main" },
        { line: 2, code: "    n = len(arr)",                                   annotation: "Get array size" },
        { line: 3, code: "    for i in range(n // 2 - 1, -1, -1):",            annotation: "Build max-heap" },
        { line: 4, code: "        heapify(arr, n, i)",                         annotation: "Heapify non-leaf node" },
        { line: 5, code: "    for i in range(n - 1, 0, -1):",                  annotation: "Extract max items" },
        { line: 6, code: "        arr[0], arr[i] = arr[i], arr[0]",            annotation: "Swap root to end" }
      ]
    }
  },
  linear: {
    python: {
      code: [
        { line: 1, code: "def linear_search(arr, target):",                    annotation: "Linear scan function" },
        { line: 2, code: "    for i in range(len(arr)):",                      annotation: "Iterate indices" },
        { line: 3, code: "        if arr[i] == target:",                       annotation: "Target check" },
        { line: 4, code: "            return i",                               annotation: "Return match" },
        { line: 5, code: "    return -1",                                      annotation: "Not found" }
      ]
    }
  },
  binary: {
    python: {
      code: [
        { line: 1, code: "def binary_search(arr, target):",                    annotation: "Binary search main" },
        { line: 2, code: "    left, right = 0, len(arr) - 1",                  annotation: "Search bounds" },
        { line: 3, code: "    while left <= right:",                           annotation: "Search range non-empty" },
        { line: 4, code: "        mid = (left + right) // 2",                  annotation: "Check middle index" },
        { line: 5, code: "        if arr[mid] == target:",                     annotation: "Target match check" },
        { line: 6, code: "            return mid",                             annotation: "Return index" },
        { line: 7, code: "        elif arr[mid] < target:",                    annotation: "Discard left half" },
        { line: 8, code: "            left = mid + 1",                         annotation: "Shift left bound" },
        { line: 9, code: "        else:",                                      annotation: "Discard right half" },
        { line: 10, code: "            right = mid - 1",                       annotation: "Shift right bound" },
        { line: 11, code: "    return -1",                                     annotation: "Not found" }
      ]
    }
  },
  "sliding-window": {
    python: {
      code: [
        { line: 1, code: "def max_sum_subarray(arr, k):",                      annotation: "Define sliding window function" },
        { line: 2, code: "    n = len(arr)",                                   annotation: "Get array size" },
        { line: 3, code: "    window_sum = sum(arr[:k])",                      annotation: "Compute initial window sum" },
        { line: 4, code: "    max_sum = window_sum",                           annotation: "Set max_sum to initial sum" },
        { line: 5, code: "    for i in range(n - k):",                         annotation: "Slide window right" },
        { line: 6, code: "        window_sum += arr[i + k] - arr[i]",          annotation: "Add incoming, subtract outgoing" },
        { line: 7, code: "        max_sum = max(max_sum, window_sum)",         annotation: "Update maximum sum seen" },
        { line: 8, code: "    return max_sum",                                 annotation: "Return result" }
      ]
    }
  },
  "two-pointers": {
    python: {
      code: [
        { line: 1, code: "def two_sum_sorted(arr, target):",                   annotation: "Find target sum indices" },
        { line: 2, code: "    left, right = 0, len(arr) - 1",                  annotation: "Initialize boundary pointers" },
        { line: 3, code: "    while left < right:",                            annotation: "Search until pointers meet" },
        { line: 4, code: "        curr_sum = arr[left] + arr[right]",          annotation: "Calculate current sum" },
        { line: 5, code: "        if curr_sum == target:",                     annotation: "Check target match" },
        { line: 6, code: "            return [left, right]",                   annotation: "Return matched indices" },
        { line: 7, code: "        elif curr_sum < target:",                    annotation: "Sum too small" },
        { line: 8, code: "            left += 1",                              annotation: "Move left pointer right" },
        { line: 9, code: "        else:",                                      annotation: "Sum too large" },
        { line: 10, code: "            right -= 1",                            annotation: "Move right pointer left" },
        { line: 11, code: "    return []",                                     annotation: "No pair found" }
      ]
    }
  },
  "prefix-sum": {
    python: {
      code: [
        { line: 1, code: "def prefix_sum(arr):",                               annotation: "Compute prefix sums" },
        { line: 2, code: "    n = len(arr)",                                   annotation: "Get array size" },
        { line: 3, code: "    prefix = [0] * (n + 1)",                         annotation: "Initialize prefix buffer" },
        { line: 4, code: "    for i in range(n):",                             annotation: "Accumulate range values" },
        { line: 5, code: "        prefix[i + 1] = prefix[i] + arr[i]",         annotation: "Compute cumulative sum" },
        { line: 6, code: "    return prefix",                                  annotation: "Return prefix array" }
      ]
    }
  },
  kadane: {
    python: {
      code: [
        { line: 1, code: "def max_subarray_sum(arr):",                         annotation: "Kadane's function" },
        { line: 2, code: "    max_so_far = curr_max = arr[0]",                 annotation: "Initialize tracking sums" },
        { line: 3, code: "    for x in arr[1:]:",                              annotation: "Scan remaining elements" },
        { line: 4, code: "        curr_max = max(x, curr_max + x)",            annotation: "Decide: extend or start fresh" },
        { line: 5, code: "        max_so_far = max(max_so_far, curr_max)",     annotation: "Update global maximum" },
        { line: 6, code: "    return max_so_far",                              annotation: "Return max sum" }
      ]
    }
  },
  "bst-insert": {
    python: {
      code: [
        { line: 1, code: "def insert_bst(root, val):",                          annotation: "Insert val into BST" },
        { line: 2, code: "    if not root:",                                   annotation: "Found insertion spot" },
        { line: 3, code: "        return Node(val)",                           annotation: "Return new child node" },
        { line: 4, code: "    if val < root.val:",                             annotation: "Insert into left child branch" },
        { line: 5, code: "        root.left = insert_bst(root.left, val)",     annotation: "Recurse left" },
        { line: 6, code: "    else:",                                          annotation: "Insert into right child branch" },
        { line: 7, code: "        root.right = insert_bst(root.right, val)",   annotation: "Recurse right" },
        { line: 8, code: "    return root",                                    annotation: "Return updated root" }
      ]
    }
  },
  inorder: {
    python: {
      code: [
        { line: 1, code: "def inorder(root):",                                 annotation: "Inorder traversal (Left-Root-Right)" },
        { line: 2, code: "    if not root: return",                            annotation: "Base case" },
        { line: 3, code: "    inorder(root.left)",                             annotation: "Traverse left child branch" },
        { line: 4, code: "    print(root.val)",                                annotation: "Visit current node" },
        { line: 5, code: "    inorder(root.right)",                            annotation: "Traverse right child branch" }
      ]
    }
  },
  trie: {
    python: {
      code: [
        { line: 1, code: "def insert_trie(root, word):",                       annotation: "Insert word into Prefix Tree" },
        { line: 2, code: "    curr = root",                                    annotation: "Start at root node" },
        { line: 3, code: "    for char in word:",                              annotation: "Loop chars" },
        { line: 4, code: "        if char not in curr.children:",              annotation: "Check child lookup" },
        { line: 5, code: "            curr.children[char] = Node()",           annotation: "Insert trie node" },
        { line: 6, code: "        curr = curr.children[char]",                 annotation: "Advance deeper" },
        { line: 7, code: "    curr.is_word = True",                            annotation: "Mark word terminal" }
      ]
    }
  },
  segment: {
    python: {
      code: [
        { line: 1, code: "def build_segment_tree(arr, tree, node, start, end):", annotation: "Build tree recursively" },
        { line: 2, code: "    if start == end:",                               annotation: "Leaf base case" },
        { line: 3, code: "        tree[node] = arr[start]; return",            annotation: "Set sum value" },
        { line: 4, code: "    mid = (start + end) // 2",                       annotation: "Split range" },
        { line: 5, code: "    build_segment_tree(arr, tree, 2*node, start, mid)", annotation: "Build left" },
        { line: 6, code: "    build_segment_tree(arr, tree, 2*node+1, mid+1, end)", annotation: "Build right" },
        { line: 7, code: "    tree[node] = tree[2*node] + tree[2*node+1]",     annotation: "Combine sum" }
      ]
    }
  },
  fibonacci: {
    python: {
      code: [
        { line: 1, code: "def fibonacci_dp(n):",                               annotation: "Compute fibonacci" },
        { line: 2, code: "    dp = [0] * (n + 1)",                             annotation: "Allocate array size n+1" },
        { line: 3, code: "    dp[0], dp[1] = 0, 1",                            annotation: "Base case values" },
        { line: 4, code: "    for i in range(2, n + 1):",                      annotation: "Tabulate values" },
        { line: 5, code: "        dp[i] = dp[i-1] + dp[i-2]",                  annotation: "State transition formula" },
        { line: 6, code: "    return dp[n]",                                   annotation: "Return answer" }
      ]
    }
  },
  lcs: {
    python: {
      code: [
        { line: 1, code: "def lcs(s1, s2):",                                   annotation: "LCS algorithm" },
        { line: 2, code: "    m, n = len(s1), len(s2)",                        annotation: "Get sizes" },
        { line: 3, code: "    dp = [[0]*(n+1) for _ in range(m+1)]",           annotation: "Create DP table" },
        { line: 4, code: "    for i in range(1, m + 1):",                      annotation: "Loop s1 characters" },
        { line: 5, code: "        for j in range(1, n + 1):",                  annotation: "Loop s2 characters" },
        { line: 6, code: "            if s1[i-1] == s2[j-1]:",                 annotation: "If matching letters" },
        { line: 7, code: "                dp[i][j] = dp[i-1][j-1] + 1",        annotation: "Extend LCS length" },
        { line: 8, code: "            else:",                                  annotation: "No match" },
        { line: 9, code: "                dp[i][j] = max(dp[i-1][j], dp[i][j-1])", annotation: "Inherit max" },
        { line: 10, code: "    return dp[m][n]",                               annotation: "Return LCS length" }
      ]
    }
  },
  bfs: {
    python: {
      code: [
        { line: 1, code: "def bfs(graph, start):",                             annotation: "BFS traversal function" },
        { line: 2, code: "    visited = set([start])",                         annotation: "Init visited tracking set" },
        { line: 3, code: "    queue = deque([start])",                         annotation: "Init FIFO queue buffer" },
        { line: 4, code: "    while queue:",                                   annotation: "Process queue" },
        { line: 5, code: "        node = queue.popleft()",                     annotation: "Dequeue oldest node" },
        { line: 6, code: "        for neighbor in graph[node]:",               annotation: "Check adjacency list" },
        { line: 7, code: "            if neighbor not in visited:",            annotation: "Unvisited?" },
        { line: 8, code: "                visited.add(neighbor)",              annotation: "Mark visited" },
        { line: 9, code: "                queue.append(neighbor)",             annotation: "Enqueue node" }
      ]
    }
  },
  dfs: {
    python: {
      code: [
        { line: 1, code: "def dfs(graph, node, visited=None):",                annotation: "Recursive DFS function" },
        { line: 2, code: "    if visited is None: visited = set()",            annotation: "Initialize set" },
        { line: 3, code: "    visited.add(node)",                              annotation: "Mark node visited" },
        { line: 4, code: "    for neighbor in graph[node]:",                   annotation: "Loop adjacents" },
        { line: 5, code: "        if neighbor not in visited:",                annotation: "Check visited state" },
        { line: 6, code: "            dfs(graph, neighbor, visited)",          annotation: "Recurse deeper" },
        { line: 7, code: "    return visited",                                 annotation: "Return traversed" }
      ]
    }
  },
  stack: {
    python: {
      code: [
        { line: 1, code: "class Stack:",                                       annotation: "LIFO Container class" },
        { line: 2, code: "    def __init__(self):",                            annotation: "Constructor" },
        { line: 3, code: "        self.items = []",                            annotation: "Initialize array" },
        { line: 4, code: "    def push(self, item):",                          annotation: "Add element" },
        { line: 5, code: "        self.items.append(item)",                    annotation: "Push item to top" },
        { line: 6, code: "    def pop(self):",                                 annotation: "Remove element" },
        { line: 7, code: "        return self.items.pop()",                    annotation: "Pop from top" }
      ]
    }
  },
  queue: {
    python: {
      code: [
        { line: 1, code: "class Queue:",                                       annotation: "FIFO Container class" },
        { line: 2, code: "    def __init__(self):",                            annotation: "Constructor" },
        { line: 3, code: "        self.items = []",                            annotation: "Initialize buffer" },
        { line: 4, code: "    def enqueue(self, item):",                       annotation: "Enqueue element" },
        { line: 5, code: "        self.items.append(item)",                    annotation: "Insert at back" },
        { line: 6, code: "    def dequeue(self):",                             annotation: "Dequeue element" },
        { line: 7, code: "        return self.items.pop(0)",                   annotation: "Pop from front" }
      ]
    }
  },
  "linked-list": {
    python: {
      code: [
        { line: 1, code: "class Node:",                                        annotation: "Node definition" },
        { line: 2, code: "    def __init__(self, val):",                       annotation: "" },
        { line: 3, code: "        self.val = val; self.next = None",           annotation: "" },
        { line: 4, code: "class LinkedList:",                                  annotation: "List wrapper" },
        { line: 5, code: "    def append(self, val):",                         annotation: "Append node to tail" },
        { line: 6, code: "        new_node = Node(val)",                       annotation: "Instantiate Node" },
        { line: 7, code: "        if not self.head: self.head = new_node; return", annotation: "" },
        { line: 8, code: "        curr = self.head",                           annotation: "Traverse list" },
        { line: 9, code: "        while curr.next: curr = curr.next",          annotation: "" },
        { line: 10, code: "        curr.next = new_node",                      annotation: "Link next pointer" }
      ]
    }
  }
};
