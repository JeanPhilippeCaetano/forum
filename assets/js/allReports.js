const addReportDiv = (id, title, username, image, content, nbComments) => {
    const section = document.createElement("SECTION")
    section.setAttribute("id", "report" + id)
    const innerReport = document.createElement("div")
    innerReport.className = "inner-report"
    const infoUser = document.createElement("div")
    infoUser.className = "info-user"

    const imgCtn = document.createElement("div")
    imgCtn.className = "img-ctn"
    const img = document.createElement("img")
    img.setAttribute("src", image)

    const containerUR = document.createElement('div')
    containerUR.className = 'containerUR'
    const usernameDiv = document.createElement("div")
    usernameDiv.className = "username"
    usernameDiv.innerText = username
    const rankDiv = document.createElement("div")
    rankDiv.className = "rank"
    rankDiv.innerText = 'Admin'

    containerUR.appendChild(usernameDiv)
    containerUR.appendChild(rankDiv)

    const titleDiv = document.createElement("div")
    titleDiv.className = "title"
    titleDiv.innerText = title

    const contentDiv = document.createElement("div")
    contentDiv.className = "text-ctn"
    contentDiv.innerHTML = content

    const icons = document.createElement("div")
    icons.className = "icons-post"
    const commentsIcon = document.createElement("i")
    commentsIcon.className = "comment-reports fa fa-comments"

    imgCtn.appendChild(img)

    const commentsDiv = document.createElement("div")
    commentsDiv.innerHTML = nbComments
    icons.appendChild(commentsDiv)
    icons.appendChild(commentsIcon)

    infoUser.appendChild(imgCtn)
    infoUser.appendChild(containerUR)
    infoUser.appendChild(titleDiv)

    innerReport.appendChild(infoUser)
    innerReport.appendChild(contentDiv)
    innerReport.appendChild(icons)

    section.appendChild(innerReport)
    section.addEventListener('click', function() {
        location.href = '/report?id=' + id
    }, false);

    document.querySelector(".all-reports").appendChild(section)

}

addReportDiv(1, 'Ban de ce mec', 'Gleadn', '../assets/images/defaultProfil.jpg', 'ban car il est pas drôle', 5)