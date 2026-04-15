// PUT YOUR REAL WHATSAPP NUMBER HERE
const WHATSAPP_NUMBER = "1234567890"; 

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Logic
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileNav = document.getElementById('mobile-nav');
    
    menuIcon.addEventListener('click', () => mobileNav.classList.add('active'));
    closeIcon.addEventListener('click', () => mobileNav.classList.remove('active'));
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileNav.classList.remove('active'));
    });

    // 2. Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) { header.classList.add('scrolled'); } 
        else { header.classList.remove('scrolled'); }
    });

    // 3. Scroll Fade-in Animations
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in-section, .slide-in-left, .slide-in-right').forEach(sec => observer.observe(sec));

    // 4. Order Form WhatsApp Submission
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault(); 
        const name = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;
        const product = document.getElementById('product').value;
        const message = document.getElementById('message').value;

        let waMessage = `*New Order from Petal & Resin*%0A%0A*Name:* ${name}%0A*Contact:* ${contact}%0A`;
        if(product) waMessage += `*Product:* ${product}%0A`;
        if(message) waMessage += `*Message:* ${message}%0A`;

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`, '_blank');
    });

    // 5. Magnify/Zoom Mouse Tracking Logic
    const zoomContainer = document.getElementById('zoom-container');
    const zoomImg = document.getElementById('zoom-img');

    zoomContainer.addEventListener('click', function() {
        this.classList.toggle('is-zoomed');
        if(!this.classList.contains('is-zoomed')) {
            zoomImg.style.transformOrigin = 'center center';
        }
    });

    zoomContainer.addEventListener('mousemove', function(e) {
        if (!this.classList.contains('is-zoomed')) return;
        const rect = this.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        zoomImg.style.transformOrigin = `${x}% ${y}%`;
    });
    
    zoomContainer.addEventListener('touchmove', function(e) {
        if (!this.classList.contains('is-zoomed')) return;
        e.preventDefault(); 
        const rect = this.getBoundingClientRect();
        const touch = e.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        zoomImg.style.transformOrigin = `${x}% ${y}%`;
    }, {passive: false});
});

// --- LIGHTBOX GRID (Level 1) ---
function openLightboxGrid(categoryId, categoryName) {
    const lightbox = document.getElementById('lightbox');
    const lightboxGrid = document.getElementById('lightbox-grid');
    
    document.getElementById('lightbox-header-title').innerText = categoryName;
    lightboxGrid.innerHTML = ''; 

    // Find the hidden data for the clicked category
    const items = document.querySelectorAll(`#${categoryId} .gallery-data`);
    
    items.forEach(item => {
        const imgSrc = item.getAttribute('data-src');
        const titleText = item.getAttribute('data-title');

        const itemDiv = document.createElement('div');
        itemDiv.className = 'lightbox-item';

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'img-click-wrapper';
        imgWrapper.onclick = () => openZoom(imgSrc, titleText);

        const newImg = document.createElement('img');
        newImg.src = imgSrc;
        newImg.alt = titleText;

        const hint = document.createElement('div');
        hint.className = 'hover-magnify';
        hint.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus"></i>';

        imgWrapper.appendChild(newImg);
        imgWrapper.appendChild(hint);

        const newTitle = document.createElement('h4');
        newTitle.className = 'lightbox-item-title';
        newTitle.innerText = titleText;

        const inquireBtn = document.createElement('button');
        inquireBtn.className = 'lightbox-inquire-btn';
        inquireBtn.innerHTML = 'INQUIRE';
        inquireBtn.onclick = () => {
            closeLightbox();           
            selectProduct(titleText);  
        };

        itemDiv.appendChild(imgWrapper);
        itemDiv.appendChild(newTitle);
        itemDiv.appendChild(inquireBtn); 
        lightboxGrid.appendChild(itemDiv);
    });

    lightbox.style.display = "block";
    document.body.style.overflow = "hidden"; // Stops the background from scrolling
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = "none";
    document.body.style.overflow = "auto";
}

// --- MAGNIFY ZOOM VIEWER (Level 2) ---
let currentZoomProduct = "";

function openZoom(imgSrc, titleText) {
    currentZoomProduct = titleText;
    const zoomImg = document.getElementById('zoom-img');
    
    zoomImg.src = imgSrc;
    document.getElementById('zoom-title').innerText = titleText;
    document.getElementById('zoom-viewer').style.display = "flex";
    
    document.getElementById('zoom-container').classList.remove('is-zoomed');
    zoomImg.style.transformOrigin = 'center center';
}

function closeZoom() {
    document.getElementById('zoom-viewer').style.display = "none";
}

function buyFromZoom() {
    closeZoom();       
    closeLightbox();   
    selectProduct(currentZoomProduct); 
}

// --- FORM PRE-FILL ---
function selectProduct(productName) {
    const productInput = document.getElementById('product');
    productInput.value = productName;
    productInput.style.backgroundColor = "#fae8ea"; 
    setTimeout(() => { productInput.style.backgroundColor = "#fcfcfc"; }, 1000);
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

function directWhatsApp() {
    const defaultMessage = "Hello Petal & Resin, I would like to place an order.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMessage)}`, '_blank');
}
// --- REVIEW CAROUSEL LOGIC ---
let currentReviewIndex = 0;
let reviewAutoPlayTimer;

document.addEventListener('DOMContentLoaded', () => {
    const reviewContainer = document.getElementById('reviewCarouselContainer');
    
    if (reviewContainer) {
        startReviewAutoPlay();
        window.addEventListener('resize', updateReviewCarousel);

        // Pause on hover or touch
        reviewContainer.addEventListener('mouseenter', stopReviewAutoPlay);
        reviewContainer.addEventListener('touchstart', stopReviewAutoPlay);

        // Resume when mouse leaves or touch ends
        reviewContainer.addEventListener('mouseleave', startReviewAutoPlay);
        reviewContainer.addEventListener('touchend', startReviewAutoPlay);
    }
});

function startReviewAutoPlay() {
    stopReviewAutoPlay();
    // Slides every 4 seconds
    reviewAutoPlayTimer = setInterval(() => { moveReviewSlide(1); }, 4000); 
}

function stopReviewAutoPlay() {
    clearInterval(reviewAutoPlayTimer);
}

function moveReviewSlide(direction) {
    const cards = document.querySelectorAll('.review-card-wrapper');
    if (cards.length === 0) return;

    let visibleCards = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const maxIndex = cards.length - visibleCards;

    currentReviewIndex += direction;

    // Loop back around
    if (currentReviewIndex > maxIndex) {
        currentReviewIndex = 0; 
    } else if (currentReviewIndex < 0) {
        currentReviewIndex = maxIndex; 
    }
    
    updateReviewCarousel();
}

function updateReviewCarousel() {
    const track = document.getElementById('reviewCarouselTrack');
    const cards = document.querySelectorAll('.review-card-wrapper');
    if(cards.length === 0 || !track) return;
    
    const cardWidth = cards[0].offsetWidth;
    track.style.transform = `translateX(-${currentReviewIndex * cardWidth}px)`;
}
