let isPlaying = false;
let baseArray = [];
let array = [];
let steps = [];
let currentStep = 0;
let speed = 50;
let customArray = [];
let isCustomMode = false;

const algoSelect = document.getElementById("algo");
const complexityText = document.getElementById("complexityText");
const container = document.getElementById("array");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const explanationBox = document.getElementById("explanation");
const timeBox = document.getElementById("time");
const spaceBox = document.getElementById("space");
const speedSlider = document.getElementById("speed");
const customInput = document.getElementById("customInput");
const loadCustom = document.getElementById("loadCustom");

function updateSliderBackground() {
    let value = speedSlider.value;
    let min = speedSlider.min;
    let max = speedSlider.max;

    let percent = ((value - min) / (max - min)) * 100;

    speedSlider.style.background = `
        linear-gradient(
            90deg,
            #f9a8d4 0%,
            #c4b5fd ${percent}%,
            #d1d5db ${percent}%,
            #d1d5db 50%
        )
    `;
}

speedSlider.addEventListener("input", updateSliderBackground);
updateSliderBackground();

speedSlider.addEventListener("input", updateSliderBackground);
updateSliderBackground();

function initializeArray() {
    baseArray = [];
    for (let i = 1; i <= 50; i++) { 
        baseArray.push(i);
    }
}

// Generate random array
function generateArray() {
    if (baseArray.length === 0) {
        initializeArray();
    }

    array = shuffleArray(baseArray);

    steps = [];
    currentStep = 0;

    let algo = document.getElementById("algo").value;

    if (algo === "Bubble Sort") {
        bubbleSortSteps([...array]);
    } else if (algo === "Selection Sort") {
        selectionSortSteps([...array]);
    } else if (algo === "Merge Sort") {
        mergeSortSteps([...array]); 
    } else if (algo === "Insertion Sort"){
        insertionSortSteps([...array]);
    } else if (algo === "Quick Sort") {
    quickSortSteps([...array]);
    } else if (algo === "Heap Sort") {
    heapSortSteps([...array]);
    }
    render(array);
}

function shuffleArray(arr) {
    let a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Render bars
function render(arr, active = [], message = "", complexity = "") {
    container.innerHTML = "";

    arr.forEach((value, i) => {
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = (value*3) + "px";

        if (active.includes(i)) {
            bar.classList.add("active");
        }
        container.appendChild(bar);
    });

    // AUTO UPDATE EXPLANATION
    explanationBox.innerText = message || "Start sorting to see explanation";
    complexityText.innerText = complexity || "Time Complexity will appear here";
}

function animateSortedBars() {
    const bars = document.querySelectorAll(".bar");

    bars.forEach((bar, index) => {
        setTimeout(() => {
            // add sorted gradient
            bar.classList.add("sorted");

            // tiny pop animation
            bar.style.transform = "scale(1.05)";

            setTimeout(() => {
                bar.style.transform = "scale(1)";
            }, 200);

        }, index * 100);
    });

    // after animation ends, return to normal
    setTimeout(() => {
        bars.forEach(bar => {
            bar.classList.remove("sorted");
        });
    }, bars.length * 100 + 1200);
}

// Store steps for Bubble Sort
function bubbleSortSteps(arr) {
    let a = [...arr];

    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {

            steps.push({
                array: [...a],
                active: [j, j + 1],
                message: `Comparing ${a[j]} and ${a[j + 1]}`,
                complexity: `Nested loops → comparing adjacent elements repeatedly → O(n²)`
            });

            if (a[j] > a[j + 1]) {
                [a[j], a[j + 1]] = [a[j + 1], a[j]];

                steps.push({
                    array: [...a],
                    active: [j, j + 1],
                    message: `Swapped ${a[j + 1]} and ${a[j]}`,
                    complexity: `Swap inside nested loops → contributes to O(n²)`
                });
            }
        }
    }
}

function selectionSortSteps(arr) {
    let a = [...arr];

    for (let i = 0; i < a.length; i++) {
        let min = i;

        for (let j = i + 1; j < a.length; j++) {

            steps.push({
                array: [...a],
                active: [min, j],
                message: `Comparing current min ${a[min]} with ${a[j]}`,
                complexity: `Scanning remaining elements → still nested loop → O(n²)`
            });

            if (a[j] < a[min]) {
                min = j;

                steps.push({
                    array: [...a],
                    active: [min],
                    message: `New minimum found: ${a[min]}`,
                    complexity: `Finding minimum requires checking all remaining elements → O(n)`
                });
            }
        }

        if (min !== i) {
            [a[i], a[min]] = [a[min], a[i]];

            steps.push({
                array: [...a],
                active: [i, min],
                message: `Swapped ${a[min]} with ${a[i]}`,
                complexity: `Swap is constant time, but outer loop repeats n times → O(n²)`
            });
        }
    }
}

