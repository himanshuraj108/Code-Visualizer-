export function generateGraphSteps(algorithmId) {
  const graph = {
    nodes: [
      { id: 'A', x: 200, y: 80 },
      { id: 'B', x: 100, y: 200 },
      { id: 'C', x: 300, y: 200 },
      { id: 'D', x: 60, y: 320 },
      { id: 'E', x: 180, y: 320 },
      { id: 'F', x: 320, y: 320 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'B', to: 'E', weight: 3 },
      { from: 'C', to: 'E', weight: 1 },
      { from: 'C', to: 'F', weight: 6 },
      { from: 'D', to: 'E', weight: 2 },
      { from: 'E', to: 'F', weight: 4 },
    ]
  };

  const steps = [];

  function snap(visitedNodes, visitedEdges, currentNode, description, queueOrStack = [], line = 1, extraVars = {}) {
    steps.push({
      graph,
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      currentNode,
      description,
      queue: [...queueOrStack],
      line,
      state: {
        queue_or_stack: queueOrStack.join(", ") || "empty",
        current_node: currentNode || "None",
        visited: visitedNodes.join(", ") || "None",
        ...extraVars
      }
    });
  }

  if (algorithmId === 'bfs') {
    const visited = new Set();
    const queue = ['A'];
    const visitedNodes = [];
    const visitedEdges = [];

    visited.add('A');
    snap(visitedNodes, visitedEdges, 'A', 'Start BFS: Mark node A as visited, and add A to queue.', queue, 3);

    while (queue.length > 0) {
      snap(visitedNodes, visitedEdges, queue[0], `Check queue: ${queue.join(", ")} is not empty.`, queue, 5);

      const node = queue.shift();
      visitedNodes.push(node);
      snap(visitedNodes, visitedEdges, node, `Dequeue front node ${node}. Explore its neighbors.`, queue, 6, { node });

      const neighbors = graph.edges
        .filter(e => e.from === node || e.to === node)
        .map(e => ({ neighbor: e.from === node ? e.to : e.from, edge: e }));

      for (const { neighbor, edge } of neighbors) {
        const isVisited = visited.has(neighbor);
        snap(visitedNodes, visitedEdges, node, `Check neighbor ${neighbor} of node ${node}.`, queue, 8, { node, neighbor, isVisited: String(isVisited) });

        if (!isVisited) {
          visited.add(neighbor);
          queue.push(neighbor);
          visitedEdges.push(`${edge.from}-${edge.to}`);
          snap(visitedNodes, visitedEdges, neighbor, `Mark neighbor ${neighbor} as visited, and add to queue.`, queue, 9, { node, neighbor });
        }
      }
    }
    snap(visitedNodes, visitedEdges, null, 'BFS complete! All reachable nodes visited.', [], 4);
  }

  else if (algorithmId === 'dfs') {
    const visited = new Set();
    const visitedNodes = [];
    const visitedEdges = [];
    const stack = [];

    function dfs(node, parent = null) {
      visited.add(node);
      visitedNodes.push(node);
      stack.push(node);

      snap(visitedNodes, visitedEdges, node, `Visit node ${node}. Push to call stack.`, stack, 3, { node });

      const neighbors = graph.edges
        .filter(e => e.from === node || e.to === node)
        .map(e => ({ neighbor: e.from === node ? e.to : e.from, edge: e }));

      for (const { neighbor, edge } of neighbors) {
        if (!visited.has(neighbor)) {
          visitedEdges.push(`${edge.from}-${edge.to}`);
          snap(visitedNodes, visitedEdges, neighbor, `Call DFS recursively on unvisited neighbor ${neighbor}.`, stack, 6, { node, neighbor });
          dfs(neighbor, node);
        }
      }

      stack.pop();
      snap(visitedNodes, visitedEdges, node, `Backtrack from node ${node}. Pop call stack.`, stack, 7, { node });
    }

    dfs('A');
    snap(visitedNodes, visitedEdges, null, 'DFS complete!', [], 7);
  }

  else if (algorithmId === 'dijkstra') {
    const visitedNodes = [];
    const visitedEdges = [];
    const distances = { A: 0, B: '∞', C: '∞', D: '∞', E: '∞', F: '∞' };
    const pq = ['A:0'];
    snap(visitedNodes, visitedEdges, 'A', 'Start Dijkstra: Set dist[A] = 0, others = ∞. Add A to Priority Queue.', pq, 3, { distances: JSON.stringify(distances) });

    visitedNodes.push('A');
    distances.B = 4; distances.C = 2;
    pq.shift(); pq.push('C:2', 'B:4');
    snap(visitedNodes, visitedEdges, 'A', 'Visit node A. Relax neighbors B (dist 4) and C (dist 2).', pq, 5, { distances: JSON.stringify(distances) });

    visitedNodes.push('C');
    visitedEdges.push('A-C');
    distances.E = 3; distances.F = 8;
    pq.shift(); pq.splice(0, 2, 'E:3', 'B:4', 'F:8');
    snap(visitedNodes, visitedEdges, 'C', 'Visit closest node C. Relax neighbors E (dist 2+1=3) and F (dist 2+6=8).', pq, 5, { distances: JSON.stringify(distances) });

    visitedNodes.push('E');
    visitedEdges.push('C-E');
    distances.D = 5; distances.F = 7;
    pq.shift(); pq.splice(0, 3, 'B:4', 'D:5', 'F:7');
    snap(visitedNodes, visitedEdges, 'E', 'Visit closest node E. Relax neighbors D (dist 3+2=5) and F (dist 3+4=7).', pq, 5, { distances: JSON.stringify(distances) });

    visitedNodes.push('B');
    visitedEdges.push('A-B');
    pq.shift();
    snap(visitedNodes, visitedEdges, 'B', 'Visit node B. Neighbor D check: dist via B (4+5=9) > current dist 5. No change.', pq, 5, { distances: JSON.stringify(distances) });

    visitedNodes.push('D');
    visitedEdges.push('E-D');
    pq.shift();
    snap(visitedNodes, visitedEdges, 'D', 'Visit node D. Neighbors relaxed.', pq, 5, { distances: JSON.stringify(distances) });

    visitedNodes.push('F');
    visitedEdges.push('E-F');
    pq.shift();
    snap(visitedNodes, visitedEdges, 'F', 'Dijkstra complete! Shortest paths found.', [], 5, { distances: JSON.stringify(distances) });
  }

  else if (algorithmId === 'kruskal') {
    const visitedNodes = [];
    const visitedEdges = [];
    const mst = [];
    const edges = ['C-E (1)', 'A-C (2)', 'D-E (2)', 'B-E (3)', 'A-B (4)', 'E-F (4)', 'B-D (5)', 'C-F (6)'];
    snap(visitedNodes, visitedEdges, null, 'Start Kruskal: Sort all graph edges by weight.', edges, 2, { mst: "[]" });

    mst.push('C-E');
    visitedNodes.push('C', 'E');
    visitedEdges.push('C-E');
    edges.shift();
    snap(visitedNodes, visitedEdges, null, 'Pick edge C-E (weight 1). No cycle created. Add to MST.', edges, 5, { mst: mst.join(", ") });

    mst.push('A-C');
    visitedNodes.push('A');
    visitedEdges.push('A-C');
    edges.shift();
    snap(visitedNodes, visitedEdges, null, 'Pick edge A-C (weight 2). No cycle created. Add to MST.', edges, 5, { mst: mst.join(", ") });

    mst.push('D-E');
    visitedNodes.push('D');
    visitedEdges.push('D-E');
    edges.shift();
    snap(visitedNodes, visitedEdges, null, 'Pick edge D-E (weight 2). No cycle created. Add to MST.', edges, 5, { mst: mst.join(", ") });

    mst.push('B-E');
    visitedNodes.push('B');
    visitedEdges.push('B-E');
    edges.shift();
    snap(visitedNodes, visitedEdges, null, 'Pick edge B-E (weight 3). No cycle created. Add to MST.', edges, 5, { mst: mst.join(", ") });

    edges.shift();
    snap(visitedNodes, visitedEdges, null, 'Pick edge A-B (weight 4). Cycle detected (A and B already connected). Discard.', edges, 5, { mst: mst.join(", ") });

    mst.push('E-F');
    visitedNodes.push('F');
    visitedEdges.push('E-F');
    edges.shift();
    snap(visitedNodes, visitedEdges, null, 'Pick edge E-F (weight 4). No cycle created. Add to MST.', edges, 5, { mst: mst.join(", ") });

    snap(visitedNodes, visitedEdges, null, 'Kruskal Complete! Minimum Spanning Tree constructed with total weight: 12.', [], 5, { mst: mst.join(", ") });
  }

  return { steps, graph };
}

