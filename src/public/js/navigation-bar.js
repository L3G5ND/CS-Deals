$(document).ready(function() {
    $('#navigation-bar').load('../html/navigation-bar.html', () => {
        let profileNav = document.getElementById('profile-nav') 
        let profileButton = document.getElementById('profile-button')

        let animationId = null
        function setVisible(visible) {
            clearInterval(animationId)
            let opacity = Number(profileNav.style.opacity)
            if (visible) {
                profileNav.style.display = "inline"
            }
            animationId = setInterval(() => {
                if (visible) {
                    if (opacity >= 1) {
                        clearInterval(animationId)
                    }
                } else {
                    if (opacity <= 0) {
                        profileNav.style.display = "none"
                        clearInterval(animationId)
                    }
                }
                if (visible) {
                    opacity += .05
                } else {
                    opacity -= .05
                }
                profileNav.style.opacity = opacity
            }, 10)
        }

        let isVisible = false
        profileButton.onclick = function() {
            if (isVisible) {
                isVisible = false
                setVisible(false)
            } else {
                isVisible = true
                setVisible(true)
            }
        }

        let isHoveringProfileNav = false
        profileNav.onmouseover = function() {
            isHoveringProfileNav = true
        }
        profileNav.onmouseleave = function() {
            isHoveringProfileNav = false
        }

        let isHoveringProfile = false
        profileButton.onmouseover = function() {
            isHoveringProfile = true
        }
        profileButton.onmouseleave = function() {
            isHoveringProfile = false
        }

        window.addEventListener('click', (event) => {
            if (isVisible) {
                if (!isHoveringProfileNav && !isHoveringProfile) {
                    isVisible = false
                    setVisible(false)
                }
            } 
        })
    })
})
