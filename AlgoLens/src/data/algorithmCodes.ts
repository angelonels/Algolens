export type CodeLanguage = 'python' | 'javascript' | 'cpp' | 'java'
export type AlgorithmCodes = Record<CodeLanguage, string>
export const LANGUAGES: { key: CodeLanguage; label: string }[] = [
  { key: 'python', label: 'Python' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'cpp', label: 'C++' },
  { key: 'java', label: 'Java' },
]
export const STORAGE_KEY = 'algolens-code-lang'
export function getStoredLanguage(): CodeLanguage {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v && ['python','javascript','cpp','java'].includes(v)) return v as CodeLanguage
  } catch {}
  return 'python'
}
export function setStoredLanguage(lang: CodeLanguage) {
  try { localStorage.setItem(STORAGE_KEY, lang) } catch {}
}

export const BUBBLE_SORT_CODE: AlgorithmCodes = {
  python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
  javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`,
  cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
  java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
}

export const INSERTION_SORT_CODE: AlgorithmCodes = {
  python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
  javascript: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
  cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
  java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
}

export const SELECTION_SORT_CODE: AlgorithmCodes = {
  python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
  javascript: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}`,
  cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
  java: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
}

export const MERGE_SORT_CODE: AlgorithmCodes = {
  python: `def merge_sort(arr):
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
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
  javascript: `function mergeSort(arr) {
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
    return result.concat(left.slice(i), right.slice(j));
}`,
  cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin()+l, arr.begin()+m+1);
    vector<int> right(arr.begin()+m+1, arr.begin()+r+1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size())
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
  java: `public static void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}

static void merge(int[] arr, int l, int m, int r) {
    int[] left = Arrays.copyOfRange(arr, l, m + 1);
    int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.length && j < right.length)
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}`,
}

export const QUICK_SORT_CODE: AlgorithmCodes = {
  python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
  javascript: `function quickSort(arr, low, high) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
  cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
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
}`,
  java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

static int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    int temp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = temp;
    return i + 1;
}`,
}

export const HEAP_SORT_CODE: AlgorithmCodes = {
  python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

def heapify(arr, n, i):
    largest = i
    l, r = 2 * i + 1, 2 * i + 2
    if l < n and arr[l] > arr[largest]:
        largest = l
    if r < n and arr[r] > arr[largest]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
  javascript: `function heapSort(arr) {
    const n = arr.length;
    for (let i = Math.floor(n/2) - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }
}

function heapify(arr, n, i) {
    let largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}`,
  cpp: `void heapify(vector<int>& arr, int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n/2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
  java: `public static void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n/2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
        heapify(arr, i, 0);
    }
}

static void heapify(int[] arr, int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
        heapify(arr, n, largest);
    }
}`,
}

export const COUNTING_SORT_CODE: AlgorithmCodes = {
  python: `def counting_sort(arr):
    if not arr: return arr
    max_val = max(arr)
    count = [0] * (max_val + 1)
    for num in arr:
        count[num] += 1
    idx = 0
    for i in range(len(count)):
        while count[i] > 0:
            arr[idx] = i
            idx += 1
            count[i] -= 1
    return arr`,
  javascript: `function countingSort(arr) {
    if (!arr.length) return arr;
    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);
    for (const num of arr) count[num]++;
    let idx = 0;
    for (let i = 0; i < count.length; i++) {
        while (count[i]-- > 0) arr[idx++] = i;
    }
    return arr;
}`,
  cpp: `void countingSort(vector<int>& arr) {
    if (arr.empty()) return;
    int maxVal = *max_element(arr.begin(), arr.end());
    vector<int> count(maxVal + 1, 0);
    for (int num : arr) count[num]++;
    int idx = 0;
    for (int i = 0; i <= maxVal; i++)
        while (count[i]-- > 0) arr[idx++] = i;
}`,
  java: `public static void countingSort(int[] arr) {
    if (arr.length == 0) return;
    int max = Arrays.stream(arr).max().getAsInt();
    int[] count = new int[max + 1];
    for (int num : arr) count[num]++;
    int idx = 0;
    for (int i = 0; i < count.length; i++)
        while (count[i]-- > 0) arr[idx++] = i;
}`,
}

export const RADIX_SORT_CODE: AlgorithmCodes = {
  python: `def radix_sort(arr):
    if not arr: return arr
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10
    return arr

