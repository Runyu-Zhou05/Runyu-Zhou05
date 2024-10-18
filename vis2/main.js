window.onload = function() {
    const animationZone = document.getElementById('animationZone');
    const width = animationZone.clientWidth;
    const height = animationZone.clientHeight;

    // Predefined classes and their images
    const classes = ['axolotl', 'grouse', 'car', 'pirate']; // Replace with your actual class names
    const imgCounts = [4, 4, 4, 4];
    const allEdges = { // here image index starts from 1
        'axolotl': [[1, 2], [1, 3], [1, 4], [3, 4]],
        'car': [[1, 2], [2, 3], [2, 4], [3, 4]],
        'grouse': [[1, 2], [1, 3], [2, 3], [2, 4]],
        'pirate': [[1, 2], [1, 3], [1, 4], [2, 4], [3, 4]],
    }

    const allFaultyEdges = [
        ['car', 4, 'grouse', 1],
        ['car', 3, 'grouse', 2],
    ];

    let classImgIndices = {};

    // Iterate through classes and images to load them
    const allImages = [];
    const allEdgeImages = {};
    const allFaultyImages = [];
    
    classes.forEach((className, classIndex) => {
        for (let i = 1; i <= imgCounts[classIndex]; i++) {
            const img = new Image();
            img.style.display = 'block';
            img.style.position = 'absolute';
            img.style.opacity = 0;
            img.src = `./imgs/${className}/${i}.png`;
            img.classList.add('vertex-image'); // Add a class for styling or manipulation
            img.dataset.class = className; // Store class information for later use
            img.dataset.classIndex = classIndex;
            img.dataset.index = i; // Store index information

            // Add the image to the animation zone
            animationZone.appendChild(img);
            allImages.push(img);
            if(className in classImgIndices)
            {
                classImgIndices[className].push(allImages.length - 1);
            }
            else
            {
                classImgIndices[className] = [allImages.length - 1];
            }
        }
        allEdgeImages[className] = {};
        allEdges[className].forEach((edge) => {
            const popupImage = new Image();
            popupImage.src = `./imgs/${className}/${edge[0]}_${edge[1]}.png`;
            popupImage.classList.add('popup-image');

            popupImage.onload = function() {
                const nwidth = popupImage.naturalWidth;
                const nheight = popupImage.naturalHeight;
        
                const factor = Math.min(width * .3 / nwidth, height * .9 / nheight);
        
                const pwidth = nwidth * factor;
                const pheight = nheight * factor;

                popupImage.style.display = 'none';
                popupImage.style.position = 'absolute';
                // popupImage.style.left = `${edgeCenterX - 50}px`; // Adjust to center
                // popupImage.style.top = `${edgeCenterY - 50}px`; // Adjust to center
                popupImage.style.left = `${(width - pwidth) / 2}px`;
                popupImage.style.top = `${(height - pheight) / 2}px`;
                popupImage.style.width = `${pwidth}px`;
                popupImage.style.height = `${pheight}px`;
                popupImage.style.opacity = 0;
                animationZone.appendChild(popupImage); // Add to DOM
                allEdgeImages[className][edge.join('_')] = popupImage;
            };
        });
    });

    allFaultyEdges.forEach((faultyEdge) => {
        const img1Class = faultyEdge[0];
        const img1Index = faultyEdge[1];
        const img2Class = faultyEdge[2];
        const img2Index = faultyEdge[3];
        const edgeName = `${img1Class}_${img1Index}_${img2Class}_${img2Index}`;
        const popupImage = new Image();
        popupImage.src = `./imgs/faulty/${edgeName}.png`;
        popupImage.classList.add('popup-image');

        popupImage.onload = function() {
            const nwidth = popupImage.naturalWidth;
            const nheight = popupImage.naturalHeight;
    
            const factor = Math.min(width * .3 / nwidth, height * .9 / nheight);
    
            const pwidth = nwidth * factor;
            const pheight = nheight * factor;

            popupImage.style.display = 'none';
            popupImage.style.position = 'absolute';
            // popupImage.style.left = `${edgeCenterX - 50}px`; // Adjust to center
            // popupImage.style.top = `${edgeCenterY - 50}px`; // Adjust to center
            popupImage.style.left = `${(width - pwidth) / 2}px`;
            popupImage.style.top = `${(height - pheight) / 2}px`;
            popupImage.style.width = `${pwidth}px`;
            popupImage.style.height = `${pheight}px`;
            popupImage.style.opacity = 0;
            animationZone.appendChild(popupImage); // Add to DOM
            allFaultyImages[edgeName] = popupImage;
        };
    });

    const classnum = classes.length;
    const h = height * 0.39;
    const w = width * 0.4;
    const hh = height * 0.19;
    const ww = width * 0.15;

    allImages.forEach((img) => {
        const classIndex = img.dataset.classIndex;
        const angle = 360 / classnum; // Adjust for image positioning within class
        const classX = width / 2 + w * cosDeg(angle * classIndex + 45);
        const classY = height / 2 + h * sinDeg(angle * classIndex + 45);
        const imgAngle = 360 / imgCounts[classIndex];
        const imgCenterX = classX + ww * cosDeg(imgAngle * img.dataset.index + 135);
        const imgCenterY = classY + hh * sinDeg(imgAngle * img.dataset.index + 135);

        img.size = {};
        img.size.width = 100;
        img.size.height = 100;

        const imgX = imgCenterX - img.size.width / 2;
        const imgY = imgCenterY - img.size.height / 2;

        img.style.top = `${imgY}px`;
        img.style.left = `${imgX}px`;
        img.style.width = `${img.size.width}px`;
        img.style.height = `${img.size.height}px`;

        img.pos = {};
        // Update position for the next transition
        img.pos.left = imgX;
        img.pos.top = imgY;
    });

    window.allImages = allImages;
    window.classes = classes;
    window.imgCounts = imgCounts;
    window.classImgIndices = classImgIndices;

    window.edges = allEdges;
    window.allEdgeImages = allEdgeImages;
    window.allFaultyImages = allFaultyImages;

    window.animationProgram = [
        ['imageDisplay', 'car', 1],
        ['imageDisplay', 'car', 2],
        ['edgeConnection', 'car', 1, 'car', 2],
        ['imageDisplay', 'car', 3],
        ['edgeConnection', 'car', 2, 'car', 3],
        ['imageDisplay', 'car', 4],
        ['edgeConnection', 'car', 3, 'car', 4],
        ['edgeConnection', 'car', 2, 'car', 4],
        ['imageDisplay', 'grouse', 1],
        ['faultyEdge', 'car', 4, 'grouse', 1],
        ['imageDisplay', 'grouse', 2],
        ['edgeConnection', 'grouse', 1, 'grouse', 2],
        ['faultyEdge', 'car', 3, 'grouse', 2],
        ['simultaneousClassDisplay', 'grouse'],
        ['simultaneousClassDisplay', 'pirate'],
        ['simultaneousClassDisplay', 'axolotl'],
    ];

    window.delays = {
        'imageDisplay': 700,
        'edgeConnection': 2100,
        'faultyEdge': 2600,
        'simultaneousClassDisplay': 2000,
    }

    window.createdEdges = new Set();

    document.getElementById('startButton').disabled = false;

    const cross = document.getElementById('cross');
    const cstyle = window.getComputedStyle(cross);
    const cwidth = parseInt(cstyle.width.slice(0, -2));
    const cheight = parseInt(cstyle.height.slice(0, -2));
    cross.style.left = `${(width - cwidth) / 2}px`;
    cross.style.top = `${(height - cheight) / 2}px`;
}

