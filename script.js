// Canvas Fire, by written Luc van den Brand, adapted from: http://fabiensanglard.net/doom_fire_psx/

const FLAME_DECAY = 4,
      FLAME_X_RAND = 4,
      FLAME_Y_RAND = 8;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Starting Canvas Fire!");
    const canvas = document.getElementById('canvas');
    setupCanvasResize(canvas);
    setupCanvasRender(canvas);
});

const setupCanvasResize = canvas => {
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
};

const setupCanvasRender = canvas => {
    const context = canvas.getContext('2d');

    const initializeCanvas = () => {
        const startFrame = context.getImageData(0, 0, canvas.width, canvas.height);
        const initializedFrame = renderInitialFrame(startFrame);
        context.putImageData(initializedFrame, 0, 0);
    };

    const handleAnimationFrame = () => {
        const currentFrame = context.getImageData(0, 0, canvas.width, canvas.height);
        const nextFrame = renderNextFrame(currentFrame);
        context.putImageData(nextFrame, 0, 0);
        window.requestAnimationFrame(handleAnimationFrame); 
    };

    initializeCanvas();
    window.requestAnimationFrame(handleAnimationFrame);
};

const renderInitialFrame = startFrame => {
    const width = startFrame.width;
    const height = startFrame.height;
    let initialFrame = startFrame;
     
    for (let y = 0; y < height - 1; y++) {
        for (let x = 0; x < width; x++) {
            const index = coordToIndex(x, y, width);
            initialFrame.data[index] = 0;
            initialFrame.data[index + 1] = 0;
            initialFrame.data[index + 2] = 0;
            initialFrame.data[index + 3] = 255;
        }
    }

    for (let x = 0; x < width; x++) {
        const index = coordToIndex(x, height - 1, width);
        initialFrame.data[index] = 255;
        initialFrame.data[index + 1] = 0;
        initialFrame.data[index + 2] = 0;
        initialFrame.data[index + 3] = 255;
    }

    return initialFrame;
};

const renderNextFrame = currentFrame => {
    const width = currentFrame.width;
    const height = currentFrame.height;
    let nextFrame = currentFrame;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const parentIndex = coordToIndex(x, y, width);            
            let newValue = currentFrame.data[parentIndex] - Math.random() * FLAME_DECAY;
            const normalizedNewValue = Math.floor(Math.max(0, newValue));
            
            let randX = FLAME_X_RAND/2 - Math.random() * FLAME_X_RAND;
            let normalizedTargetX = Math.floor(Math.max(0, x - randX));
            let randY = Math.random() * FLAME_Y_RAND;
            let normalizedTargetY = Math.floor(Math.max(0, y - randY));
            const targetIndex = coordToIndex(normalizedTargetX, normalizedTargetY, width);
            nextFrame.data[targetIndex] = normalizedNewValue;
        }
    }

    return nextFrame;
};

const coordToIndex = (x, y, rowWidth) => {
    return x * 4 + y * 4 * rowWidth;
};