def counting_sort_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10
    for i in range(n):
        idx = (arr[i] // exp) % 10
        count[idx] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    for i in range(n - 1, -1, -1):
        idx = (arr[i] // exp) % 10
        output[count[idx] - 1] = arr[i]
        count[idx] -= 1
    for i in range(n):
        arr[i] = output[i]`,
  javascript: `function radixSort(arr) {
    if (!arr.length) return arr;
    const max = Math.max(...arr);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10)
        countingSortByDigit(arr, exp);
    return arr;
}

function countingSortByDigit(arr, exp) {
    const n = arr.length, output = new Array(n);
    const count = new Array(10).fill(0);
    for (let i = 0; i < n; i++)
        count[Math.floor(arr[i] / exp) % 10]++;
    for (let i = 1; i < 10; i++)
        count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
        const d = Math.floor(arr[i] / exp) % 10;
        output[--count[d]] = arr[i];
    }
    for (let i = 0; i < n; i++) arr[i] = output[i];
}`,
  cpp: `void countingSortByDigit(vector<int>& arr, int exp) {
    int n = arr.size();
    vector<int> output(n), count(10, 0);
    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        int d = (arr[i] / exp) % 10;
        output[--count[d]] = arr[i];
    }
    arr = output;
}

void radixSort(vector<int>& arr) {
    int maxVal = *max_element(arr.begin(), arr.end());
    for (int exp = 1; maxVal / exp > 0; exp *= 10)
        countingSortByDigit(arr, exp);
}`,
  java: `public static void radixSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    for (int exp = 1; max / exp > 0; exp *= 10)
        countingSortByDigit(arr, exp);
}

static void countingSortByDigit(int[] arr, int exp) {
    int n = arr.length;
    int[] output = new int[n], count = new int[10];
    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        int d = (arr[i] / exp) % 10;
        output[--count[d]] = arr[i];
    }
    System.arraycopy(output, 0, arr, 0, n);
}`,
}

export const BINARY_SEARCH_CODE: AlgorithmCodes = {
  python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
  javascript: `function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
  cpp: `int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
  java: `public static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
}