function insertionSortSteps(arr) {
    let a = [...arr];

    for (let i = 1; i < a.length; i++) {
        let key = a[i];
        let j = i - 1;

        steps.push({
            array: [...a],
            active: [i],
            message: `Picking ${key} to insert`,
            complexity: `Building sorted portion one element at a time`
        });

        while (j >= 0 && a[j] > key) {

            steps.push({
                array: [...a],
                active: [j, j + 1],
                message: `Shifting ${a[j]} to the right`,
                complexity: `Shifting elements → worst case many shifts → contributes to O(n²)`
            });

            a[j + 1] = a[j];
            j--;
        }

        a[j + 1] = key;

        steps.push({
            array: [...a],
            active: [j + 1],
            message: `Inserted ${key} at correct position`,
            complexity: `Insertion is quick, but shifting makes worst case O(n²)`
        });
    }
}

function mergeSortSteps(arr) {
    let a = [...arr];
    let comparisons = 0;

    function mergeSort(start, end) {
        if (start >= end) return;

        let mid = Math.floor((start + end) / 2);

        // show splitting
        steps.push({
            array: [...a],
            active: [start, mid, end],
            message: `Splitting array into two halves`,
            complexity: `Divide step → reduces problem size → contributes to O(log n)`
        });

        mergeSort(start, mid);
        mergeSort(mid + 1, end);

        merge(start, mid, end);
    }

    function merge(start, mid, end) {
        let left = a.slice(start, mid + 1);
        let right = a.slice(mid + 1, end + 1);

        let i = 0, j = 0, k = start;

        while (i < left.length && j < right.length) {
            comparisons++;

            steps.push({
                array: [...a],
                active: [k],
                message: `Comparing ${left[i]} and ${right[j]}`,
                complexity: `Merging step → linear comparisons → O(n)`
            });

            if (left[i] <= right[j]) {
                a[k] = left[i];
                i++;
            } else {
                a[k] = right[j];
                j++;
            }

            k++;

            steps.push({
                array: [...a],
                active: [k - 1],
                message: `Placing element in sorted position`,
                complexity: `Merging contributes O(n) per level → total O(n log n)`
            });
        }

        while (i < left.length) {
            a[k++] = left[i++];

            steps.push({
                array: [...a],
                active: [k - 1],
                message: `Adding remaining left elements`,
                complexity: `Remaining elements added in linear time`
            });
        }

        while (j < right.length) {
            a[k++] = right[j++];

            steps.push({
                array: [...a],
                active: [k - 1],
                message: `Adding remaining right elements`,
                complexity: `Remaining elements added in linear time`
            });
        }
    }

    mergeSort(0, a.length - 1);
}

function quickSortSteps(arr) {
    let a = [...arr];

    function quickSort(low, high) {
        if (low < high) {
            let pi = partition(low, high);

            steps.push({
                array: [...a],
                active: [pi],
                message: `Pivot ${a[pi]} placed at correct position`,
                complexity: `Partitioning divides the array → average O(n log n)`
            });

            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        }
    }

    function partition(low, high) {
        let pivot = a[high];
        let i = low - 1;

        steps.push({
            array: [...a],
            active: [high],
            message: `Choosing pivot: ${pivot}`,
            complexity: `Choosing pivot helps divide problem into smaller parts`
        });

        for (let j = low; j < high; j++) {
            steps.push({
                array: [...a],
                active: [j, high],
                message: `Comparing ${a[j]} with pivot ${pivot}`,
                complexity: `Each partition scans elements → O(n)`
            });

            if (a[j] < pivot) {
                i++;
                [a[i], a[j]] = [a[j], a[i]];

                steps.push({
                    array: [...a],
                    active: [i, j],
                    message: `Swapped ${a[i]} and ${a[j]}`,
                    complexity: `Swap helps move smaller elements left of pivot`
                });
            }
        }

        [a[i + 1], a[high]] = [a[high], a[i + 1]];

        return i + 1;
    }

    quickSort(0, a.length - 1);
} 

