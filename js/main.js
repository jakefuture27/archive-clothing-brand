document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader lifecycle
    const preloader = document.querySelector('.preloader');
    const typingText = document.querySelector('.typing-text');
    
    // Simulate connection typing status
    const statusMessages = [
        "CONNECTING TO ARCHIVE...",
        "AUTHENTICATING...",
        "ACCESS GRANTED."
    ];
    
    let msgIndex = 0;
    const interval = setInterval(() => {
        msgIndex++;
        if (msgIndex < statusMessages.length) {
            typingText.innerHTML = statusMessages[msgIndex];
        } else {
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('fade-out');
                // Reveal Hero animations
                setTimeout(() => {
                    document.querySelector('.hero').classList.add('active');
                    document.querySelector('.hero-content').classList.add('appear');
                }, 400);
            }, 600);
        }
    }, 800);

    // 2. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, button, .product-card, .hover-effect, .drawer-close');

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

    // 3. Countdown Timer logic
    const timerDisplay = document.getElementById('timer');
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

        const h = hours < 10 ? "0" + hours : hours;
        const m = minutes < 10 ? "0" + minutes : minutes;
        const s = seconds < 10 ? "0" + seconds : seconds;

        timerDisplay.innerHTML = `${h}:${m}:${s}`;
    }, 1000);

    // 4. Parallax Scroll Effect on Hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
        }
    });

    // 5. Drawer & Quick View Modal Logic
    const quickViewDrawer = document.getElementById('quick-view-drawer');
    const closeDrawerBtn = quickViewDrawer.querySelector('.drawer-close');
    const drawerOverlay = quickViewDrawer.querySelector('.drawer-overlay');
    
    const modalImg = document.getElementById('modal-product-img');
    const modalTitle = document.getElementById('modal-product-title');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDesc = document.getElementById('modal-product-desc');

    const openDrawer = (card) => {
        const title = card.getAttribute('data-title');
        const price = card.getAttribute('data-price');
        const image = card.getAttribute('data-image');
        const desc = card.getAttribute('data-desc');

        modalTitle.textContent = title;
        modalPrice.textContent = price;
        modalImg.src = image;
        modalDesc.textContent = desc;

        quickViewDrawer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeDrawer = () => {
        quickViewDrawer.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    };

    document.querySelectorAll('.product-card:not(.sold-out-card)').forEach(card => {
        card.addEventListener('click', () => openDrawer(card));
    });

    closeDrawerBtn.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    // Size selector functionality inside modal
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // 6. Cart Drawer (Empty State Demo)
    const cartDrawer = document.getElementById('cart-drawer');
    const cartTrigger = document.querySelector('.cart-trigger');
    const closeCartBtn = cartDrawer.querySelector('.drawer-close');
    const cartOverlay = cartDrawer.querySelector('.drawer-overlay');

    const openCart = (e) => {
        e.preventDefault();
        cartDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeCart = () => {
        cartDrawer.classList.remove('active');
        document.body.style.overflow = '';
    };

    cartTrigger.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // 7. Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
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