export const BFS_CODE: AlgorithmCodes = {
  python: `from collections import deque

def bfs(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    queue = deque([(start, [start])])
    visited = {start}
    
    while queue:
        (r, c), path = queue.popleft()
        if (r, c) == end:
            return path
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols
                and (nr, nc) not in visited
                and grid[nr][nc] != 1):
                visited.add((nr, nc))
                queue.append(((nr, nc), path + [(nr, nc)]))
    return None  # no path found`,
  javascript: `function bfs(grid, start, end) {
    const rows = grid.length, cols = grid[0].length;
    const queue = [[start, [start]]];
    const visited = new Set([start.toString()]);

    while (queue.length > 0) {
        const [[r, c], path] = queue.shift();
        if (r === end[0] && c === end[1]) return path;
        for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
            const nr = r + dr, nc = c + dc;
            const key = \`\${nr},\${nc}\`;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && !visited.has(key) && grid[nr][nc] !== 1) {
                visited.add(key);
                queue.push([[nr, nc], [...path, [nr, nc]]]);
            }
        }
    }
    return null;
}`,
  cpp: `vector<pair<int,int>> bfs(vector<vector<int>>& grid,
    pair<int,int> start, pair<int,int> end) {
    int rows = grid.size(), cols = grid[0].size();
    queue<pair<pair<int,int>, vector<pair<int,int>>>> q;
    set<pair<int,int>> visited;
    q.push({start, {start}});
    visited.insert(start);
    int dirs[][2] = {{0,1},{1,0},{0,-1},{-1,0}};

    while (!q.empty()) {
        auto [pos, path] = q.front(); q.pop();
        if (pos == end) return path;
        for (auto& d : dirs) {
            int nr = pos.first+d[0], nc = pos.second+d[1];
            pair<int,int> np = {nr, nc};
            if (nr>=0 && nr<rows && nc>=0 && nc<cols
                && !visited.count(np) && grid[nr][nc]!=1) {
                visited.insert(np);
                auto newPath = path;
                newPath.push_back(np);
                q.push({np, newPath});
            }
        }
    }
    return {};
}`,
  java: `public static List<int[]> bfs(int[][] grid,
    int[] start, int[] end) {
    int rows = grid.length, cols = grid[0].length;
    Queue<Object[]> queue = new LinkedList<>();
    Set<String> visited = new HashSet<>();
    List<int[]> initPath = new ArrayList<>();
    initPath.add(start);
    queue.add(new Object[]{start, initPath});
    visited.add(start[0] + "," + start[1]);
    int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};

    while (!queue.isEmpty()) {
        Object[] curr = queue.poll();
        int[] pos = (int[]) curr[0];
        List<int[]> path = (List<int[]>) curr[1];
        if (pos[0]==end[0] && pos[1]==end[1]) return path;
        for (int[] d : dirs) {
            int nr = pos[0]+d[0], nc = pos[1]+d[1];
            String key = nr + "," + nc;
            if (nr>=0 && nr<rows && nc>=0 && nc<cols
                && !visited.contains(key) && grid[nr][nc]!=1) {
                visited.add(key);
                List<int[]> newPath = new ArrayList<>(path);
                newPath.add(new int[]{nr, nc});
                queue.add(new Object[]{new int[]{nr,nc}, newPath});
            }
        }
    }
    return null;
}`,
}

export const DFS_CODE: AlgorithmCodes = {
  python: `def dfs(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    stack = [(start, [start])]
    visited = set()
    
    while stack:
        (r, c), path = stack.pop()
        if (r, c) in visited:
            continue
        visited.add((r, c))
        if (r, c) == end:
            return path
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols
                and (nr, nc) not in visited
                and grid[nr][nc] != 1):
                stack.append(((nr, nc), path + [(nr, nc)]))
    return None  # no path found`,
  javascript: `function dfs(grid, start, end) {
    const rows = grid.length, cols = grid[0].length;
    const stack = [[start, [start]]];
    const visited = new Set();

    while (stack.length > 0) {
        const [[r, c], path] = stack.pop();
        const key = \`\${r},\${c}\`;
        if (visited.has(key)) continue;
        visited.add(key);
        if (r === end[0] && c === end[1]) return path;
        for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && !visited.has(\`\${nr},\${nc}\`)
                && grid[nr][nc] !== 1) {
                stack.push([[nr, nc], [...path, [nr, nc]]]);
            }
        }
    }
    return null;
}`,
  cpp: `vector<pair<int,int>> dfs(vector<vector<int>>& grid,
    pair<int,int> start, pair<int,int> end) {
    int rows = grid.size(), cols = grid[0].size();
    stack<pair<pair<int,int>, vector<pair<int,int>>>> st;
    set<pair<int,int>> visited;
    st.push({start, {start}});
    int dirs[][2] = {{0,1},{1,0},{0,-1},{-1,0}};

    while (!st.empty()) {
        auto [pos, path] = st.top(); st.pop();
        if (visited.count(pos)) continue;
        visited.insert(pos);
        if (pos == end) return path;
        for (auto& d : dirs) {
            int nr = pos.first+d[0], nc = pos.second+d[1];
            pair<int,int> np = {nr, nc};
            if (nr>=0 && nr<rows && nc>=0 && nc<cols
                && !visited.count(np) && grid[nr][nc]!=1) {
                auto newPath = path;
                newPath.push_back(np);
                st.push({np, newPath});
            }
        }
    }
    return {};
}`,
  java: `public static List<int[]> dfs(int[][] grid,
    int[] start, int[] end) {
    int rows = grid.length, cols = grid[0].length;
    Deque<Object[]> stack = new ArrayDeque<>();
    Set<String> visited = new HashSet<>();
    List<int[]> initPath = new ArrayList<>();
    initPath.add(start);
    stack.push(new Object[]{start, initPath});
    int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};

    while (!stack.isEmpty()) {
        Object[] curr = stack.pop();
        int[] pos = (int[]) curr[0];
        String key = pos[0] + "," + pos[1];
        if (visited.contains(key)) continue;
        visited.add(key);
        List<int[]> path = (List<int[]>) curr[1];
        if (pos[0]==end[0] && pos[1]==end[1]) return path;
        for (int[] d : dirs) {
            int nr = pos[0]+d[0], nc = pos[1]+d[1];
            String nk = nr + "," + nc;
            if (nr>=0 && nr<rows && nc>=0 && nc<cols
                && !visited.contains(nk) && grid[nr][nc]!=1) {
                List<int[]> newPath = new ArrayList<>(path);
                newPath.add(new int[]{nr, nc});
                stack.push(new Object[]{new int[]{nr,nc}, newPath});
            }
        }
    }
    return null;
}`,
}

