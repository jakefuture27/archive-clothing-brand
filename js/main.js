document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Canvas Unraveling/Untying Animation
    const preloader = document.querySelector('.preloader');
    const typingText = document.querySelector('.typing-text');
    const canvas = document.getElementById('preloader-canvas');
    const ctx = canvas.getContext('2d');
    
    const logoImg = new Image();
    logoImg.src = 'assets/images/logo.png';

    // Canvas sizing with Retina (High DPI) Support
    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = 300;
    const canvasHeight = 300;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    let canvasState = 'loading'; // 'loading', 'unraveling', 'done'
    let time = 0;
    let animationFrameId;

    // Slicing columns parameters
    const numSlices = 35;
    const slices = [];

    logoImg.onload = () => {
        const sliceWidth = logoImg.width / numSlices;
        const destSliceWidth = 180 / numSlices; // Logo drawn at 180x180
        const startX = (canvasWidth - 180) / 2;
        const startY = (canvasHeight - 180) / 2;

        for (let i = 0; i < numSlices; i++) {
            // Distance from the center (0 in center, 1 at edges)
            const distFromCenter = Math.abs(i - numSlices / 2) / (numSlices / 2);
            
            slices.push({
                sx: i * sliceWidth,
                sy: 0,
                sw: sliceWidth,
                sh: logoImg.height,
                x: startX + i * destSliceWidth,
                y: startY,
                initialX: startX + i * destSliceWidth,
                initialY: startY,
                w: destSliceWidth,
                h: 180,
                vy: 0,
                g: 0.12 + Math.random() * 0.08, // Subtle random gravity rate
                amplitude: 0,
                // Middle columns (the knot) fall first, outer columns follow
                delay: distFromCenter * 35, 
                active: false,
                phase: Math.random() * Math.PI
            });
        }
        tick();
    };

    function tick() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        time += 0.05;

        if (canvasState === 'loading') {
            // Pulse the logo smoothly while loading
            const scale = 1 + Math.sin(time * 2.5) * 0.025;
            const w = 180 * scale;
            const h = 180 * scale;
            const x = (canvasWidth - w) / 2;
            const y = (canvasHeight - h) / 2;
            ctx.drawImage(logoImg, x, y, w, h);
        } else if (canvasState === 'unraveling') {
            let allFallen = true;

            for (let i = 0; i < numSlices; i++) {
                const s = slices[i];

                if (s.delay > 0) {
                    s.delay--;
                    // Draw normally before it starts untying
                    ctx.drawImage(logoImg, s.sx, s.sy, s.sw, s.sh, s.x, s.y, s.w, s.h);
                    allFallen = false;
                } else {
                    s.active = true;
                    // Increase wavy distortion over time
                    s.amplitude = Math.min(s.amplitude + 0.3, 14);
                    // Gravity physics
                    s.vy += s.g;
                    s.y += s.vy;
                    // Natural horizontal sway
                    s.x += Math.sin(time * 3 + s.phase) * 0.4;

                    if (s.y < canvasHeight + 100) {
                        allFallen = false;

                        // Draw slice in segments to bend like strings
                        const segments = 12;
                        const segH = s.h / segments;
                        const srcSegH = s.sh / segments;
                        for (let j = 0; j < segments; j++) {
                            // Sinusoidal wave sway along the length of each thread
                            const waveOffset = Math.sin(j * 0.5 + time * 8 + s.phase) * s.amplitude;
                            ctx.drawImage(
                                logoImg,
                                s.sx, s.sy + j * srcSegH, s.sw, srcSegH,
                                s.x + waveOffset, s.y + j * segH, s.w, segH
                            );
                        }
                    }
                }
            }

            if (allFallen) {
                canvasState = 'done';
            }
        }

        if (canvasState !== 'done') {
            animationFrameId = requestAnimationFrame(tick);
        }
    }

    // Preloader connection status typing sequence
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
                // Trigger preloader fade out and canvas unravel physics
                preloader.classList.add('loaded');
                canvasState = 'unraveling';
                
                // Reveal Hero contents
                setTimeout(() => {
                    document.querySelector('.hero').classList.add('active');
                    document.querySelector('.hero-content').classList.add('appear');
                }, 600);

                // Disable preloader rendering after completion to save CPU
                setTimeout(() => {
                    cancelAnimationFrame(animationFrameId);
                    preloader.style.display = 'none';
                }, 2000);
            }, 600);
        }
    }, 800);

    // 2. Countdown Timer logic
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

    // 3. Parallax Scroll Effect on Hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
        }
    });

    // 4. Cart Drawer (Empty State Demo)
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

    // 5. Intersection Observer for scroll animations
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
