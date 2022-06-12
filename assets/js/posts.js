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


const postsData = {
    maxPosts: 235,
    postsPerPage: 10,
    page : Math.ceil(235 / 10),
    count: 3,
    firstSlide: 1,
    secondSlide: 2,
    thirdSlide: 3,
    fourthSlide: 4,
    fifthSlide: 5
}

const initMaxPages = () => {
    let tab = []
    for (let i = 1; i < Math.ceil(postsData.maxPosts / postsData.postsPerPage); i++) {
        tab.push(i)
    }
}


const removeClasses = () => {
    const slides = document.querySelectorAll(".slide");
    
    slides.forEach(elem => {
        elem.classList.remove("prev")
        elem.classList.remove("pagination:active")
        elem.classList.remove("next")
    })
}

const addClasses = (prev, current, next) => {
    const slides = document.querySelectorAll(".slide");

    slides[prev].classList.add("prev")
    slides[current].classList.add("pagination:active")
    slides[next].classList.add("next")
}

const initPagination = () => {
    const slides = document.querySelectorAll(".slide");
    slides[0].innerHTML = 1
    slides[1].innerHTML = 2
    slides[2].innerHTML = 3
    slides[3].innerHTML = 4
    slides[4].innerHTML = Math.ceil(postsData.maxPosts / postsData.postsPerPage)

}

initPagination()

const goToNext = () => {
    const slides = document.querySelectorAll(".slide");
    if (slides[0].classList.contains("pagination:active")) {
        removeClasses()
        addClasses(0, 1, 2)
    } else if (slides[1].classList.contains("pagination:active")) {
        removeClasses()
        addClasses(1, 2, 3)
    } else if ((parseInt(slides[2].innerHTML) == (postsData.page - 2)) && slides[2].classList.contains("pagination:active")){
        removeClasses()
        addClasses(2, 3, 4)

    } else if (parseInt(slides[3].innerHTML) == (postsData.page - 1)) {
        removeClasses()
        addClasses(3, 4, 4)
    } else {
        slides[1].innerHTML = slides[2].innerHTML
        slides[2].innerHTML = slides[3].innerHTML
        slides[3].innerHTML = parseInt(slides[3].innerHTML) + 1
    }
}

const goToPrev = () => {
    const slides = document.querySelectorAll(".slide");

    if (slides[4].classList.contains("pagination:active")) {
        removeClasses()
        addClasses(2, 3, 4)
    } else if (slides[3].classList.contains("pagination:active")) {
        removeClasses()
        addClasses(1, 2, 3)
    } else if ((parseInt(slides[2].innerHTML) == 3) && slides[2].classList.contains("pagination:active")){
        removeClasses()
        addClasses(0, 1, 2)

    } else if (parseInt(slides[1].innerHTML) == 2) {
        removeClasses()
        addClasses(0, 0, 1)
    } else {
        slides[3].innerHTML = parseInt(slides[2].innerHTML)
        slides[2].innerHTML = parseInt(slides[1].innerHTML)
        slides[1].innerHTML = parseInt(slides[2].innerHTML) - 1
    }
}

const goToNum = (value) => {
    if (parseInt(value.innerHTML) == postsData.page) {
        changerInnerText(1, postsData.page - 3, postsData.page - 2, postsData.page - 1, postsData.page)
        removeClasses()
        addClasses(3, 4, 4)
    } else if (parseInt(value.innerHTML) == 1) {
        changerInnerText(1, 2, 3, 4, postsData.page)
        removeClasses()
        addClasses(0, 0, 1)
    } else if ((value.classList.contains("mid-left") && (value.innerHTML != 2)) || (value.classList.contains("mid-right") && (value.innerHTML != postsData.page - 1))) {
        changerInnerText(1, parseInt(value.innerHTML) - 1, parseInt(value.innerHTML), parseInt(value.innerHTML) + 1, postsData.page)
        removeClasses()
        addClasses(1, 2, 3)
    } else if ((value.classList.contains("mid"))) {
        removeClasses()
        addClasses(1, 2, 3)
    }
}

const changerInnerText = (first, second, third, fourth, fifth) => {
    const slides = document.querySelectorAll(".slide");

    slides[0].innerHTML = first
    slides[1].innerHTML = second
    slides[2].innerHTML = third
    slides[3].innerHTML = fourth
    slides[4].innerHTML = fifth
}

/* end Pagination */ 