export const DIJKSTRA_CODE: AlgorithmCodes = {
  python: `import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    visited = set()
    
    while pq:
        curr_dist, curr = heapq.heappop(pq)
        if curr in visited: continue
        visited.add(curr)
        for neighbor, weight in graph[curr]:
            distance = curr_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    return distances`,
  javascript: `function dijkstra(graph, start) {
    const distances = {};
    for (const node in graph) distances[node] = Infinity;
    distances[start] = 0;
    const visited = new Set();
    const pq = [{ node: start, dist: 0 }];

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { node: curr, dist } = pq.shift();
        if (visited.has(curr)) continue;
        visited.add(curr);
        for (const { node: neighbor, weight } of graph[curr]) {
            const newDist = dist + weight;
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                pq.push({ node: neighbor, dist: newDist });
            }
        }
    }
    return distances;
}`,
  cpp: `unordered_map<string,int> dijkstra(
    unordered_map<string,vector<pair<string,int>>>& graph,
    string start) {
    unordered_map<string,int> dist;
    for (auto& [k,_] : graph) dist[k] = INT_MAX;
    dist[start] = 0;
    priority_queue<pair<int,string>, vector<pair<int,string>>,
        greater<>> pq;
    pq.push({0, start});
    unordered_set<string> visited;

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (visited.count(u)) continue;
        visited.insert(u);
        for (auto& [v, w] : graph[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
  java: `public static Map<String,Integer> dijkstra(
    Map<String,List<int[]>> graph, String start) {
    Map<String,Integer> dist = new HashMap<>();
    for (String node : graph.keySet())
        dist.put(node, Integer.MAX_VALUE);
    dist.put(start, 0);
    Set<String> visited = new HashSet<>();
    PriorityQueue<int[]> pq = new PriorityQueue<>(
        Comparator.comparingInt(a -> a[1]));
    // Use index mapping for PQ; simplified:
    PriorityQueue<Object[]> queue = new PriorityQueue<>(
        (a, b) -> (int)a[1] - (int)b[1]);
    queue.add(new Object[]{start, 0});

    while (!queue.isEmpty()) {
        Object[] curr = queue.poll();
        String u = (String) curr[0];
        int d = (int) curr[1];
        if (visited.contains(u)) continue;
        visited.add(u);
        for (int[] edge : graph.getOrDefault(u, List.of())) {
            // edge = {neighborIndex, weight}
            int newDist = d + edge[1];
            // simplified for visualization
        }
    }
    return dist;
}`,
}

export const EUCLIDEAN_GCD_CODE: AlgorithmCodes = {
  python: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a`,
  javascript: `function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}`,
  cpp: `int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`,
  java: `public static int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`,
}

