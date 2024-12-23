const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
})




const initSlider = () => {
    const imageList = document.querySelector(".slider-wrapper .image-list");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = document.querySelector(".container .slider-scrollbar");
    const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");

    // Get the initial maxScrollLeft
    const getMaxScrollLeft = () => imageList.scrollWidth - imageList.clientWidth;

    let maxScrollLeft = getMaxScrollLeft();

    scrollbarThumb.addEventListener("mousedown", (e) => {
        const startX = e.clientX;
        const thumbPosition = scrollbarThumb.offsetLeft;

        // Prevent default to avoid unwanted page scroll
        e.preventDefault();

        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newThumbPosition = thumbPosition + deltaX;

            const maxThumbPosition = sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;

            // Bounded position
            const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));

            // Update the scrollbar thumb position
            const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;
            scrollbarThumb.style.left = `${boundedPosition}px`;

            // Update the image list scroll position
            imageList.scrollLeft = scrollPosition;
        }

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    });

    // Handle the visibility of the slide buttons based on scroll position
    const handleSlideButtons = () => {
        maxScrollLeft = getMaxScrollLeft();  // Recalculate maxScrollLeft

        // Hide "prev-slide" button if at the start
        slideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "block";
        
        // Hide "next-slide" button if at the end
        slideButtons[1].style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "block";
    }

    // Update scrollbar thumb position based on scroll position
    const updateScrollThumbPosition = () => {
        const scrollPosition = imageList.scrollLeft;
        const maxThumbPosition = sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth;

        const thumbPosition = (scrollPosition / maxScrollLeft) * maxThumbPosition;
        scrollbarThumb.style.left = `${thumbPosition}px`;
    }

    // Slide images according to the slide button clicks
    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    });

    // Listen for scroll events to show/hide buttons dynamically and update scrollbar thumb position
    imageList.addEventListener("scroll", () => {
        handleSlideButtons();
        updateScrollThumbPosition();
    });

    // Initial check to set button visibility and thumb position based on starting scroll position
    handleSlideButtons();
    updateScrollThumbPosition();
}

// Initialize the slider when the page loads
window.addEventListener("load", initSlider);





// Lightbox'ı açma fonksiyonu
function openLightbox(imageSrc) {
    // Lightbox'ın içindeki resmin kaynağını, tıklanan resmin kaynağıyla değiştir
    document.getElementById('lightbox-img').src = imageSrc;
    
    // Lightbox'ı görüntüle
    document.getElementById('lightbox').style.display = 'flex';
}

// Lightbox'ı kapatma fonksiyonu
function closeLightbox() {
    // Lightbox'ı gizle
    document.getElementById('lightbox').style.display = 'none';
}







// Video modal'ını açma fonksiyonu
function openVideoModal() {
    document.getElementById('video-modal').style.display = 'flex';
    document.getElementById('video-player').play(); // Video otomatik olarak oynatılır
}

// Video modal'ını kapatma fonksiyonu
function closeVideoModal() {
    document.getElementById('video-modal').style.display = 'none';
    document.getElementById('video-player').pause(); // Video durdurulur
}





//performans iyileştirme
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker başarılı bir şekilde kaydedildi:', registration);
            })
            .catch(error => {
                console.log('Service Worker kaydı sırasında hata oluştu:', error);
            });
    });
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/photographer.html',
                '/photographer.css',
                '/photographer.js',
                
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});
