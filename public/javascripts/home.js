const tracksElement = document.querySelector('.tracks');
const tracks = tracksElement.querySelectorAll('.track');
const bars = tracksElement.querySelectorAll('.bar');
const names = tracksElement.querySelectorAll('.name');
const times = tracksElement.querySelectorAll('.time');
const maxTotal = tracksElement.dataset.max;
const maxWidth =  window.innerWidth - (window.innerWidth > 600 ? 200 : 60);
const ratio = Math.floor(maxWidth / maxTotal * 10) / 10;

window.onload = function() {
    tracks.forEach(track => {
        track.style.width = `${ratio * parseInt(track.dataset.length)}px`;

        track.addEventListener('mousemove', e => {
            const details = track.querySelector('.details');
            tracksElement.querySelectorAll('.details').forEach(el => {
                if(el.classList.contains('show')) {
                    el.classList.remove('show');
                }
            });
            details.classList.add("show");
            details.style.left = e.clientX - track.offsetLeft + 5 + 'px';
            details.style.top = e.clientY - track.offsetTop + 5 + 'px';
        });

        track.addEventListener('mouseout', e => {
            tracksElement.querySelectorAll('.details').forEach(el => {
                if(el.classList.contains('show')) {
                    el.classList.remove('show');
                }
            });
        });
    });
    
    
    bars.forEach(bar => {
        bar.style.width = `${ratio * parseInt(bar.dataset.length)}px`;
        if(bar.dataset.left) {
            bar.style.left = `${ratio * parseInt(bar.dataset.left)}px`;
        }

        if(bar.dataset.right) {
            bar.style.right = `${ratio * parseInt(bar.dataset.right)}px`;
        }
    });
    
    names.forEach(name => {
        name.style.left = `${ratio * parseInt(name.dataset.left)}px`
    });

    times.forEach((time, i) => {
        time.style.right = `${ratio * parseInt(time.dataset.right) + 5}px`;
        setTimeout(() => {
            let alpha = 0;
            let interval = setInterval(() => {
                time.style.opacity = alpha;
                alpha += 0.1;
                if(alpha > 1) {
                    clearInterval(interval);
                }
            }, 50);
        }, 3000 + (i * 300));
    });

   
};