export function generateDPSteps(algorithmId, input = {}) {
  const steps = [];

  if (algorithmId === 'fibonacci') {
    const n = input.n || 8;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 0;
    dp[1] = 1;

    steps.push({
      dp: [...dp],
      currentI: 1,
      description: `Initialize base cases: dp[0] = 0, dp[1] = 1`,
      table: dp.slice(0, n + 1),
      line: 3,
      state: { dp: `[${dp.join(", ")}]` }
    });

    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      steps.push({
        dp: [...dp],
        currentI: i,
        description: `Compute dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`,
        table: dp.slice(0, n + 1),
        line: 5,
        state: { dp: `[${dp.join(", ")}]`, i }
      });
    }
    steps.push({
      dp: [...dp],
      currentI: -1,
      description: `Fibonacci(${n}) = ${dp[n]}. Done!`,
      table: dp.slice(0, n + 1),
      line: 6,
      state: { dp: `[${dp.join(", ")}]`, result: dp[n] }
    });
  }

  else if (algorithmId === 'climbing-stairs') {
    const n = input.n || 5;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    dp[1] = 1;

    steps.push({
      dp: [...dp],
      currentI: 1,
      description: `Initialize base cases: dp[0] = 1 (1 way for 0 steps), dp[1] = 1 (1 way for 1 step)`,
      table: dp.slice(0, n + 1),
      line: 2,
      state: { dp: `[${dp.join(", ")}]` }
    });

    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      steps.push({
        dp: [...dp],
        currentI: i,
        description: `Calculate ways for step ${i}: dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]} ways`,
        table: dp.slice(0, n + 1),
        line: 5,
        state: { dp: `[${dp.join(", ")}]`, i }
      });
    }
  }

  else if (algorithmId === 'house-robber') {
    const houses = input.houses || [2, 7, 9, 3, 1];
    const n = houses.length;
    const dp = new Array(n).fill(0);
    dp[0] = houses[0];
    dp[1] = Math.max(houses[0], houses[1]);

    steps.push({
      dp: [...dp],
      currentI: 1,
      description: `Initialize house values: dp[0] = ${dp[0]} (rob first house), dp[1] = max(${houses[0]}, ${houses[1]}) = ${dp[1]} (rob house 1 or 2)`,
      table: dp,
      line: 4,
      state: { houses: `[${houses.join(", ")}]`, dp: `[${dp.join(", ")}]` }
    });

    for (let i = 2; i < n; i++) {
      dp[i] = Math.max(houses[i] + dp[i - 2], dp[i - 1]);
      steps.push({
        dp: [...dp],
        currentI: i,
        description: `Robbing house ${i} (value ${houses[i]}): Choose max(rob this house + dp[${i-2}], skip this house dp[${i-1}]) = max(${houses[i]} + ${dp[i-2]}, ${dp[i-1]}) = ${dp[i]}`,
        table: dp,
        line: 6,
        state: { houses: `[${houses.join(", ")}]`, dp: `[${dp.join(", ")}]`, i }
      });
    }
  }

  else if (algorithmId === 'lcs') {
    const s1 = input.s1 || 'ABCBDAB';
    const s2 = input.s2 || 'BDCAB';
    const m = s1.length, n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    steps.push({
      dp: dp.map(r => [...r]),
      currentI: 0, currentJ: 0,
      description: `Initialize LCS grid with zeros (size ${m+1} x ${n+1})`,
      s1, s2,
      line: 3,
      state: { s1, s2 }
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const match = s1[i - 1] === s2[j - 1];
        if (match) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          steps.push({
            dp: dp.map(r => [...r]),
            currentI: i, currentJ: j,
            description: `Characters match '${s1[i-1]}' == '${s2[j-1]}': dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`,
            s1, s2, match: true,
            line: 7,
            state: { i, j, char: s1[i-1], match: "true", val: dp[i][j] }
          });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          steps.push({
            dp: dp.map(r => [...r]),
            currentI: i, currentJ: j,
            description: `Characters mismatch '${s1[i-1]}' != '${s2[j-1]}': dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${dp[i][j]}`,
            s1, s2, match: false,
            line: 9,
            state: { i, j, char1: s1[i-1], char2: s2[j-1], match: "false", val: dp[i][j] }
          });
        }
      }
    }
    steps.push({
      dp: dp.map(r => [...r]),
      currentI: -1, currentJ: -1,
      description: `LCS completed! Max subsequence length is ${dp[m][n]}`,
      s1, s2,
      line: 10,
      state: { lcs_length: dp[m][n] }
    });
  }

  else if (algorithmId === 'knapsack') {
    const weights = input.weights || [2, 3, 4];
    const values = input.values || [3, 4, 5];
    const W = input.W || 5;
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

    steps.push({
      dp: dp.map(r => [...r]),
      currentI: 0, currentW: 0,
      description: `Initialize Knapsack DP table (size ${n+1} x ${W+1}) with 0s`,
      weights, values, W,
      line: 3,
      state: { weights: `[${weights.join(", ")}]`, values: `[${values.join(", ")}]`, W }
    });

    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= W; w++) {
        if (weights[i - 1] <= w) {
          dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
          steps.push({
            dp: dp.map(r => [...r]),
            currentI: i, currentW: w,
            description: `Item ${i} fits (weight ${weights[i-1]} <= capacity ${w}): dp[${i}][${w}] = max(val ${values[i-1]} + dp[${i-1}][${w-weights[i-1]}], dp[${i-1}][${w}]) = ${dp[i][w]}`,
            weights, values, W,
            line: 7,
            state: { i, w, "item weight": weights[i-1], "item value": values[i-1], val: dp[i][w] }
          });
        } else {
          dp[i][w] = dp[i - 1][w];
          steps.push({
            dp: dp.map(r => [...r]),
            currentI: i, currentW: w,
            description: `Item ${i} is too heavy (weight ${weights[i-1]} > capacity ${w}): dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}`,
            weights, values, W,
            line: 10,
            state: { i, w, "item weight": weights[i-1], val: dp[i][w] }
          });
        }
      }
    }

    steps.push({
      dp: dp.map(r => [...r]),
      currentI: -1, currentW: -1,
      description: `Knapsack calculation complete! Max value obtained: ${dp[n][W]}`,
      weights, values, W,
      line: 11,
      state: { max_value: dp[n][W] }
    });
  }

  else if (algorithmId === 'coin-change') {
    const coins = input.coins || [1, 2, 5];
    const amt = input.amt || 5;
    const dp = new Array(amt + 1).fill(Infinity);
    dp[0] = 0;

    steps.push({
      dp: [...dp],
      currentI: 0,
      description: `Initialize dp array of size ${amt+1}. Set base case dp[0] = 0.`,
      coins, amt,
      line: 3,
      state: { coins: `[${coins.join(", ")}]`, amt, dp: JSON.stringify(dp) }
    });

    for (let i = 1; i <= amt; i++) {
      steps.push({
        dp: [...dp],
        currentI: i,
        description: `Calculating minimum coins needed for amount ${i}...`,
        coins, amt,
        line: 4,
        state: { amount: i, dp: JSON.stringify(dp) }
      });

      for (let j = 0; j < coins.length; j++) {
        const coin = coins[j];
        if (i - coin >= 0) {
          const old = dp[i];
          dp[i] = Math.min(dp[i], dp[i - coin] + 1);
          steps.push({
            dp: [...dp],
            currentI: i, currentCoin: coin,
            description: `Try coin ${coin} for amount ${i}: dp[${i}] = min(${old === Infinity ? '∞' : old}, dp[${i-coin}]+1) = ${dp[i] === Infinity ? '∞' : dp[i]}`,
            coins, amt,
            line: 7,
            state: { amount: i, coin, val: dp[i] === Infinity ? '∞' : dp[i] }
          });
        }
      }
    }

    steps.push({
      dp: [...dp],
      currentI: -1,
      description: `Coin change complete! Min coins needed for ${amt} is ${dp[amt] === Infinity ? -1 : dp[amt]}`,
      coins, amt,
      line: 8,
      state: { min_coins: dp[amt] === Infinity ? -1 : dp[amt] }
    });
  }

  return steps;
}

