const tracksElement = document.querySelector('.tracks');
const tracks = tracksElement.querySelectorAll('.track');
const bars = tracksElement.querySelectorAll('.bar');
const names = tracksElement.querySelectorAll('.name');
const maxTotal = tracksElement.dataset.max;
const maxWidth =  window.innerWidth - (window.innerWidth > 600 ? 200 : 60);
const ratio = Math.floor(maxWidth / maxTotal * 10) / 10;

window.onload = function() {
    tracks.forEach(track => {
        track.style.width = `${ratio * parseInt(track.dataset.length)}px`;
    });
    
    
    bars.forEach(bar => {
        bar.style.width = `${ratio * parseInt(bar.dataset.length)}px`;
        if(bar.dataset.left) {
            bar.style.left = `${ratio * parseInt(bar.dataset.left)}px`;
        }
    });
    
    names.forEach(name => {
        name.style.left = `${ratio * parseInt(name.dataset.left)}px`
    });
};