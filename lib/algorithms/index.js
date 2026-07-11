export const ALGORITHM_LIBRARY = {
  arrays: {
    label: "Arrays & Pointers",
    algorithms: [
      {
        id: "sliding-window",
        name: "Sliding Window",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def max_sum_subarray(arr, k):
    n = len(arr)
    window_sum = 0
    for i in range(k):
        window_sum += arr[i]
    max_sum = window_sum
    for i in range(n - k):
        window_sum += arr[i + k] - arr[i]
        max_sum = max(max_sum, window_sum)
    return max_sum`
      },
      {
        id: "two-pointers",
        name: "Two Pointers",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def two_sum_sorted(arr, target):
    left = 0
    right = len(arr) - 1
    while left < right:
        curr_sum = arr[left] + arr[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []`
      },
      {
        id: "prefix-sum",
        name: "Prefix Sum",
        complexity: { time: "O(n)", space: "O(n)" },
        difficulty: "Beginner",
        code: `def prefix_sum(arr):
    n = len(arr)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]
    return prefix`
      },
      {
        id: "kadane",
        name: "Kadane's Algorithm",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def max_subarray(arr):
    max_so_far = arr[0]
    curr_max = arr[0]
    for i in range(1, len(arr)):
        curr_max = max(arr[i], curr_max + arr[i])
        max_so_far = max(max_so_far, curr_max)
    return max_so_far`
      },
      {
        id: "dutch-national-flag",
        name: "Dutch National Flag",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def sort_colors(nums):
    low = 0
    mid = 0
    high = len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`
      },
      {
        id: "moores-voting",
        name: "Moore's Voting Algorithm",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def majority_element(nums):
    candidate = None
    count = 0
    for num in nums:
        if count == 0:
            candidate = num
        if num == candidate:
            count += 1
        else:
            count -= 1
    return candidate`
      },
      {
        id: "floyd-cycle",
        name: "Floyd's Cycle Detection",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def detect_cycle(head):
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`
      },
      {
        id: "merge-intervals",
        name: "Merge Intervals",
        complexity: { time: "O(n log n)", space: "O(n)" },
        difficulty: "Intermediate",
        code: `def merge_intervals(intervals):
    intervals.sort()
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`
      },
      {
        id: "container-with-most-water",
        name: "Container With Most Water",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def max_area(height):
    left = 0
    right = len(height) - 1
    ans = 0
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        ans = max(ans, width * h)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return ans`
      },
      {
        id: "trapping-rain-water",
        name: "Trapping Rain Water",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Advanced",
        code: `def trap(height):
    if not height: return 0
    l, r = 0, len(height) - 1
    l_max, r_max = height[l], height[r]
    res = 0
    while l < r:
        if l_max < r_max:
            l += 1
            l_max = max(l_max, height[l])
            res += l_max - height[l]
        else:
            r -= 1
            r_max = max(r_max, height[r])
            res += r_max - height[r]
    return res`
      },
      {
        id: "longest-consecutive-sequence",
        name: "Longest Consecutive Sequence",
        complexity: { time: "O(n)", space: "O(n)" },
        difficulty: "Intermediate",
        code: `def longest_consecutive(nums):
    num_set = set(nums)
    longest = 0
    for n in nums:
        if (n - 1) not in num_set:
            length = 0
            while (n + length) in num_set:
                length += 1
            longest = max(length, longest)
    return longest`
      },
      {
        id: "product-except-self",
        name: "Product of Array Except Self",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def product_except_self(nums):
    res = [1] * len(nums)
    prefix = 1
    for i in range(len(nums)):
        res[i] = prefix
        prefix *= nums[i]
    postfix = 1
    for i in range(len(nums) - 1, -1, -1):
        res[i] *= postfix
        postfix *= nums[i]
    return res`
      },
      {
        id: "rotate-array",
        name: "Rotate Array",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def rotate(nums, k):
    k = k % len(nums)
    def reverse(l, r):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l, r = l + 1, r - 1
    reverse(0, len(nums) - 1)
    reverse(0, k - 1)
    reverse(k, len(nums) - 1)
    return nums`
      },
      {
        id: "subarray-sum-equals-k",
        name: "Subarray Sum Equals K",
        complexity: { time: "O(n)", space: "O(n)" },
        difficulty: "Intermediate",
        code: `def subarray_sum(nums, k):
    res = 0
    curr = 0
    prefix_sums = {0: 1}
    for n in nums:
        curr += n
        diff = curr - k
        res += prefix_sums.get(diff, 0)
        prefix_sums[curr] = prefix_sums.get(curr, 0) + 1
    return res`
      },
      {
        id: "find-duplicate-number",
        name: "Find Duplicate Number",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def find_duplicate(nums):
    slow = nums[0]
    fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow2 = nums[0]
    while slow != slow2:
        slow = nums[slow]
        slow2 = nums[slow2]
    return slow`
      },
      {
        id: "next-permutation",
        name: "Next Permutation",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def next_permutation(nums):
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    left, right = i + 1, n - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1`
      },
      {
        id: "best-time-stock",
        name: "Best Time to Buy & Sell Stock",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        profit = price - min_price
        max_profit = max(max_profit, profit)
    return max_profit`
      },
      {
        id: "jump-game",
        name: "Jump Game",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def can_jump(nums):
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    return True`
      }
    ]
  },

  datastructures: {
    label: "Data Structures",
    algorithms: [
      {
        id: "stack",
        name: "Stack operations",
        complexity: { time: "O(1)", space: "O(n)" },
        difficulty: "Beginner",
        code: `class Stack:
    def __init__(self):
        self.items = []
    def push(self, val):
        self.items.append(val)
    def pop(self):
        return self.items.pop()`
      },
      {
        id: "queue",
        name: "Queue operations",
        complexity: { time: "O(1)", space: "O(n)" },
        difficulty: "Beginner",
        code: `class Queue:
    def __init__(self):
        self.items = []
    def enqueue(self, val):
        self.items.append(val)
    def dequeue(self):
        return self.items.pop(0)`
      },
      {
        id: "linked-list",
        name: "Singly Linked List",
        complexity: { time: "O(n)", space: "O(n)" },
        difficulty: "Beginner",
        code: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None
class LinkedList:
    def __init__(self):
        self.head = None
    def append(self, val):
        new_node = Node(val)
        if not self.head:
            self.head = new_node
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = new_node`
      },
      {
        id: "min-heap",
        name: "Min Heap Operations",
        complexity: { time: "O(log n)", space: "O(n)" },
        difficulty: "Intermediate",
        code: `import heapq
class MinHeap:
    def __init__(self):
        self.heap = []
    def insert(self, val):
        heapq.heappush(self.heap, val)
    def pop_min(self):
        return heapq.heappop(self.heap)`
      },
      {
        id: "circular-queue",
        name: "Circular Queue",
        complexity: { time: "O(1)", space: "O(k)" },
        difficulty: "Intermediate",
        code: `class CircularQueue:
    def __init__(self, k):
        self.q = [None] * k
        self.head = -1
        self.tail = -1
        self.size = k
    def enqueue(self, val):
        if (self.tail + 1) % self.size == self.head:
            return False
        if self.head == -1:
            self.head = 0
        self.tail = (self.tail + 1) % self.size
        self.q[self.tail] = val
        return True`
      },
      {
        id: "lru-cache",
        name: "LRU Cache Design",
        complexity: { time: "O(1)", space: "O(capacity)" },
        difficulty: "Advanced",
        code: `class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = {}
        self.order = []
    def get(self, key):
        if key not in self.cache:
            return -1
        self.order.remove(key)
        self.order.append(key)
        return self.cache[key]
    def put(self, key, val):
        if key in self.cache:
            self.order.remove(key)
        elif len(self.cache) >= self.cap:
            oldest = self.order.pop(0)
            del self.cache[oldest]
        self.cache[key] = val
        self.order.append(key)`
      },
      {
        id: "min-stack",
        name: "Min Stack Design",
        complexity: { time: "O(1)", space: "O(n)" },
        difficulty: "Intermediate",
        code: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    def pop(self):
        val = self.stack.pop()
        if val == self.min_stack[-1]:
            self.min_stack.pop()
        return val`
      },
      {
        id: "doubly-linked-list",
        name: "Doubly Linked List",
        complexity: { time: "O(n)", space: "O(n)" },
        difficulty: "Beginner",
        code: `class DLLNode:
    def __init__(self, val):
        self.val = val
        self.next = None
        self.prev = None
class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
    def append(self, val):
        new_node = DLLNode(val)
        if not self.head:
            self.head = new_node
            self.tail = new_node
            return
        self.tail.next = new_node
        new_node.prev = self.tail
        self.tail = new_node`
      },
      {
        id: "max-heap",
        name: "Max Heap Operations",
        complexity: { time: "O(log n)", space: "O(n)" },
        difficulty: "Intermediate",
        code: `class MaxHeap:
    def __init__(self):
        self.heap = []
    def insert(self, val):
        self.heap.append(val)
        self._bubble_up(len(self.heap) - 1)
    def _bubble_up(self, i):
        parent = (i - 1) // 2
        if i > 0 and self.heap[i] > self.heap[parent]:
            self.heap[i], self.heap[parent] = self.heap[parent], self.heap[i]
            self._bubble_up(parent)`
      }
    ]
  },
  sorting: {
    label: "Sorting Algorithms",
    algorithms: [
      {
        id: "bubble",
        name: "Bubble Sort",
        complexity: { time: "O(n²)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`
      },
      {
        id: "selection",
        name: "Selection Sort",
        complexity: { time: "O(n²)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
      },
      {
        id: "insertion",
        name: "Insertion Sort",
        complexity: { time: "O(n²)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`
      },
      {
        id: "merge",
        name: "Merge Sort",
        complexity: { time: "O(n log n)", space: "O(n)" },
        difficulty: "Intermediate",
        code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i])
            i += 1
        else:
            res.append(right[j])
            j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res`
      },
      {
        id: "quick",
        name: "Quick Sort",
        complexity: { time: "O(n log n)", space: "O(log n)" },
        difficulty: "Intermediate",
        code: `def quick_sort(arr, low, high):
    if low < high:
        pivot = partition(arr, low, high)
        quick_sort(arr, low, pivot - 1)
        quick_sort(arr, pivot + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`
      },
      {
        id: "heap",
        name: "Heap Sort",
        complexity: { time: "O(n log n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`
      },
      {
        id: "counting-sort",
        name: "Counting Sort",
        complexity: { time: "O(n + k)", space: "O(n + k)" },
        difficulty: "Intermediate",
        code: `def counting_sort(arr):
    max_val = max(arr)
    count = [0] * (max_val + 1)
    for x in arr:
        count[x] += 1
    output = []
    for i in range(len(count)):
        output.extend([i] * count[i])
    return output`
      },
      {
        id: "bucket-sort",
        name: "Bucket Sort",
        complexity: { time: "O(n + k)", space: "O(n)" },
        difficulty: "Intermediate",
        code: `def bucket_sort(arr):
    buckets = [[] for _ in range(10)]
    for num in arr:
        idx = int(num * 10)
        buckets[idx].append(num)
    for b in buckets:
        b.sort()
    res = []
    for b in buckets:
        res.extend(b)
    return res`
      },
      {
        id: "shell-sort",
        name: "Shell Sort",
        complexity: { time: "O(n log² n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def shell_sort(arr):
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2
    return arr`
      }
    ]
  },
  searching: {
    label: "Searching Algorithms",
    algorithms: [
      {
        id: "linear",
        name: "Linear Search",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`
      },
      {
        id: "binary",
        name: "Binary Search",
        complexity: { time: "O(log n)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
      },
      {
        id: "ternary-search",
        name: "Ternary Search",
        complexity: { time: "O(log₃ n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def ternary_search(arr, target):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid1 = left + (right - left) // 3
        mid2 = right - (right - left) // 3
        if arr[mid1] == target: return mid1
        if arr[mid2] == target: return mid2
        if target < arr[mid1]:
            right = mid1 - 1
        elif target > arr[mid2]:
            left = mid2 + 1
        else:
            left = mid1 + 1
            right = mid2 - 1
    return -1`
      },
      {
        id: "jump-search",
        name: "Jump Search",
        complexity: { time: "O(√n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `import math
def jump_search(arr, val):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    while arr[min(step, n)-1] < val:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    while arr[prev] < val:
        prev += 1
        if prev == min(step, n):
            return -1
    if arr[prev] == val:
        return prev
    return -1`
      },
      {
        id: "exponential-search",
        name: "Exponential Search",
        complexity: { time: "O(log n)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def exponential_search(arr, target):
    if arr[0] == target:
        return 0
    bound = 1
    while bound < len(arr) and arr[bound] <= target:
        bound *= 2
    low = bound // 2
    high = min(bound, len(arr) - 1)
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`
      }
    ]
  },
  graph: {
    label: "Graph Algorithms",
    algorithms: [
      {
        id: "bfs",
        name: "Breadth-First Search (BFS)",
        complexity: { time: "O(V+E)", space: "O(V)" },
        difficulty: "Beginner",
        code: `def bfs(graph, start):
    visited = set([start])
    queue = [start]
    while queue:
        node = queue.pop(0)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`
      },
      {
        id: "dfs",
        name: "Depth-First Search (DFS)",
        complexity: { time: "O(V+E)", space: "O(V)" },
        difficulty: "Beginner",
        code: `def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited`
      },
      {
        id: "dijkstra",
        name: "Dijkstra's Shortest Path",
        complexity: { time: "O((V+E) log V)", space: "O(V)" },
        difficulty: "Intermediate",
        code: `def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [[0, start]]
    while pq:
        pq.sort()
        curr_dist, curr_node = pq.pop(0)
        for neighbor, weight in graph[curr_node].items():
            dist = curr_dist + weight
            if dist < distances[neighbor]:
                distances[neighbor] = dist
                pq.append([dist, neighbor])
    return distances`
      },
      {
        id: "kruskal",
        name: "Kruskal's Minimum Spanning Tree",
        complexity: { time: "O(E log E)", space: "O(V)" },
        difficulty: "Intermediate",
        code: `def kruskal(nodes, edges):
    edges.sort(key=lambda x: x[2])
    parent = {node: node for node in nodes}
    mst = []
    def find(i):
        if parent[i] == i: return i
        return find(parent[i])
    for u, v, w in edges:
        root_u = find(u)
        root_v = find(v)
        if root_u != root_v:
            mst.append([u, v, w])
            parent[root_u] = root_v
    return mst`
      },
      {
        id: "bellman-ford",
        name: "Bellman-Ford Algorithm",
        complexity: { time: "O(VE)", space: "O(V)" },
        difficulty: "Intermediate",
        code: `def bellman_ford(nodes, edges, start):
    dist = {node: float('inf') for node in nodes}
    dist[start] = 0
    for i in range(len(nodes) - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return dist`
      },
      {
        id: "prim-mst",
        name: "Prim's Minimum Spanning Tree",
        complexity: { time: "O((V+E) log V)", space: "O(V)" },
        difficulty: "Intermediate",
        code: `def prim_mst(graph, start):
    visited = set()
    mst_weight = 0
    pq = [[0, start]]
    while pq:
        pq.sort()
        w, u = pq.pop(0)
        if u in visited:
            continue
        visited.add(u)
        mst_weight += w
        for v, weight in graph[u].items():
            if v not in visited:
                pq.append([weight, v])
    return mst_weight`
      },
      {
        id: "topological-sort-kahns",
        name: "Topological Sort (Kahn's)",
        complexity: { time: "O(V+E)", space: "O(V)" },
        difficulty: "Intermediate",
        code: `def topological_sort_kahns(nodes, edges):
    in_degree = {u: 0 for u in nodes}
    adj = {u: [] for u in nodes}
    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1
    queue = [u for u in nodes if in_degree[u] == 0]
    order = []
    while queue:
        u = queue.pop(0)
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    return order`
      }
    ]
  },
  tree: {
    label: "Tree Structures",
    algorithms: [
      {
        id: "bst-insert",
        name: "BST Insertion",
        complexity: { time: "O(log n)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def insert_bst(root, val):
    if not root:
        return Node(val)
    if val < root.val:
        root.left = insert_bst(root.left, val)
    else:
        root.right = insert_bst(root.right, val)
    return root`
      },
      {
        id: "inorder",
        name: "Inorder Traversal",
        complexity: { time: "O(n)", space: "O(h)" },
        difficulty: "Beginner",
        code: `def inorder(root):
    if not root:
        return
    inorder(root.left)
    print(root.val)
    inorder(root.right)`
      },
      {
        id: "trie",
        name: "Trie (Prefix Tree)",
        complexity: { time: "O(L)", space: "O(N·L)" },
        difficulty: "Intermediate",
        code: `def insert_trie(root, word):
    curr = root
    for char in word:
        if char not in curr.children:
            curr.children[char] = Node()
        curr = curr.children[char]
    curr.is_word = True`
      },
      {
        id: "segment",
        name: "Segment Tree",
        complexity: { time: "O(log n)", space: "O(n)" },
        difficulty: "Advanced",
        code: `def build_tree(arr, tree, node, start, end):
    if start == end:
        tree[node] = arr[start]
        return
    mid = (start + end) // 2
    build_tree(arr, tree, 2 * node, start, mid)
    build_tree(arr, tree, 2 * node + 1, mid + 1, end)
    tree[node] = tree[2 * node] + tree[2 * node + 1]`
      },
      {
        id: "invert-binary-tree",
        name: "Invert Binary Tree",
        complexity: { time: "O(n)", space: "O(h)" },
        difficulty: "Beginner",
        code: `def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root`
      },
      {
        id: "lowest-common-ancestor",
        name: "Lowest Common Ancestor",
        complexity: { time: "O(n)", space: "O(h)" },
        difficulty: "Intermediate",
        code: `def lca(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right:
        return root
    return left if left else right`
      },
      {
        id: "fenwick-tree",
        name: "Fenwick Tree",
        complexity: { time: "O(log n)", space: "O(n)" },
        difficulty: "Advanced",
        code: `class FenwickTree:
    def __init__(self, size):
        self.tree = [0] * (size + 1)
    def update(self, i, delta):
        while i < len(self.tree):
            self.tree[i] += delta
            i += (i & -i)
    def query(self, i):
        s = 0
        while i > 0:
            s += self.tree[i]
            i -= (i & -i)
        return s`
      }
    ]
  },
  dp: {
    label: "Dynamic Programming",
    algorithms: [
      {
        id: "fibonacci",
        name: "Fibonacci Sequence",
        complexity: { time: "O(n)", space: "O(n)" },
        difficulty: "Beginner",
        code: `def fibonacci_dp(n):
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`
      },
      {
        id: "lcs",
        name: "Longest Common Subsequence",
        complexity: { time: "O(mn)", space: "O(mn)" },
        difficulty: "Intermediate",
        code: `def lcs(s1, s2):
    m = len(s1)
    n = len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`
      },
      {
        id: "knapsack",
        name: "0/1 Knapsack",
        complexity: { time: "O(nW)", space: "O(nW)" },
        difficulty: "Intermediate",
        code: `def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]`
      },
      {
        id: "coin-change",
        name: "Coin Change Problem",
        complexity: { time: "O(n·c)", space: "O(n)" },
        difficulty: "Intermediate",
        code: `def coin_change(coins, amt):
    dp = [float('inf')] * (amt + 1)
    dp[0] = 0
    for i in range(1, amt + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amt] if dp[amt] != float('inf') else -1`
      },
      {
        id: "lis",
        name: "Longest Increasing Subsequence",
        complexity: { time: "O(n log n)", space: "O(n)" },
        difficulty: "Intermediate",
        code: `def lis(nums):
    if not nums:
        return 0
    dp = [1] * len(nums)
    for i in range(len(nums)):
        for j in range(i):
            if nums[i] > nums[j]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`
      },
      {
        id: "edit-distance",
        name: "Edit Distance",
        complexity: { time: "O(mn)", space: "O(mn)" },
        difficulty: "Intermediate",
        code: `def edit_distance(word1, word2):
    m = len(word1)
    n = len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]`
      },
      {
        id: "house-robber",
        name: "House Robber DP",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def rob(nums):
    rob1 = 0
    rob2 = 0
    for n in nums:
        temp = max(n + rob1, rob2)
        rob1 = rob2
        rob2 = temp
    return rob2`
      },
      {
        id: "climbing-stairs",
        name: "Climbing Stairs",
        complexity: { time: "O(n)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def climb_stairs(n):
    one = 1
    two = 1
    for i in range(n - 1):
        temp = one + two
        one = two
        two = temp
    return two`
      }
    ]
  },
  strings: {
    label: "String Algorithms",
    algorithms: [
      {
        id: "rabin-karp",
        name: "Rabin-Karp Rolling Hash",
        complexity: { time: "O(n+m)", space: "O(1)" },
        difficulty: "Intermediate",
        code: `def rabin_karp(txt, pat):
    n, m = len(txt), len(pat)
    hp, ht, h, d, q = 0, 0, 1, 256, 101
    for i in range(m - 1):
        h = (h * d) % q
    for i in range(m):
        hp = (d * hp + ord(pat[i])) % q
        ht = (d * ht + ord(txt[i])) % q
    for i in range(n - m + 1):
        if hp == ht:
            if txt[i:i+m] == pat:
                return i
        if i < n - m:
            ht = (d * (ht - ord(txt[i]) * h) + ord(txt[i+m])) % q
            if ht < 0: ht = ht + q
    return -1`
      },
      {
        id: "longest-common-prefix",
        name: "Longest Common Prefix",
        complexity: { time: "O(n·L)", space: "O(1)" },
        difficulty: "Beginner",
        code: `def longest_common_prefix(strs):
    if not strs:
        return ""
    for i in range(len(strs[0])):
        char = strs[0][i]
        for s in strs:
            if i == len(s) or s[i] != char:
                return strs[0][:i]
    return strs[0]`
      }
    ]
  }
};

export const ALL_CATEGORIES = Object.keys(ALGORITHM_LIBRARY);

export function getAlgorithmById(id) {
  for (const category of Object.values(ALGORITHM_LIBRARY)) {
    const algo = category.algorithms.find(a => a.id === id);
    if (algo) return algo;
  }
  return null;
}