export function generateTreeSteps(algorithmId, values = [50, 30, 70, 20, 40, 60, 80]) {
  const steps = [];

  class TreeNode {
    constructor(val) { this.val = val; this.left = null; this.right = null; }
  }

  function treeToLayout(root, x = 400, y = 60, dx = 120, level = 0) {
    if (!root) return { nodes: [], edges: [] };
    const nodes = [{ id: root.val, x, y, val: root.val }];
    const edges = [];
    const left = treeToLayout(root.left, x - dx / (level + 1) * 2, y + 80, dx, level + 1);
    const right = treeToLayout(root.right, x + dx / (level + 1) * 2, y + 80, dx, level + 1);
    if (root.left) edges.push({ from: root.val, to: root.left.val });
    if (root.right) edges.push({ from: root.val, to: root.right.val });
    return {
      nodes: [...nodes, ...left.nodes, ...right.nodes],
      edges: [...edges, ...left.edges, ...right.edges],
    };
  }

  let root = null;

  if (algorithmId === 'bst-insert') {
    // Empty initial step
    steps.push({
      nodes: [],
      edges: [],
      currentNode: null,
      description: "Initialize empty BST root Node.",
      line: 2,
      state: { root: "None" }
    });

    function insertBST(currNode, val) {
      if (!currNode) {
        return { node: new TreeNode(val), line: 3 };
      }
      if (val < currNode.val) {
        const res = insertBST(currNode.left, val);
        currNode.left = res.node;
        return { node: currNode, line: 5 };
      } else {
        const res = insertBST(currNode.right, val);
        currNode.right = res.node;
        return { node: currNode, line: 7 };
      }
    }

    // Step-by-step path traversal simulation
    let tempRootNode = null;
    for (let index = 0; index < values.length; index++) {
      const val = values[index];

      // Simulate traversal steps
      let currentPathNode = tempRootNode;
      let pathString = "Root";

      while (currentPathNode) {
        steps.push({
          ...treeToLayout(tempRootNode),
          currentNode: currentPathNode.val,
          description: `Compare: ${val} vs node ${currentPathNode.val}`,
          line: 4,
          state: { insert_value: val, current_comparer: currentPathNode.val, path: pathString }
        });

        if (val < currentPathNode.val) {
          pathString += " -> Left";
          steps.push({
            ...treeToLayout(tempRootNode),
            currentNode: currentPathNode.val,
            description: `${val} < ${currentPathNode.val}, go left`,
            line: 5,
            state: { insert_value: val, current_comparer: currentPathNode.val, path: pathString }
          });
          currentPathNode = currentPathNode.left;
        } else {
          pathString += " -> Right";
          steps.push({
            ...treeToLayout(tempRootNode),
            currentNode: currentPathNode.val,
            description: `${val} >= ${currentPathNode.val}, go right`,
            line: 7,
            state: { insert_value: val, current_comparer: currentPathNode.val, path: pathString }
          });
          currentPathNode = currentPathNode.right;
        }
      }

      // Perform actual insertion
      const res = insertBST(tempRootNode, val);
      tempRootNode = res.node;

      steps.push({
        ...treeToLayout(tempRootNode),
        currentNode: val,
        description: `Insert new Node containing value ${val} at target spot`,
        line: 3,
        state: { inserted: val, path: pathString }
      });
    }
  }

  else if (algorithmId === 'inorder') {
    // Pre-populate tree
    let insertRoot = null;
    for (const val of values) {
      function insertBSTSimple(curr, v) {
        if (!curr) return new TreeNode(v);
        if (v < curr.val) curr.left = insertBSTSimple(curr.left, v);
        else curr.right = insertBSTSimple(curr.right, v);
        return curr;
      }
      insertRoot = insertBSTSimple(insertRoot, val);
    }

    const layout = treeToLayout(insertRoot);
    const result = [];

    function inorder(node) {
      if (!node) {
        steps.push({
          ...layout,
          currentNode: null,
          visited: [...result],
          description: `Hit dead end (Null node), backtracking`,
          line: 2,
          state: { visited: result.join(", ") }
        });
        return;
      }

      steps.push({
        ...layout,
        currentNode: node.val,
        visited: [...result],
        description: `Traversing left child of node ${node.val}`,
        line: 3,
        state: { visiting_node: node.val, traversed: result.join(", ") }
      });

      inorder(node.left);

      result.push(node.val);

      steps.push({
        ...layout,
        currentNode: node.val,
        visited: [...result],
        description: `Visit node ${node.val}. Append value to result list.`,
        line: 4,
        state: { visiting_node: node.val, traversed: result.join(", ") }
      });

      steps.push({
        ...layout,
        currentNode: node.val,
        visited: [...result],
        description: `Traversing right child of node ${node.val}`,
        line: 5,
        state: { visiting_node: node.val, traversed: result.join(", ") }
      });

      inorder(node.right);
    }

    steps.push({ ...layout, currentNode: null, visited: [], description: 'Start Inorder traversal (Left → Root → Right)', line: 1, state: { visited: "" } });
    inorder(insertRoot);
    steps.push({ ...layout, currentNode: null, visited: result, description: `Inorder Traversal complete: [${result.join(', ')}]`, line: 1, state: { final_result: result.join(", ") } });
  }

  return steps;
}
