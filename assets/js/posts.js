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
    page : 0
}

const removeClasses = () => {
    const slides = document.querySelectorAll(".slide");
    slides.forEach(elem => {
        elem.classList.remove("pagination:active")
    })
}

const addClasses = (current) => {
    removeClasses()
    const slides = document.querySelectorAll(".slide");
    slides[current].classList.add("pagination:active")
}

const initPagination = () => {
    const slides = document.querySelectorAll(".slide");
    const slideType = [slides[0], slides[1], slides[2], slides[3], slides[4]]
    const parent = document.querySelector(".display-pages")
    if (postsData.page > 5) {
        slides[0].innerHTML = 1
        slides[1].innerHTML = 2
        slides[2].innerHTML = 3
        slides[3].innerHTML = 4
        slides[4].innerHTML = postsData.page
    } else {
        for (let i = 0; i < slides.length; i++) {
            slides[i].remove()
        }
        for (let i = 0; i < postsData.page; i++) {
            slideType[i].innerHTML = i + 1
            parent.append(slideType[i])
        }
        addClasses(0)
    }

}

initPagination()

const goToNext = () => {
    const slides = document.querySelectorAll(".slide");

    if (postsData.page >= 5) {
        if (slides[0].classList.contains("pagination:active")) {
            addClasses(1)
        } else if (slides[1].classList.contains("pagination:active")) {
            addClasses(2)
        } else if ((parseInt(slides[2].innerHTML) == (postsData.page - 2)) && slides[2].classList.contains("pagination:active")){
            addClasses(3)
    
        } else if (parseInt(slides[3].innerHTML) == (postsData.page - 1)) {
            addClasses(4)
        } else {
            slides[1].innerHTML = slides[2].innerHTML
            slides[2].innerHTML = slides[3].innerHTML
            slides[3].innerHTML = parseInt(slides[3].innerHTML) + 1
        }
    } else {
        if (slides[postsData.page - 1].classList.contains("pagination:active") != true) {
            if (slides[0].classList.contains("pagination:active")) {
                addClasses(1)
            } else if (slides[1].classList.contains("pagination:active")){
                addClasses(2)
            } else if (slides[2].classList.contains("pagination:active")) {
                addClasses(3)
            }
        }
    }
}

const goToPrev = () => {
    const slides = document.querySelectorAll(".slide");

    if (postsData.page >= 5) {
        if (slides[4].classList.contains("pagination:active")) {
            addClasses(3)
        } else if (slides[3].classList.contains("pagination:active")) {
            addClasses(2)
        } else if ((parseInt(slides[2].innerHTML) == 3) && slides[2].classList.contains("pagination:active")){
            addClasses(1)
    
        } else if (parseInt(slides[1].innerHTML) == 2) {
            addClasses(0)
        } else {
            slides[3].innerHTML = parseInt(slides[2].innerHTML)
            slides[2].innerHTML = parseInt(slides[1].innerHTML)
            slides[1].innerHTML = parseInt(slides[2].innerHTML) - 1
        }
    } else {
        if (slides[0].classList.contains("pagination:active") != true) {
            if (slides[postsData.page-1].classList.contains("pagination:active")) {
                addClasses(postsData.page-2)
            } else if (slides[postsData.page-2].classList.contains("pagination:active")){
                addClasses(postsData.page-3)
            } else if (slides[postsData.page-3].classList.contains("pagination:active")) {
                addClasses(postsData.page-4)
            }
        }
    }
}

const goToNum = (value) => {
    const slides = document.querySelectorAll(".slide");
    const index = value.innerHTML
    if (postsData.page >= 5) {
        if (parseInt(value.innerHTML) == postsData.page) {
            changerInnerText(1, postsData.page - 3, postsData.page - 2, postsData.page - 1, postsData.page)
            addClasses(4)
        } else if (parseInt(value.innerHTML) == 1) {
            changerInnerText(1, 2, 3, 4, postsData.page)
            addClasses(0)
        } else if ((value.classList.contains("mid-left") && (value.innerHTML != 2)) || (value.classList.contains("mid-right") && (value.innerHTML != postsData.page - 1))) {
            changerInnerText(1, parseInt(value.innerHTML) - 1, parseInt(value.innerHTML), parseInt(value.innerHTML) + 1, postsData.page)
            addClasses(2)
        } else if ((value.classList.contains("mid"))) {
            addClasses(2)
        } else if (value.classList.contains("mid-left") && (parseInt(slides[0].innerHTML) == 1)){
            addClasses(1)
        } else if (value.classList.contains("mid-right") && (parseInt(slides[4].innerHTML) == postsData.page)) {
            addClasses(3)
        }
    } else {
        addClasses(index-1)
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