document.getElementById('startButton').addEventListener('click', function() {
    this.disabled = true;
    startAnimation();
});

function startAnimation() {
    setTimeout(() => animationStep(0), 500);
}

function animationStep(idx) {
    if(idx >= window.animationProgram.length) { return; }

    const animationInfo = window.animationProgram[idx];
    const animationType = animationInfo[0];

    switch(animationType) {
        case 'imageDisplay':
        {
            imgClass = animationInfo[1];
            imgIndex = animationInfo[2] - 1;
            const img = window.allImages[window.classImgIndices[imgClass][imgIndex]];
            img.style.opacity = 1;
            // transition
            img.style.transition = 'opacity 0.5s';
            break;
        }
        case 'edgeConnection':
        {
            const img1Class = animationInfo[1];
            const img1Index = animationInfo[2] - 1;
            const img2Class = animationInfo[3];
            const img2Index = animationInfo[4] - 1;
            createEdge(img1Class, img1Index, img2Class, img2Index);
            const popupImage = window.allEdgeImages
                [img1Class][(img1Index + 1) + '_' + (img2Index + 1)];
            popupImage.style.opacity = 0;
            popupImage.style.display = 'block';
            popupImage.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                popupImage.style.opacity = 1;
                // transition
                setTimeout(() => {
                    popupImage.style.opacity = 0;
                    setTimeout(() => {
                        popupImage.style.display = 'none';
                    }, 700);
                }, 1300);
            }, 50);
            break;
        }
        case 'faultyEdge':
        {
            const img1Class = animationInfo[1];
            const img1Index = animationInfo[2] - 1;
            const img2Class = animationInfo[3];
            const img2Index = animationInfo[4] - 1;
            const edgeName = `${img1Class}_${img1Index + 1}_${img2Class}_${img2Index + 1}`;
            createFaultyEdge(img1Class, img1Index, img2Class, img2Index);
            const popupImage = window.allFaultyImages[edgeName];
            popupImage.style.opacity = 0;
            popupImage.style.display = 'block';
            popupImage.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                popupImage.style.opacity = 1;
                // transition
                setTimeout(() => {
                    popupImage.style.opacity = 0;
                    setTimeout(() => {
                        popupImage.style.display = 'none';
                    }, 700);
                }, 1800);
            }, 50);
            const cross = document.getElementById('cross');
            cross.style.zIndex = 2000;
            cross.style.transition = 'opacity 0.5s';
            cross.style.display = 'block';
            cross.style.opacity = 0;
            setTimeout(() => {
                cross.style.opacity = 1;
                // transition
                setTimeout(() => {
                    cross.style.opacity = 0;
                    setTimeout(() => {
                        cross.style.display = 'none';
                    }, 700);
                }, 900);
            }, 950);
            break;
        }
        case 'simultaneousClassDisplay':
        {
            const className = animationInfo[1];
            window.classImgIndices[className].forEach(imgIndex => {
                const img = window.allImages[imgIndex];
                if(img.style.opacity == 0)
                {
                    img.style.opacity = 1;
                    // transition
                    img.style.transition = 'opacity 0.7s';
                }
            });
            setTimeout(() => {
                window.edges[className].forEach(edge => {
                    createEdge(className, edge[0] - 1, className, edge[1] - 1);
                });}, 700);
            break;
        }
    }

    setTimeout(() => animationStep(idx + 1), window.delays[animationType]);
}

