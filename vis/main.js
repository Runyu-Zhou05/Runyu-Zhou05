document.getElementById('startButton').addEventListener('click', function() {
    this.disabled = true;
    loadImagesAndStartAnimation();
});

function loadImagesAndStartAnimation() {
    const animationZone = document.getElementById('animationZone');

    // Predefined classes and their images
    const classes = ['axolotl', 'car', 'grouse', 'pirate']; // Replace with your actual class names
    const imgCounts = [4, 4, 4, 4];

    // Iterate through classes and images to load them
    const allImages = [];
    
    classes.forEach((className, classIndex) => {
        for (let i = 1; i <= imgCounts[classIndex]; i++) {
            const img = new Image();
            img.style.display = 'none'; // hide the images for now
            img.src = `./imgs/${className}/${i}.png`;
            img.classList.add('vertex-image'); // Add a class for styling or manipulation
            img.dataset.class = className; // Store class information for later use
            img.dataset.classIndex = classIndex;
            img.dataset.index = i; // Store index information

            // Add the image to the animation zone
            animationZone.appendChild(img);
            allImages.push(img);
        }
    });

    // Once images are loaded, start the animation
    setTimeout(() => {
        startAnimation(allImages, {'classes': classes, 'imgCounts': imgCounts});
    }, 500); // Wait a bit before starting the animation
}

function startAnimation(images, info) {
    const animationZone = document.getElementById('animationZone');
    const width = animationZone.clientWidth;
    const height = animationZone.clientHeight;

    // First stage: Randomly arrange in a grid.
    const gridRows = 2;
    const gridCols = 8; // Can adapt based on image count.

    imgWidth = 100;
    imgHeight = 100;

    gridHeight = height / gridRows;
    gridWidth = width / gridCols;

    images.forEach((img, index) => {
        // Position them in a grid layout first.
        let row = Math.floor(index / gridCols);
        let col = index % gridCols;
        img.style.display = 'block'; // show the images
        img.style.position = 'absolute';
        topPos = row * gridHeight + (gridHeight - imgHeight) / 2;
        leftPos = col * gridWidth + (gridWidth - imgWidth) / 2;

        // Give some width and height for the images
        img.style.width = `${imgWidth}px`;
        img.style.height = `${imgHeight}px`;

        img.pos = {};
        img.size = {};
        img.pos.top = topPos;
        img.pos.left = leftPos;
        img.size.width = imgWidth;
        img.size.height = imgHeight;
    });

    // generate random permutations of [0, 1, ..., images.length - 1]
    const permutations = [];
    for (let i = 0; i < images.length; i++) {
        permutations.push(i);
    }
    for (let i = 0; i < images.length; i++) {
        const j = Math.floor(Math.random() * permutations.length);
        const k = Math.floor(Math.random() * permutations.length);
        const temp = permutations[k];
        permutations[k] = permutations[j];
        permutations[j] = temp;
    }

    images.forEach((img, index) => {
        topPos = images[permutations[index]].pos.top;
        leftPos = images[permutations[index]].pos.left;

        img.style.top = `${topPos}px`;
        img.style.left = `${leftPos}px`;
        img.curpos = {};
        img.curpos.top = topPos;
        img.curpos.left = leftPos;
    })

    images.forEach((img, index) => {
        img.pos = img.curpos;
    });

    setTimeout(() => moveToGraph(images, width, height, info), 1500);
}

function cosDeg(deg) {
    return Math.cos(deg * Math.PI / 180);
}

function sinDeg(deg) {
    return Math.sin(deg * Math.PI / 180);
}