function heapSortSteps(arr) {
    let a = [...arr];
    let n = a.length;

    function heapify(n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        if (left < n) {
            steps.push({
                array: [...a],
                active: [i, left],
                message: `Comparing parent ${a[i]} with left child ${a[left]}`,
                complexity: `Heapify compares parent-child nodes`
            });

            if (a[left] > a[largest]) {
                largest = left;
            }
        }

        if (right < n) {
            steps.push({
                array: [...a],
                active: [largest, right],
                message: `Comparing current largest with right child ${a[right]}`,
                complexity: `Heap property must be maintained`
            });

            if (a[right] > a[largest]) {
                largest = right;
            }
        }

        if (largest !== i) {
            [a[i], a[largest]] = [a[largest], a[i]];

            steps.push({
                array: [...a],
                active: [i, largest],
                message: `Swapped ${a[i]} and ${a[largest]}`,
                complexity: `Heapify takes O(log n)`
            });

            heapify(n, largest);
        }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [a[0], a[i]] = [a[i], a[0]];

        steps.push({
            array: [...a],
            active: [0, i],
            message: `Moving max element to sorted position`,
            complexity: `Repeated extraction + heapify → total O(n log n)`
        });

        heapify(i, 0);
    }
}

if (algoSelect) {
    algoSelect.onchange = () => {
        isPlaying = false;
        currentStep = 0;
        steps = [];
        comparisons = 0;
        swaps = 0;
        playBtn.innerText = "Play";

        if (isCustomMode) {
            array = [...customArray];
        } else {
            generateArray();
        }

        render(
            array,
            [],
            "Start sorting to see explanation",
            "Time complexity will appear here"
        );
    };
}

if (loadCustom) {
    loadCustom.onclick = () => {
        const values = customInput.value
            .split(/[\s,]+/)
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num));

        if (values.length === 0) {
            alert("Please enter valid numbers!");
            return;
        }

        array = [...values];
        customArray = [...values];
        isCustomMode = true;

        isPlaying = false;
        currentStep = 0;
        steps = [];
        comparisons = 0;
        swaps = 0;
        playBtn.innerText = "Play";

        render(
            array,
            [],
            "✨ Custom input loaded!",
            "Choose a sorting algorithm and press Play"
        );
    };
}

// Next step
nextBtn.onclick = () => {
    if (currentStep < steps.length) {
        let step = steps[currentStep];
        console.log(step.complexity);
        render(step.array, step.active, step.message, step.complexity);
        currentStep++;
    }
};

// Previous step
prevBtn.onclick = () => {
    if (currentStep > 0) {
        currentStep--;
        let step = steps[currentStep];
        console.log(step.complexity);
        render(step.array, step.active, step.message, step.complexity);
    }
};

// Play animation
playBtn.onclick = async () => {

    // If already playing → PAUSE
    if (isPlaying) {
        isPlaying = false;
        playBtn.innerText = "Play";
        return;
    }

    // If paused → PLAY
    isPlaying = true;
    playBtn.innerText = "Pause";
    if (steps.length === 0) {
        let selectedAlgo = document.getElementById("algo").value;
        if (selectedAlgo === "bubble") {
            bubbleSortSteps(array);
        }
        else if (selectedAlgo === "selection") {
            selectionSortSteps(array);
        }
        else if (selectedAlgo === "insertion") {
            insertionSortSteps(array);
        }
        else if (selectedAlgo === "merge") {
            mergeSortSteps(array);
        }
        else if (selectedAlgo === "quick") {
            quickSortSteps(array);
        }
        else if (selectedAlgo === "heap") {
            heapSortSteps(array);
        }
    }

    for (; currentStep < steps.length; currentStep++) {

        if (!isPlaying) break;

        let step = steps[currentStep];
        console.log(step.complexity);
        render(step.array, step.active, step.message, step.complexity);

        await new Promise(r => setTimeout(r, 150 - speed));
    }

    // When finished
    if (currentStep >= steps.length) {
        isPlaying = false;
        playBtn.innerText = "Play";
        render(
        steps[steps.length - 1].array,
        [],
        "Sorting Complete!","Final sorted order achieved → algorithm finished successfully"
        );
        animateSortedBars();
        return;
    }
};

// Reset
resetBtn.onclick = () => {
    isPlaying = false;
    currentStep = 0;
    steps = [];
    comparisons = 0;
    swaps = 0;
    playBtn.innerText = "Play";

    if (isCustomMode) {
        array = [...customArray];
    } else {
        generateArray();
    }

    render(
        array,
        [],
        "Start sorting to see explanation",
        "Time Complexity will appear here"
    );
};

// Speed control
speedSlider.oninput = (e) => {
    speed = e.target.value;
};

// Initialize
generateArray();