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

    function generateNewArray() {
        if (isSorting) return;

        const arraySize = Number(sizeSlider.value);
        container.innerHTML = '';
        bars = [];

        for (let i = 0; i < arraySize; i++) {
            const bar = document.createElement('div');
            const barHeight = Math.floor(Math.random() * 250) + 30; // Between 30 and 280

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

    async function bubbleSort() {
        if (isSorting || bars.length <= 1) return;

        toggleControls(true);
        
        const heights = bars.map(bar => parseInt(bar.style.height));
        const length = heights.length;
        try {
            for (let i = 0; i < length - 1; i++) {
                for (let j = 0; j < length - i - 1; j++) {
                    const sortSpeed = (Number(speedSlider.max) + Number(speedSlider.min)) - Number(speedSlider.value);

                    bars[j].classList.add('comparing');
                    bars[j + 1].classList.add('comparing');
                    await sleep(sortSpeed);

                    if (heights[j] > heights[j + 1]) {
                        bars[j].classList.add('swapping');
                        bars[j + 1].classList.add('swapping');
                        await sleep(sortSpeed);

                        // Swap heights in temporary array
                        [heights[j], heights[j + 1]] = [heights[j + 1], heights[j]];
                        
                        // Swap bars in the DOM
                        container.insertBefore(bars[j + 1], bars[j]);

                        // Swap bars in array
                        [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];
                        
                        await sleep(sortSpeed);
                    }
                    bars[j].classList.remove('comparing', 'swapping');
                    bars[j + 1].classList.remove('comparing', 'swapping');
                }
                bars[length - 1 - i].classList.add('sorted');
            }
            if (bars.length > 0) {
                bars[0].classList.add('sorted');
            }
        } finally {
            toggleControls(false); // re enable controls
        }
    }

    generateButton.addEventListener('click', generateNewArray);
    sizeSlider.addEventListener('input', generateNewArray);
    sortButton.addEventListener('click', bubbleSort);
    
    generateNewArray();
});