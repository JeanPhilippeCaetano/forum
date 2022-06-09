const paginationPosts = {
    maxPosts: 50,
    initialCount : 1,
    endCount: 4,
    page: 1,
    // initialCount : page * postsPerPage - postsPerPage,
    // endCount : initialCount + postsPerPage - 1
}

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

const pagination = () => {
    // const slider = document.querySelector(".display-pages");
    const slides = document.querySelectorAll(".slide");
    const button = document.querySelectorAll(".arrow");

    let current = 0;
    let prev = (slides.length-1);
    let next = 1;
    

    /* Change active page by clicking on Previous / Next btn */
    for (let i = 0; i < button.length; i++) {
        button[i].addEventListener("click", () => {
            i == 0 ? gotoPrev() : gotoNext();
            changeTextContent()
        })
    }


    for (let i = 0; i < slides.length; i++) {
        /* Change active page by clicking on exact page*/
        slides[i].addEventListener("click", () => {
            slides.forEach(elem => {
                elem.classList.remove("pagination:active")
            })
            current = i
            if (current == (slides.length - 1)) {
                prev = current - 1
                next = 0
            }
            if (current == 0) {
                prev = slides.length - 1;
                next = 1
            }
            slides[i].classList.add("pagination:active")
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
}

const changeInnerSlides = () => {
    
}

pagination()

/* end Pagination */ 