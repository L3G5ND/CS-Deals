$(document).ready(() => {
    const slider = document.getElementById('slider')
    const sliderValue = document.getElementById('slider-value')
    function magnitude(n1, n2) {
        return Math.abs(n1 - n2)
    }
    sliderValue.value = slider.value
    slider.oninput = () => {
        const sliderPercentage = magnitude(slider.min, slider.value) / magnitude(slider.min, slider.max) * 100
        slider.style.background = 'linear-gradient(90deg, rgb(0, 133, 0) '+sliderPercentage+'%, rgb(49, 49, 49) '+sliderPercentage+'%)'
        sliderValue.value = slider.value
    }
    sliderValue.oninput = () => {
        const sliderPercentage = magnitude(slider.min, sliderValue.value) / magnitude(slider.min, slider.max) * 100
        slider.style.background = 'linear-gradient(90deg, rgb(0, 133, 0) '+sliderPercentage+'%, rgb(49, 49, 49) '+sliderPercentage+'%)'
        slider.value = sliderValue.value
    }
})