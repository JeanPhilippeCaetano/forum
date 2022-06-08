const addChoosed = (value) => {
    const tags = document.querySelector(".tags-filters")
    tags.childNodes.forEach(elem => {
        if (elem.value == value) {
            elem.classList.toggle("choosed")
        }
    })
}

const addTagsPost = (value) => {
    const tags = document.querySelector(".tags-create-post")
    tags.childNodes.forEach(elem => {
        if (elem.value == value) {
            elem.classList.toggle("choosed")
        }
    })
}

const openPopup = () => {
    const behindPopup = document.querySelector(".overlay")
    behindPopup.classList.add("active")
}

const closePopup = () => {
    const behindPopup = document.querySelector(".overlay")
    behindPopup.classList.remove("active")
}

const openFilters = () => {
    const filters = document.querySelector(".filters-container")
    filters.classList.toggle("open")
}

/* Create post text zone */

tinymce.init({
  
    selector: '#mytextarea',

    plugins: [

      'a11ychecker','advlist','advcode','advtable','autolink','checklist','export',

      'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',

      'powerpaste','fullscreen','formatpainter','insertdatetime','media','table','help','wordcount'

    ],

    toolbar: 'undo redo | formatpainter casechange blocks | bold italic backcolor | ' +

      'alignleft aligncenter alignright alignjustify | ' +

      'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help '  
});


/* Pagination */

const slider = document.querySelector(".display-pages");
const slides = document.querySelectorAll(".slide");
const button = document.querySelectorAll(".arrow");

console.log(slides)

let current = 0;
let prev = (slides.length-1);
let next = 1;

for (let i = 0; i < button.length; i++) {
	button[i].addEventListener("click", () => {
        i == 0 ? gotoPrev() : gotoNext();
        changeTextContent()
    })
}

const gotoPrev = () => current > 0 ? gotoNum(current - 1) : gotoNum(slides.length - 1);

const gotoNext = () => current < slides.length -1 ? gotoNum(current + 1) : gotoNum(0);

const gotoNum = number => {
    current = number;
    prev = current - 1;
    next = current + 1;
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("pagination:active");
        slides[i].classList.remove("before");
        slides[i].classList.remove("after");
    }
    if (next == (slides.length)) {
        next = 0;
    }
    if (prev == -1) {
        prev = slides.length - 1;
    }
    slides[current].classList.add("pagination:active");
    slides[prev].classList.add("before");
    slides[next].classList.add("after");
}

/* end Pagination */ 