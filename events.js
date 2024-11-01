function hoverNodes(elem, cls) {
    elem.forEach(element => {

        element.addEventListener("mouseover", () => {
            element.classList.add(cls);
        })

        element.addEventListener("mouseout", () => {
            element.classList.remove(cls);
        })
    });
}

function hoverNode(element, cls) {
    element.addEventListener("mouseover", () => {
        element.classList.add(cls);
    })

    element.addEventListener("mouseout", () => {
        element.classList.remove(cls);
    })
}


let links = document.querySelectorAll(".top li a");

links.forEach(element => {
    element.addEventListener("mouseover", () => {
        element.classList.add("colorwhite", "underline");
    })

    element.addEventListener("mouseout", () => {
        element.classList.remove("colorwhite", "underline");
    })
});

let btmlinks = document.querySelectorAll(".lbottom a");

hoverNodes(btmlinks, "colorwhite");

let library = document.querySelector(".library");
let libsvg = document.querySelector(".library img");

library.addEventListener("mouseover", () => {
    library.classList.add("colorwhite");
    libsvg.classList.add("fillwhite");
})

library.addEventListener("mouseout", () => {
    library.classList.remove("colorwhite");
    libsvg.classList.remove("fillwhite");
})

let bell = document.querySelector(".navright img");
let home = document.querySelector(".home img")
hoverNode(bell, "fillwhite");
hoverNode(home, "fillwhite");

let search = document.querySelector(".search");
let searchsvg = document.querySelector(".search img")

hoverNode(search, "fillwhite")
hoverNode(search, "highlight")

search.addEventListener("click", (e) => {
    search.classList.add("borderwhite", "clicklight", "clickwhite");
    e.stopPropagation();
})

document.body.addEventListener("click", () => {
    search.classList.remove("borderwhite", "clicklight", "clickwhite");
})

let seekbar = document.getElementById("seekbar");
let circle = document.getElementById("circle");
let progress = document.getElementById("progress");

seekbar.addEventListener("mouseover", () => {
    circle.style.opacity = 1;
    progress.style.background = "#1cb955";
})

seekbar.addEventListener("mouseout", () => {
    circle.style.opacity = 0;
    progress.style.background = "#ffffff";
})

let pre = document.getElementById("previous");
let forw = document.getElementById("forward");
hoverNode(pre, "fillwhite");
hoverNode(forw, "fillwhite");

let vol = document.querySelector(".volume input");
let volcircle = document.getElementById("volcircle");
let volprogress = document.getElementById("volprogress");

vol.oninput = function () {
    volprogress.style.width = this.value + "%";
    volcircle.style.left = this.value < 1 ? this.value : (this.value - 1) + "%";
}

vol.addEventListener("mouseover", () => {
    volcircle.style.opacity = 1;
    volprogress.style.background = "#1cb955";
})

vol.addEventListener("mouseout", () => {
    volcircle.style.opacity = 0;
    volprogress.style.background = "#ffffff";
})