export const MATRIX_TRAVERSAL_CODE: AlgorithmCodes = {
  python: `def spiral_traverse(matrix):
    result = []
    if not matrix: return result
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for j in range(left, right + 1):
            result.append(matrix[top][j])
        top += 1
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left - 1, -1):
                result.append(matrix[bottom][j])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
    return result`,
  javascript: `function spiralTraverse(matrix) {
    const result = [];
    if (!matrix.length) return result;
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++)
            result.push(matrix[top][j]);
        top++;
        for (let i = top; i <= bottom; i++)
            result.push(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (let j = right; j >= left; j--)
                result.push(matrix[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (let i = bottom; i >= top; i--)
                result.push(matrix[i][left]);
            left++;
        }
    }
    return result;
}`,
  cpp: `vector<int> spiralTraverse(vector<vector<int>>& matrix) {
    vector<int> result;
    if (matrix.empty()) return result;
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++)
            result.push_back(matrix[top][j]);
        top++;
        for (int i = top; i <= bottom; i++)
            result.push_back(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--)
                result.push_back(matrix[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--)
                result.push_back(matrix[i][left]);
            left++;
        }
    }
    return result;
}`,
  java: `public static List<Integer> spiralTraverse(int[][] matrix) {
    List<Integer> result = new ArrayList<>();
    if (matrix.length == 0) return result;
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++)
            result.add(matrix[top][j]);
        top++;
        for (int i = top; i <= bottom; i++)
            result.add(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--)
                result.add(matrix[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--)
                result.add(matrix[i][left]);
            left++;
        }
    }
    return result;
}`,
}

export const EDIT_DISTANCE_CODE: AlgorithmCodes = {
  python: `def edit_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i  # delete all chars
    for j in range(n + 1):
        dp[0][j] = j  # insert all chars
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # match
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # delete
                    dp[i][j-1],    # insert
                    dp[i-1][j-1]   # replace
                )
    return dp[m][n]`,
  javascript: `function editDistance(word1, word2) {
    const m = word1.length, n = word2.length;
    const dp = Array.from({length: m+1}, () => Array(n+1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i-1] === word2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i-1][j],    // delete
                    dp[i][j-1],    // insert
                    dp[i-1][j-1]   // replace
                );
            }
        }
    }
    return dp[m][n];
}`,
  cpp: `int editDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i-1] == word2[j-1])
                dp[i][j] = dp[i-1][j-1];
            else
                dp[i][j] = 1 + min({dp[i-1][j],
                    dp[i][j-1], dp[i-1][j-1]});
        }
    }
    return dp[m][n];
}`,
  java: `public static int editDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i-1) == word2.charAt(j-1))
                dp[i][j] = dp[i-1][j-1];
            else
                dp[i][j] = 1 + Math.min(dp[i-1][j-1],
                    Math.min(dp[i-1][j], dp[i][j-1]));
        }
    }
    return dp[m][n];
}`,
}

