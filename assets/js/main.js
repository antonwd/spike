window.onload = function() {
    const placeholderLogin = document.querySelector("#loginScreen .placeholder")
    const usernameField = document.querySelector("#loginscreen input")
    usernameField.addEventListener('input', () => {
        if(usernameField && usernameField.value) {
            placeholderLogin.classList.add("moved")
        } else {
            placeholderLogin.classList.remove("moved")
        }
    })

    const mobileBarButton = document.getElementById("mobileBarButton")
    const participantsList = document.getElementById("paricipantsList")
    mobileBarButton.addEventListener('click', () => {
        paricipantsList.style.right = "0px";
    })
    const mobileCloseParticipants = document.getElementById("mobileCloseParticipants")
    mobileCloseParticipants.addEventListener('click', () => {
        paricipantsList.style.right = "-" + paricipantsList.offsetWidth + "px"
    })
}