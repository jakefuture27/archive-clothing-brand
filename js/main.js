document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, button, .product-card, .hover-effect');

    // Only apply custom cursor on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    } else {
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // Hero active state (slight zoom effect)
    setTimeout(() => {
        document.querySelector('.hero').classList.add('active');
        document.querySelector('.hero-content').classList.add('appear');
    }, 100);

    // Countdown Timer logic
    const timerDisplay = document.getElementById('timer');
    // Set drop date to 24 hours from now
    const dropDate = new Date().getTime() + (24 * 60 * 60 * 1000);

    const updateTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = dropDate - now;

        if (distance < 0) {
            clearInterval(updateTimer);
            timerDisplay.innerHTML = "DROP IS LIVE";
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Format to always have 2 digits
        const h = hours < 10 ? "0" + hours : hours;
        const m = minutes < 10 ? "0" + minutes : minutes;
        const s = seconds < 10 ? "0" + seconds : seconds;

        timerDisplay.innerHTML = `${h}:${m}:${s}`;
    }, 1000);

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});