function moveToGraph(images, width, height, info) {
    const h = height * 0.39;
    const w = width * 0.4;
    const hh = height * 0.19;
    const ww = width * 0.15;

    const classnum = info.classes.length;

    // Animate moving images to their positions within the classes
    images.forEach((img, index) => {
        const classIndex = img.dataset.classIndex;
        const angle = 360 / classnum; // Adjust for image positioning within class
        const classX = width / 2 + w * cosDeg(angle * classIndex + 45);
        const classY = height / 2 + h * sinDeg(angle * classIndex + 45);
        const imgAngle = 360 / info.imgCounts[classIndex];
        const imgCenterX = classX + ww * cosDeg(imgAngle * img.dataset.index + 45);
        const imgCenterY = classY + hh * sinDeg(imgAngle * img.dataset.index + 45);
        const imgX = imgCenterX - img.size.width / 2;
        const imgY = imgCenterY - img.size.height / 2;

        const deltaX = imgX - img.pos.left;
        const deltaY = imgY - img.pos.top;

        img.style.transition = 'transform 1s';
        img.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        // Update position for the next transition
        img.pos.left = imgX;
        img.pos.top = imgY;
    });

    // Draw edges after all images have moved
    setTimeout(() => {
        drawEdges(images, info);
    }, 500); // Wait for the images to finish moving
}

function drawEdges(images, info) {
    const svg = document.getElementById('edgesLayer');
    const edges = [];
    const classes = info.classes;

    classes.forEach(className => {
        const classImages = images.filter(img => img.dataset.class === className);
        const classPositions = classImages.map(img => ({
            element: img,
            centerX: img.pos.left + img.size.width / 2,
            centerY: img.pos.top + img.size.height / 2
        }));

        // Create edges between each image in the same class
        for (let i = 0; i < classPositions.length; i++) {
            for (let j = i + 1; j < classPositions.length; j++) {
                const img1 = classPositions[i];
                const img2 = classPositions[j];

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", img1.centerX);
                line.setAttribute("y1", img1.centerY);
                line.setAttribute("x2", img2.centerX);
                line.setAttribute("y2", img2.centerY);
                line.setAttribute("class", "edge-line");
                line.style.opacity = 0; // Start hidden
                line.style.transition = 'opacity 1s'; // Fade in transition

                // Load the edge image
                const edgeImagePath = `./imgs/${className}/${i + 1}_${j + 1}.png`; // Adjust the path as needed

                handleEdgeHover(line, edgeImagePath);

                svg.appendChild(line);
                edges.push(line);
            }
        }
    });

    // Fade in the edges
    setTimeout(() => {
        edges.forEach(edge => {
            edge.style.opacity = 1; // Show edges gradually
        });
    }, 100);
}

function handleEdgeHover(edge, imgPath) {
    const animationZone = document.getElementById('animationZone');
    const awidth = animationZone.clientWidth;
    const aheight = animationZone.clientHeight;

    const popupImage = document.createElement('img');
    popupImage.src = imgPath;
    popupImage.classList.add('popup-image');

    popupImage.onload = function() {
        const nwidth = popupImage.naturalWidth;
        const nheight = popupImage.naturalHeight;

        const factor = Math.min(awidth * .3 / nwidth, aheight * .9 / nheight);

        const pwidth = nwidth * factor;
        const pheight = nheight * factor;
        console.log(nwidth, nheight, pwidth, pheight);

        edge.addEventListener('mouseenter', function() {
            // Position the popup image near the edge
            const bbox = edge.getBoundingClientRect();

            popupImage.style.display = 'block';
            popupImage.style.position = 'absolute';
            // popupImage.style.left = `${edgeCenterX - 50}px`; // Adjust to center
            // popupImage.style.top = `${edgeCenterY - 50}px`; // Adjust to center
            popupImage.style.left = `${(awidth - pwidth) / 2}px`;
            popupImage.style.top = `${(aheight - pheight) / 2}px`;
            popupImage.style.width = `${pwidth}px`;
            popupImage.style.height = `${pheight}px`;
            animationZone.appendChild(popupImage); // Add to DOM
        });
    };

    edge.addEventListener('mouseleave', function() {
        popupImage.style.display = 'none';
        animationZone.removeChild(popupImage); // Remove from DOM
    });
}
