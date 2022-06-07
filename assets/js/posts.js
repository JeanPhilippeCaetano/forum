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
    const popup = document.querySelector(".overlay")
    popup.classList.add("active")
}

const closePopup = () => {
    const popup = document.querySelector(".overlay")
    popup.classList.remove("active")
}

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