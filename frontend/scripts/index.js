// DOM elements
const imgSampleElements = document.getElementsByClassName("image-examples");

function loadImageSamples() {
    for(var i=0; i<imgSampleElements.length; i++) {
        imgSampleElements[i].src = `./assets/samples/${i+1}.png`
    }
}

// Default onload page state
window.addEventListener("load", (event) => {
    loadImageSamples()
});