export const KMEANS_CODE: AlgorithmCodes = {
  python: `import random
import math

def k_means(points, k, max_iters=100):
    # Initialize centroids randomly from data points
    centroids = random.sample(points, k)
    
    for _ in range(max_iters):
        # Assign each point to nearest centroid
        clusters = [[] for _ in range(k)]
        for point in points:
            dists = [math.dist(point, c) for c in centroids]
            closest = dists.index(min(dists))
            clusters[closest].append(point)
        
        # Update centroids to mean of assigned points
        new_centroids = []
        for cluster in clusters:
            if cluster:
                cx = sum(p[0] for p in cluster) / len(cluster)
                cy = sum(p[1] for p in cluster) / len(cluster)
                new_centroids.append((cx, cy))
            else:
                new_centroids.append(random.choice(points))
        
        if new_centroids == centroids:
            break  # converged
        centroids = new_centroids
    
    return centroids, clusters`,
  javascript: `function kMeans(points, k, maxIters = 100) {
    let centroids = points.slice().sort(() => Math.random()-0.5).slice(0,k);
    for (let iter = 0; iter < maxIters; iter++) {
        const clusters = Array.from({length: k}, () => []);
        for (const p of points) {
            let minD = Infinity, closest = 0;
            centroids.forEach((c, i) => {
                const d = Math.hypot(p[0]-c[0], p[1]-c[1]);
                if (d < minD) { minD = d; closest = i; }
            });
            clusters[closest].push(p);
        }
        const newCentroids = clusters.map((cl, i) => {
            if (!cl.length) return centroids[i];
            return [
                cl.reduce((s,p) => s+p[0], 0) / cl.length,
                cl.reduce((s,p) => s+p[1], 0) / cl.length
            ];
        });
        const moved = centroids.some((c,i) =>
            Math.hypot(c[0]-newCentroids[i][0], c[1]-newCentroids[i][1]) > 0.001);
        centroids = newCentroids;
        if (!moved) break;
    }
    return centroids;
}`,
  cpp: `vector<pair<double,double>> kMeans(
    vector<pair<double,double>>& points, int k, int maxIters=100) {
    vector<pair<double,double>> centroids(points.begin(), points.begin()+k);
    for (int iter = 0; iter < maxIters; iter++) {
        vector<vector<pair<double,double>>> clusters(k);
        for (auto& p : points) {
            double minD = 1e18; int closest = 0;
            for (int i = 0; i < k; i++) {
                double d = hypot(p.first-centroids[i].first,
                                 p.second-centroids[i].second);
                if (d < minD) { minD = d; closest = i; }
            }
            clusters[closest].push_back(p);
        }
        bool moved = false;
        for (int i = 0; i < k; i++) {
            if (clusters[i].empty()) continue;
            double cx=0, cy=0;
            for (auto& p : clusters[i]) { cx+=p.first; cy+=p.second; }
            pair<double,double> nc = {cx/clusters[i].size(), cy/clusters[i].size()};
            if (hypot(nc.first-centroids[i].first, nc.second-centroids[i].second) > 0.001)
                moved = true;
            centroids[i] = nc;
        }
        if (!moved) break;
    }
    return centroids;
}`,
  java: `public static double[][] kMeans(double[][] points, int k) {
    double[][] centroids = Arrays.copyOf(points, k);
    for (int iter = 0; iter < 100; iter++) {
        List<List<double[]>> clusters = new ArrayList<>();
        for (int i = 0; i < k; i++) clusters.add(new ArrayList<>());
        for (double[] p : points) {
            double minD = Double.MAX_VALUE; int closest = 0;
            for (int i = 0; i < k; i++) {
                double d = Math.hypot(p[0]-centroids[i][0], p[1]-centroids[i][1]);
                if (d < minD) { minD = d; closest = i; }
            }
            clusters.get(closest).add(p);
        }
        boolean moved = false;
        for (int i = 0; i < k; i++) {
            if (clusters.get(i).isEmpty()) continue;
            double cx = 0, cy = 0;
            for (double[] p : clusters.get(i)) { cx += p[0]; cy += p[1]; }
            double[] nc = {cx/clusters.get(i).size(), cy/clusters.get(i).size()};
            if (Math.hypot(nc[0]-centroids[i][0], nc[1]-centroids[i][1]) > 0.001)
                moved = true;
            centroids[i] = nc;
        }
        if (!moved) break;
    }
    return centroids;
}`,
}

