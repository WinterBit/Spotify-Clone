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

hoverNode(search, "highlight")
hoverNode(search, "fillwhite")

search.addEventListener("click", (e) => {
    search.classList.add("borderwhite");
    e.stopPropagation();
})

document.body.addEventListener("click", () => {
    search.classList.remove("borderwhite");
})



