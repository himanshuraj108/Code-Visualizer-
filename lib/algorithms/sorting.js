export function generateSortingSteps(array, algorithmId) {
  const arr = [...array];
  const steps = [];
  const n = arr.length;

  function snapshot(highlight = [], comparing = [], swapped = [], description = '', sorted = [], line = 0, variables = {}) {
    steps.push({ array: [...arr], highlight, comparing, swapped, sorted: [...sorted], description, line, variables });
  }

  if (algorithmId === 'bubble') {
    const sortedIndices = [];
    snapshot([], [], [], `Starting Bubble Sort on ${n} elements`, sortedIndices, 2, { n });
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        snapshot([j, j + 1], [j, j + 1], [], `Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}`, sortedIndices, 5, { i, j, n, 'arr[j]': arr[j], 'arr[j+1]': arr[j+1] });
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          snapshot([j, j + 1], [], [j, j + 1], `Swapped! ${arr[j+1]} > ${arr[j]}, now arr[${j}]=${arr[j]}`, sortedIndices, 6, { i, j, n, 'arr[j]': arr[j], 'arr[j+1]': arr[j+1], swapped: true });
        }
      }
      sortedIndices.push(n - 1 - i);
      snapshot([], [], [], `Pass ${i+1} complete — arr[${n-1-i}]=${arr[n-1-i]} is in final position`, sortedIndices, 3, { i: i+1, n, 'pass': i+1 });
    }
    sortedIndices.push(0);
    snapshot([], [], [], 'Bubble Sort complete! All elements in sorted order.', sortedIndices, 7, { n, done: true });
  }

  else if (algorithmId === 'selection') {
    const sortedIndices = [];
    snapshot([], [], [], `Starting Selection Sort on ${n} elements`, sortedIndices, 2, { n });
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      snapshot([minIdx], [i], [], `Finding minimum in arr[${i}..${n-1}]. Assuming arr[${i}]=${arr[i]} is min`, sortedIndices, 4, { i, min_idx: minIdx, 'arr[min_idx]': arr[minIdx] });
      for (let j = i + 1; j < n; j++) {
        snapshot([minIdx, j], [j], [], `Is arr[${j}]=${arr[j]} < arr[${minIdx}]=${arr[minIdx]}?`, sortedIndices, 6, { i, j, min_idx: minIdx, 'arr[j]': arr[j], 'arr[min_idx]': arr[minIdx] });
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          snapshot([minIdx], [minIdx], [], `New minimum: arr[${minIdx}]=${arr[minIdx]}`, sortedIndices, 7, { i, j, min_idx: minIdx, 'arr[min_idx]': arr[minIdx] });
        }
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        snapshot([i, minIdx], [], [i, minIdx], `Swapped arr[${i}]=${arr[i]} and arr[${minIdx}]=${arr[minIdx]}`, sortedIndices, 8, { i, min_idx: minIdx, 'arr[i]': arr[i] });
      }
      sortedIndices.push(i);
      snapshot([i], [], [], `arr[${i}]=${arr[i]} placed in final position`, sortedIndices, 3, { i: i+1, n });
    }
    sortedIndices.push(n - 1);
    snapshot([], [], [], 'Selection Sort complete!', sortedIndices, 9, { n, done: true });
  }

  else if (algorithmId === 'insertion') {
    const sortedIndices = [0];
    snapshot([0], [], [], `arr[0]=${arr[0]} is trivially sorted`, sortedIndices, 1, { 'sorted so far': 1 });
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      snapshot([i], [i], [], `Inserting key=${key} into sorted portion arr[0..${i-1}]`, sortedIndices, 3, { i, key, j });
      while (j >= 0 && arr[j] > key) {
        snapshot([j, j + 1], [j, j + 1], [], `arr[${j}]=${arr[j]} > key=${key}, shift right`, sortedIndices, 5, { i, key, j, 'arr[j]': arr[j] });
        arr[j + 1] = arr[j];
        j--;
        snapshot([j + 1], [], [j + 1], `Shifted to position ${j+1}`, sortedIndices, 6, { i, key, j });
      }
      arr[j + 1] = key;
      sortedIndices.push(i);
      snapshot([j + 1], [], [j + 1], `Inserted key=${key} at position ${j+1}`, sortedIndices, 8, { i, key, 'inserted at': j+1 });
    }
    snapshot([], [], [], 'Insertion Sort complete!', Array.from({ length: n }, (_, i) => i), 9, { n, done: true });
  }

  else if (algorithmId === 'merge') {
    function merge(left, right, mid) {
      let i = left, j = mid + 1;
      const temp = [];
      snapshot([left, right], [i, j], [], `Merging arr[${left}..${mid}] and arr[${mid+1}..${right}]`, [], 10, { left, mid, right, i, j });
      while (i <= mid && j <= right) {
        snapshot([i, j], [i, j], [], `arr[${i}]=${arr[i]} vs arr[${j}]=${arr[j]}`, [], 11, { i, j, 'arr[i]': arr[i], 'arr[j]': arr[j] });
        if (arr[i] <= arr[j]) { temp.push(arr[i++]); snapshot([i-1], [], [], `Took ${arr[i-1]} from left`, [], 12, { i: i-1, j }); }
        else { temp.push(arr[j++]); snapshot([j-1], [], [], `Took ${arr[j-1]} from right`, [], 14, { i, j: j-1 }); }
      }
      while (i <= mid) { temp.push(arr[i++]); }
      while (j <= right) { temp.push(arr[j++]); }
      for (let k = 0; k < temp.length; k++) {
        arr[left + k] = temp[k];
        snapshot([left + k], [], [left + k], `Placing ${temp[k]} at position ${left + k}`, [], 15, { 'position': left+k, 'value': temp[k] });
      }
    }
    function mergeSort(left, right, depth) {
      if (left >= right) return;
      const mid = Math.floor((left + right) / 2);
      snapshot([left, right], [], [], `Divide: arr[${left}..${right}] — midpoint at ${mid}`, [], 4, { left, right, mid, depth });
      mergeSort(left, mid, depth + 1);
      mergeSort(mid + 1, right, depth + 1);
      merge(left, right, mid);
    }
    mergeSort(0, n - 1, 0);
    snapshot([], [], [], 'Merge Sort complete!', Array.from({ length: n }, (_, i) => i), 7, { n, done: true });
  }

  else if (algorithmId === 'quick') {
    function partition(low, high) {
      const pivot = arr[high];
      snapshot([high], [], [], `Pivot selected: arr[${high}]=${pivot}`, [], 7, { low, high, pivot });
      let i = low - 1;
      for (let j = low; j < high; j++) {
        snapshot([j, high], [j, high], [], `arr[${j}]=${arr[j]} <= pivot=${pivot}? ${arr[j] <= pivot}`, [], 10, { low, high, pivot, i, j, 'arr[j]': arr[j] });
        if (arr[j] <= pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          if (i !== j) snapshot([i, j], [], [i, j], `Swap: arr[${i}]=${arr[i]} goes left of pivot`, [], 12, { i, j, pivot, 'arr[i]': arr[i] });
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      snapshot([i + 1], [], [i + 1, high], `Pivot ${pivot} placed at final position ${i+1}`, [], 13, { pivot, 'final position': i+1, low, high });
      return i + 1;
    }
    function quickSort(low, high, depth) {
      if (low < high) {
        const pi = partition(low, high);
        snapshot([pi], [pi], [], `arr[${pi}]=${arr[pi]} is now in correct position`, [], 3, { low, high, pi, depth });
        quickSort(low, pi - 1, depth + 1);
        quickSort(pi + 1, high, depth + 1);
      }
    }
    quickSort(0, n - 1, 0);
    snapshot([], [], [], 'Quick Sort complete!', Array.from({ length: n }, (_, i) => i), 5, { n, done: true });
  }

  else if (algorithmId === 'heap') {
    function heapify(size, i) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      snapshot([i, left, right].filter(x => x < size), [largest], [], `Heapify at i=${i}: left=${left < size ? arr[left] : 'N/A'}, right=${right < size ? arr[right] : 'N/A'}`, [], 9, { i, left, right, largest, 'arr[i]': arr[i] });
      if (left < size && arr[left] > arr[largest]) largest = left;
      if (right < size && arr[right] > arr[largest]) largest = right;
      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        snapshot([i, largest], [], [i, largest], `Swap arr[${i}]=${arr[i]} with arr[${largest}]=${arr[largest]}`, [], 16, { i, largest, 'arr[i]': arr[i], 'arr[largest]': arr[largest] });
        heapify(size, largest);
      }
    }
    snapshot([], [], [], `Building max-heap from ${n} elements`, [], 3, { n });
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
    snapshot([], [], [], `Max-heap built. Root arr[0]=${arr[0]} is the maximum`, [], 4, { 'max': arr[0] });
    const sortedIndices = [];
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      sortedIndices.push(i);
      snapshot([0, i], [], [0, i], `Moved max=${arr[i]} to final position ${i}`, sortedIndices, 6, { 'max extracted': arr[i], 'position': i, 'heap size': i });
      heapify(i, 0);
    }
    sortedIndices.push(0);
    snapshot([], [], [], 'Heap Sort complete!', sortedIndices, 7, { n, done: true });
  }

  else if (algorithmId === 'shell') {
    let gap = Math.floor(n / 2);
    while (gap > 0) {
      snapshot([], [], [], `Shell Sort — gap = ${gap}`, [], 2, { gap, n });
      for (let i = gap; i < n; i++) {
        const temp = arr[i];
        let j = i;
        while (j >= gap && arr[j - gap] > temp) {
          snapshot([j, j - gap], [j, j - gap], [], `arr[${j-gap}]=${arr[j-gap]} > ${temp}, shift right by gap=${gap}`, [], 4, { gap, i, j, temp, 'arr[j-gap]': arr[j-gap] });
          arr[j] = arr[j - gap];
          j -= gap;
        }
        arr[j] = temp;
        if (j !== i) snapshot([j], [], [j], `Placed ${temp} at position ${j}`, [], 4, { gap, i, j, temp });
      }
      gap = Math.floor(gap / 2);
    }
    snapshot([], [], [], 'Shell Sort complete!', Array.from({ length: n }, (_, i) => i), 5, { n, done: true });
  }

  else if (algorithmId === 'counting') {
    const maxV = Math.max(...arr);
    const count = new Array(maxV + 1).fill(0);
    snapshot([], [], [], `Max value = ${maxV}. Creating count array of size ${maxV+1}`, [], 2, { max: maxV, 'count size': maxV+1 });
    for (let i = 0; i < n; i++) {
      count[arr[i]]++;
      snapshot([i], [i], [], `count[${arr[i]}]++ = ${count[arr[i]]}`, [], 3, { i, 'arr[i]': arr[i], 'count[arr[i]]': count[arr[i]] });
    }
    let idx = 0;
    const sortedIds = [];
    for (let v = 0; v <= maxV; v++) {
      while (count[v] > 0) {
        arr[idx] = v;
        sortedIds.push(idx);
        snapshot([idx], [], [idx], `Placing value ${v} at position ${idx}`, sortedIds, 5, { v, idx, 'count[v]': count[v] });
        idx++;
        count[v]--;
      }
    }
    snapshot([], [], [], 'Counting Sort complete!', Array.from({ length: n }, (_, i) => i), 7, { n, done: true });
  }

  else if (algorithmId === 'comb') {
    let gap = n;
    const shrink = 1.3;
    let sorted = false;
    while (!sorted) {
      gap = Math.floor(gap / shrink);
      if (gap <= 1) { gap = 1; sorted = true; }
      snapshot([], [], [], `Comb Sort — gap = ${gap}`, [], 2, { gap, shrink });
      for (let i = 0; i + gap < n; i++) {
        snapshot([i, i + gap], [i, i + gap], [], `Comparing arr[${i}]=${arr[i]} and arr[${i+gap}]=${arr[i+gap]}`, [], 3, { i, gap, 'arr[i]': arr[i], 'arr[i+gap]': arr[i+gap] });
        if (arr[i] > arr[i + gap]) {
          [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
          snapshot([i, i + gap], [], [i, i + gap], `Swapped arr[${i}] and arr[${i+gap}]`, [], 4, { i, gap });
          sorted = false;
        }
      }
    }
    snapshot([], [], [], 'Comb Sort complete!', Array.from({ length: n }, (_, i) => i), 5, { n, done: true });
  }

  else {
    snapshot([], [], [], `${algorithmId} — select from sidebar to visualize`, [], 0, {});
  }

  return steps;
}

export function generateRandomArray(size = 16, min = 5, max = 100) {
  const set = new Set();
  const actualSize = Math.min(size, max - min + 1);
  while (set.size < actualSize) {
    set.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(set);
}