export const LINEAR_REGRESSION_CODE: AlgorithmCodes = {
  python: `import numpy as np

def linear_regression_gd(X, y, lr=0.01, epochs=100):
    m, b = 0.0, 0.0
    n = len(X)
    history = []
    
    for epoch in range(epochs):
        y_pred = m * X + b
        cost = (1/n) * np.sum((y - y_pred) ** 2)
        dm = (-2/n) * np.sum(X * (y - y_pred))
        db = (-2/n) * np.sum(y - y_pred)
        m -= lr * dm
        b -= lr * db
        history.append((m, b, cost))
    
    return m, b, history`,
  javascript: `function linearRegressionGD(X, y, lr = 0.01, epochs = 100) {
    let m = 0, b = 0;
    const n = X.length;
    const history = [];

    for (let epoch = 0; epoch < epochs; epoch++) {
        const yPred = X.map(x => m * x + b);
        const cost = yPred.reduce((s, p, i) =>
            s + (y[i] - p) ** 2, 0) / n;
        const dm = (-2/n) * X.reduce((s, x, i) =>
            s + x * (y[i] - yPred[i]), 0);
        const db = (-2/n) * y.reduce((s, yi, i) =>
            s + (yi - yPred[i]), 0);
        m -= lr * dm;
        b -= lr * db;
        history.push({ m, b, cost });
    }
    return { m, b, history };
}`,
  cpp: `struct LRResult { double m, b; vector<double> costs; };

LRResult linearRegressionGD(vector<double>& X, vector<double>& y,
    double lr = 0.01, int epochs = 100) {
    double m = 0, b = 0;
    int n = X.size();
    vector<double> costs;

    for (int ep = 0; ep < epochs; ep++) {
        double dm = 0, db = 0, cost = 0;
        for (int i = 0; i < n; i++) {
            double pred = m * X[i] + b;
            double err = y[i] - pred;
            cost += err * err;
            dm += -2.0 * X[i] * err;
            db += -2.0 * err;
        }
        cost /= n; dm /= n; db /= n;
        m -= lr * dm;
        b -= lr * db;
        costs.push_back(cost);
    }
    return {m, b, costs};
}`,
  java: `public static double[] linearRegressionGD(double[] X, double[] y,
    double lr, int epochs) {
    double m = 0, b = 0;
    int n = X.length;

    for (int ep = 0; ep < epochs; ep++) {
        double dm = 0, db = 0;
        for (int i = 0; i < n; i++) {
            double pred = m * X[i] + b;
            double err = y[i] - pred;
            dm += -2.0 * X[i] * err;
            db += -2.0 * err;
        }
        dm /= n; db /= n;
        m -= lr * dm;
        b -= lr * db;
    }
    return new double[]{m, b};
}`,
}

export const LOGISTIC_REGRESSION_CODE: AlgorithmCodes = {
  python: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def logistic_regression(X, y, lr=0.1, epochs=100):
    w, b = 0.0, 0.0
    n = len(X)
    history = []
    
    for epoch in range(epochs):
        z = w * X + b
        y_pred = sigmoid(z)
        # Binary cross-entropy loss
        cost = -(1/n) * np.sum(
            y * np.log(y_pred + 1e-8) +
            (1 - y) * np.log(1 - y_pred + 1e-8))
        dw = (1/n) * np.sum((y_pred - y) * X)
        db = (1/n) * np.sum(y_pred - y)
        w -= lr * dw
        b -= lr * db
        history.append((w, b, cost))
    
    return w, b, history`,
  javascript: `function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}

function logisticRegression(X, y, lr = 0.1, epochs = 100) {
    let w = 0, b = 0;
    const n = X.length;

    for (let ep = 0; ep < epochs; ep++) {
        let dw = 0, db = 0;
        for (let i = 0; i < n; i++) {
            const pred = sigmoid(w * X[i] + b);
            dw += (pred - y[i]) * X[i];
            db += (pred - y[i]);
        }
        w -= lr * (dw / n);
        b -= lr * (db / n);
    }
    return { w, b };
}`,
  cpp: `double sigmoid(double z) {
    return 1.0 / (1.0 + exp(-z));
}

pair<double,double> logisticRegression(
    vector<double>& X, vector<int>& y,
    double lr = 0.1, int epochs = 100) {
    double w = 0, b = 0;
    int n = X.size();

    for (int ep = 0; ep < epochs; ep++) {
        double dw = 0, db = 0;
        for (int i = 0; i < n; i++) {
            double pred = sigmoid(w * X[i] + b);
            dw += (pred - y[i]) * X[i];
            db += (pred - y[i]);
        }
        w -= lr * (dw / n);
        b -= lr * (db / n);
    }
    return {w, b};
}`,
  java: `public static double sigmoid(double z) {
    return 1.0 / (1.0 + Math.exp(-z));
}

