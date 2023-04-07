function reloadPage() {
    setTimeout(() => {
        location.reload()
    }, 500);
}

$(document).ready(function() {
    let profileNav = document.getElementById('profile-nav') 
    let profileButton = document.getElementById('profile-button')
    let authButton = document.getElementById('auth-button')

    if (user.loggedIn) {
        authButton.innerHTML = 'Logout'
        authButton.onclick = function() {
            $.ajax({
                async: false,
                type: 'POST',
                url: 'account/logout',
                success: (res) => {
                    if (res.success) {
                        reloadPage()
                    }
                }
            })
        }
    } else {
        let currentAuthPopup
        let authPopupOpen = false
        authButton.onclick = function() {
            let authPopupHTML 
            $.ajax({
                async: false,
                type: 'GET',
                url: '../html/auth.html',
                success: function(authPopup) {
                    authPopupHTML = authPopup
                }
            })
    
            if (!authPopupOpen) {
                authPopupOpen = true
                currentAuthPopup = $(authPopupHTML)
                currentAuthPopup.find('.auth-login-container').css('visibility', 'visible')
                currentAuthPopup.find('.login-option-container').click(() => {
                    currentAuthPopup.find('.auth-login-container').css('visibility', 'visible')
                    currentAuthPopup.find('.auth-signup-container').css('visibility', 'hidden')
                })
                currentAuthPopup.find('.signup-option-container').click(() => {
                    currentAuthPopup.find('.auth-signup-container').css('visibility', 'visible')
                    currentAuthPopup.find('.auth-login-container').css('visibility', 'hidden')
                })
                function getLoginCredentials() {
                    return {
                        email: currentAuthPopup.find('.auth-email-signin').val(),
                        password: currentAuthPopup.find('.auth-password-signin').val()
                    }
                }
                function getSignupCredentials() {
                    return {
                        email: currentAuthPopup.find('.auth-email-signup').val(),
                        password: currentAuthPopup.find('.auth-password-signup').val()
                    }
                }
                currentAuthPopup.find('.auth-login-account').click(() => {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: 'account/login',
                        data: getLoginCredentials(),
                        success: (res) => {
                            if (res.success) {
                                reloadPage()
                            }
                        },
                        error: (res) => {
                            const errorMessage = res.responseJSON.message
                            currentAuthPopup.find('.auth-login-error-message').text(errorMessage)
                        }
                    })
                })
                currentAuthPopup.find('.auth-create-account').click(() => {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: 'account/create',
                        data: getSignupCredentials(),
                        success: (res) => {
                            if (res.success) {
                                reloadPage()
                            }
                        },
                        error: (res) => {
                            const errorMessage = res.responseJSON.message
                            currentAuthPopup.find('.auth-signup-error-message').text(errorMessage)
                        }
                    })
                })
                $('body').append(currentAuthPopup)
            } else {
                authPopupOpen = false
                currentAuthPopup.remove()
            }
        }
    }  

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