function createEdge(img1Class, img1Index, img2Class, img2Index) {
    edgeName = img1Class + '_' + img1Index + '_' + img2Class + '_' + img2Index;
    if(window.createdEdges.has(edgeName)) { return; }
    window.createdEdges.add(edgeName);
    const img1 = window.allImages[window.classImgIndices[img1Class][img1Index]];
    const img2 = window.allImages[window.classImgIndices[img2Class][img2Index]];
    const img1CenterX = img1.pos.left + img1.size.width / 2;
    const img1CenterY = img1.pos.top + img1.size.height / 2;
    const img2CenterX = img2.pos.left + img2.size.width / 2;
    const img2CenterY = img2.pos.top + img2.size.height / 2;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", img1CenterX);
    line.setAttribute("y1", img1CenterY);
    line.setAttribute("x2", img2CenterX);
    line.setAttribute("y2", img2CenterY);
    line.setAttribute("class", "edge-line");
    line.style.opacity = 0; // Start hidden
    const svg = document.getElementById('edgesLayer');
    svg.appendChild(line);
    // transition
    line.style.transition = 'opacity 0.7s'; // Fade in transition
    setTimeout(() => {
        line.style.opacity = 1; // Show edges gradually
    }, 50);
    popupImage = window.allEdgeImages[img1Class][(img1Index + 1) + '_' + (img2Index + 1)];
    handleEdgeHover(line, popupImage);
}

function createFaultyEdge(img1Class, img1Index, img2Class, img2Index) {
    edgeName = img1Class + '_' + img1Index + '_' + img2Class + '_' + img2Index;
    const img1 = window.allImages[window.classImgIndices[img1Class][img1Index]];
    const img2 = window.allImages[window.classImgIndices[img2Class][img2Index]];
    const img1CenterX = img1.pos.left + img1.size.width / 2;
    const img1CenterY = img1.pos.top + img1.size.height / 2;
    const img2CenterX = img2.pos.left + img2.size.width / 2;
    const img2CenterY = img2.pos.top + img2.size.height / 2;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", img1CenterX);
    line.setAttribute("y1", img1CenterY);
    line.setAttribute("x2", img2CenterX);
    line.setAttribute("y2", img2CenterY);
    line.setAttribute("class", "edge-line-faulty");
    line.style.opacity = 0; // Start hidden
    const svg = document.getElementById('edgesLayer');
    svg.appendChild(line);
    // transition
    line.style.transition = 'opacity 0.5s'; // Fade in transition
    setTimeout(() => {
        line.style.opacity = 1; // Show edges gradually
        setTimeout(() => {
            line.style.opacity = 0; // Hide edges gradually
            setTimeout(() => {
                svg.removeChild(line); // Remove from DOM
            }, 700);
        }, 1800);
    }, 50);
}

function cosDeg(deg) {
    return Math.cos(deg * Math.PI / 180);
}

function sinDeg(deg) {
    return Math.sin(deg * Math.PI / 180);
}

function handleEdgeHover(line, popupImage) {
    line.addEventListener('mouseenter', function() {
        popupImage.style.display = 'block';
        popupImage.style.opacity = 1;
    });

    line.addEventListener('mouseleave', function() {
        popupImage.style.display = 'none';
        popupImage.style.opacity = 0;
    });
}
