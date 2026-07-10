"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Copy, Trash2, CheckCircle2, AlertCircle, Code2, ChevronDown } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const SAMPLES = {
  python: {
    label: "Python",
    monacoLang: "python",
    algorithms: {
      "Bubble Sort": `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,

      "Merge Sort": `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))`,

      "Binary Search": `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

arr = [2, 3, 4, 10, 40, 50, 60]
result = binary_search(arr, 10)
print(f"Found at index: {result}" if result != -1 else "Not found")`,

      "BFS Graph": `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}
print(bfs(graph, 'A'))`,

      "Fibonacci DP": `def fibonacci(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,
    }
  },

  javascript: {
    label: "JavaScript",
    monacoLang: "javascript",
    algorithms: {
      "Quick Sort": `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

console.log(quickSort([3, 6, 8, 10, 1, 2, 1]));`,

      "Merge Sort": `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));`,

      "Binary Search": `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const arr = [2, 3, 4, 10, 40, 50, 60];
const result = binarySearch(arr, 10);
console.log(result !== -1 ? \`Found at index: \${result}\` : "Not found");`,

      "Linked List": `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() { this.head = null; }

  append(data) {
    const node = new Node(data);
    if (!this.head) { this.head = node; return; }
    let curr = this.head;
    while (curr.next) curr = curr.next;
    curr.next = node;
  }

  toArray() {
    const result = [];
    let curr = this.head;
    while (curr) { result.push(curr.data); curr = curr.next; }
    return result;
  }
}

const list = new LinkedList();
[1, 2, 3, 4, 5].forEach(v => list.append(v));
console.log(list.toArray());`,
    }
  },

  java: {
    label: "Java",
    monacoLang: "java",
    algorithms: {
      "Binary Search": `import java.util.Arrays;

public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {2, 3, 4, 10, 40, 50, 60};
        int result = binarySearch(arr, 10);
        System.out.println(result != -1
            ? "Found at index: " + result
            : "Not found");
    }
}`,

      "Merge Sort": `public class MergeSort {
    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = (left + right) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1, n2 = right - mid;
        int[] L = new int[n1], R = new int[n2];
        for (int i = 0; i < n1; i++) L[i] = arr[left + i];
        for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }

    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(arr, 0, arr.length - 1);
        System.out.println(java.util.Arrays.toString(arr));
    }
}`,

      "Stack": `import java.util.Stack;

public class StackDemo {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();
        stack.push(10);
        stack.push(20);
        stack.push(30);
        System.out.println("Top: " + stack.peek());
        System.out.println("Pop: " + stack.pop());
        System.out.println("Size: " + stack.size());
        System.out.println("Stack: " + stack);
    }
}`,
    }
  },

  cpp: {
    label: "C++",
    monacoLang: "cpp",
    algorithms: {
      "Bubble Sort": `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(arr);
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,

      "Quick Sort": `#include <iostream>
#include <vector>
using namespace std;

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

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    vector<int> arr = {10, 7, 8, 9, 1, 5};
    quickSort(arr, 0, arr.size() - 1);
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,

      "Merge Sort": `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> L(arr.begin() + left, arr.begin() + mid + 1);
    vector<int> R(arr.begin() + mid + 1, arr.begin() + right + 1);
    int i = 0, j = 0, k = left;
    while (i < L.size() && j < R.size())
        arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
    while (i < L.size()) arr[k++] = L[i++];
    while (j < R.size()) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

int main() {
    vector<int> arr = {38, 27, 43, 3, 9, 82, 10};
    mergeSort(arr, 0, arr.size() - 1);
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,

      "Binary Search": `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> arr = {2, 3, 4, 10, 40, 50, 60};
    int result = binarySearch(arr, 10);
    if (result != -1)
        cout << "Found at index: " << result << endl;
    else
        cout << "Not found" << endl;
    return 0;
}`,

      "Linked List": `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class LinkedList {
    Node* head;
public:
    LinkedList() : head(nullptr) {}

    void append(int val) {
        Node* node = new Node(val);
        if (!head) { head = node; return; }
        Node* curr = head;
        while (curr->next) curr = curr->next;
        curr->next = node;
    }

    void print() {
        Node* curr = head;
        while (curr) {
            cout << curr->data;
            if (curr->next) cout << " -> ";
            curr = curr->next;
        }
        cout << endl;
    }
};

int main() {
    LinkedList list;
    for (int v : {1, 2, 3, 4, 5}) list.append(v);
    list.print();
    return 0;
}`,

      "BFS Graph": `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

void bfs(vector<vector<int>>& graph, int start, int n) {
    vector<bool> visited(n, false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    cout << "BFS order: ";
    while (!q.empty()) {
        int node = q.front(); q.pop();
        cout << node << " ";
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
    cout << endl;
}

int main() {
    int n = 6;
    vector<vector<int>> graph(n);
    graph[0] = {1, 2};
    graph[1] = {0, 3, 4};
    graph[2] = {0, 5};
    graph[3] = {1};
    graph[4] = {1, 5};
    graph[5] = {2, 4};
    bfs(graph, 0, n);
    return 0;
}`,
    }
  },
};

export default function CodeEditorPanel({ code, onCodeChange, onAnalyze, isAnalyzing }) {
  const [language, setLanguage] = useState("python");
  const [selectedAlgo, setSelectedAlgo] = useState("Bubble Sort");
  const [copied, setCopied] = useState(false);
  const [showAlgoMenu, setShowAlgoMenu] = useState(false);

  const langData = SAMPLES[language];
  const algoNames = Object.keys(langData.algorithms);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const newAlgos = Object.keys(SAMPLES[lang].algorithms);
    const firstAlgo = newAlgos[0];
    setSelectedAlgo(firstAlgo);
    onCodeChange(SAMPLES[lang].algorithms[firstAlgo]);
    setShowAlgoMenu(false);
  };

  const handleAlgoSelect = (algoName) => {
    setSelectedAlgo(algoName);
    onCodeChange(langData.algorithms[algoName]);
    setShowAlgoMenu(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <Code2 size={16} className="text-slate-500" />
          <span className="text-sm font-bold text-slate-700">Code Editor</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            {Object.entries(SAMPLES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleLanguageChange(key)}
                className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${
                  language === key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowAlgoMenu(!showAlgoMenu)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              {selectedAlgo}
              <ChevronDown size={12} />
            </button>
            {showAlgoMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 min-w-48">
                {algoNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => handleAlgoSelect(name)}
                    className={`w-full text-left text-xs font-medium px-4 py-2.5 hover:bg-slate-50 transition-colors ${
                      selectedAlgo === name ? "text-blue-700 bg-blue-50" : "text-slate-700"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-slate-200" />

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="Copy code"
          >
            {copied ? <CheckCircle2 size={15} className="text-emerald-500" /> : <Copy size={15} />}
          </button>

          <button
            onClick={() => onCodeChange("")}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="Clear editor"
          >
            <Trash2 size={15} />
          </button>

          <button
            onClick={onAnalyze}
            disabled={!code || isAnalyzing}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-200"
          >
            {isAnalyzing ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={13} />
                Analyze with AI
              </>
            )}
          </button>
        </div>
      </div>

      {!code && (
        <div className="shrink-0 px-4 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
          <AlertCircle size={14} className="text-blue-500 shrink-0" />
          <p className="text-xs text-blue-700">
            Paste any code — complete, broken, or partial. AI will analyze language, detect algorithms, find errors, and explain complexity.
          </p>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={langData.monacoLang}
          value={code}
          onChange={(val) => onCodeChange(val || "")}
          theme="vs"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            folding: true,
            wordWrap: "on",
            tabSize: 4,
            renderWhitespace: "none",
            scrollbar: { vertical: "auto", horizontal: "auto", verticalScrollbarSize: 8 },
            overviewRulerLanes: 0,
            lineDecorationsWidth: 8,
          }}
        />
      </div>
    </div>
  );
}