public static double[] logisticRegression(double[] X, int[] y,
    double lr, int epochs) {
    double w = 0, b = 0;
    int n = X.length;

    for (int ep = 0; ep < epochs; ep++) {
        double dw = 0, db = 0;
        for (int i = 0; i < n; i++) {
            double pred = sigmoid(w * X[i] + b);
            dw += (pred - y[i]) * X[i];
            db += (pred - y[i]);
        }
        w -= lr * (dw / n);
        b -= lr * (db / n);
    }
    return new double[]{w, b};
}`,
}

export const DECISION_TREE_CODE: AlgorithmCodes = {
  python: `class DecisionTree:
    def __init__(self, max_depth=4):
        self.max_depth = max_depth
    
    def gini(self, groups, classes):
        total = sum(len(g) for g in groups)
        score = 0.0
        for group in groups:
            if len(group) == 0: continue
            s = 0.0
            for c in classes:
                p = [r[-1] for r in group].count(c) / len(group)
                s += p * p
            score += (1 - s) * len(group) / total
        return score
    
    def split(self, data, feature, value):
        left = [r for r in data if r[feature] < value]
        right = [r for r in data if r[feature] >= value]
        return left, right
    
    def best_split(self, data):
        classes = list(set(r[-1] for r in data))
        best = {'gini': 1.0}
        for feat in range(len(data[0]) - 1):
            for row in data:
                left, right = self.split(data, feat, row[feat])
                g = self.gini([left, right], classes)
                if g < best['gini']:
                    best = {'feature': feat, 'value': row[feat],
                            'gini': g, 'groups': (left, right)}
        return best`,
  javascript: `class DecisionTree {
    constructor(maxDepth = 4) { this.maxDepth = maxDepth; }

    gini(groups, classes) {
        const total = groups.reduce((s, g) => s + g.length, 0);
        let score = 0;
        for (const group of groups) {
            if (!group.length) continue;
            let s = 0;
            for (const c of classes) {
                const p = group.filter(r => r.label === c).length / group.length;
                s += p * p;
            }
            score += (1 - s) * (group.length / total);
        }
        return score;
    }

    bestSplit(data) {
        const classes = [...new Set(data.map(r => r.label))];
        let best = { gini: 1.0 };
        for (const feat of ['x', 'y']) {
            for (const row of data) {
                const left = data.filter(r => r[feat] < row[feat]);
                const right = data.filter(r => r[feat] >= row[feat]);
                const g = this.gini([left, right], classes);
                if (g < best.gini)
                    best = { feature: feat, value: row[feat], gini: g };
            }
        }
        return best;
    }
}`,
  cpp: `struct Node {
    int feature; double value, gini;
    int prediction; bool isLeaf;
    Node* left; Node* right;
};

double gini(vector<vector<double>>& groups,
    vector<int>& classes) {
    int total = 0;
    for (auto& g : groups) total += g.size();
    if (total == 0) return 0;
    double score = 0;
    for (auto& group : groups) {
        if (group.empty()) continue;
        double s = 0;
        for (int c : classes) {
            int cnt = 0;
            for (auto& r : group)
                if ((int)r.back() == c) cnt++;
            double p = (double)cnt / group.size();
            s += p * p;
        }
        score += (1 - s) * group.size() / total;
    }
    return score;
}`,
  java: `class DecisionTree {
    int maxDepth;
    DecisionTree(int maxDepth) { this.maxDepth = maxDepth; }

    double gini(List<List<double[]>> groups, Set<Integer> classes) {
        int total = groups.stream().mapToInt(List::size).sum();
        if (total == 0) return 0;
        double score = 0;
        for (List<double[]> group : groups) {
            if (group.isEmpty()) continue;
            double s = 0;
            for (int c : classes) {
                double p = group.stream()
                    .filter(r -> (int)r[r.length-1] == c).count()
                    / (double)group.size();
                s += p * p;
            }
            score += (1 - s) * group.size() / total;
        }
        return score;
    }
}`,
}
