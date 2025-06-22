let bars = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('array-container');
    const sortButton = document.getElementById('sortArray');
    const generateButton = document.getElementById('generateArray');
    const speedSlider = document.getElementById('speed');
    const sizeSlider = document.getElementById('arraySize');

    let isSorting = false;

    function getSortSpeed() {
        return (Number(speedSlider.max) + Number(speedSlider.min)) - Number(speedSlider.value);
    }

    function generateNewArray() {
        if (isSorting) return;

        const arraySize = Number(sizeSlider.value);
        container.innerHTML = '';
        bars = [];

        for (let i = 0; i < arraySize; i++) {
            const bar = document.createElement('div');
            const barHeight = Math.floor(Math.random() * 250) + 30;
            bar.classList.add('bar');
            bar.style.height = `${barHeight}px`;
            bar.style.width = `${90 / arraySize}%`;
            bars.push(bar);
            container.appendChild(bar);
        }
    }

    function toggleControls(state) {
        isSorting = state;
        sortButton.disabled = state;
        generateButton.disabled = state;
        sizeSlider.disabled = state;
    }

    function swapDOMNodes(nodeA, nodeB) {
        const parent = nodeA.parentNode;
        const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
        parent.insertBefore(nodeA, nodeB);
        parent.insertBefore(nodeB, siblingA);
    }

    async function selectionSort() {
        if (isSorting || bars.length <= 1) return;

        toggleControls(true);
        const heights = bars.map(bar => parseInt(bar.style.height));
        const length = heights.length;

        try {
            for (let i = 0; i < length - 1; i++) {
                let minIndex = i;

                bars[minIndex].classList.add('min-element');
                await sleep(getSortSpeed());

                for (let j = i + 1; j < length; j++) {
                    bars[j].classList.add('comparing');
                    await sleep(getSortSpeed());

                    if (heights[j] < heights[minIndex]) {
                        bars[minIndex].classList.remove('min-element');
                        minIndex = j;
                        bars[minIndex].classList.add('min-element');
                    }
                    bars[j].classList.remove('comparing');
                }

                if (minIndex !== i) {
                    bars[i].classList.add('swapping');
                    bars[minIndex].classList.add('swapping');
                    await sleep(getSortSpeed() * 2);

                    [heights[i], heights[minIndex]] = [heights[minIndex], heights[i]];
                    swapDOMNodes(bars[i], bars[minIndex]);
                    [bars[i], bars[minIndex]] = [bars[minIndex], bars[i]];

                    await sleep(getSortSpeed());
                    bars[minIndex].classList.remove('swapping');
                }
                
                bars[i].classList.remove('min-element', 'swapping');
                bars[i].classList.add('sorted');
            }
            if (bars.length > 0) {
                 bars[length - 1].classList.add('sorted');
            }
        } finally {
            toggleControls(false);
        }
    }

    generateButton.addEventListener('click', generateNewArray);
    sizeSlider.addEventListener('input', generateNewArray);
    sortButton.addEventListener('click', selectionSort);

    generateNewArray();
});