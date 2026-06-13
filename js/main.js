document.addEventListener('DOMContentLoaded', () => {
    // 1. Text Scramble (Matrix Hover) Animation Class
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 20);
                const end = start + Math.floor(Math.random() * 20);
                this.queue.push({ from, to, start, end, char: '' });
            }
            cancelAnimationFrame(this.frameId);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameId = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Scramble effect is kept for status changes but removed on hovers to keep layout simple.

    // 2. Preloader Canvas Unraveling/Untying Animation
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
                g: 0.12 + Math.random() * 0.08,
                amplitude: 0,
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
                    ctx.drawImage(logoImg, s.sx, s.sy, s.sw, s.sh, s.x, s.y, s.w, s.h);
                    allFallen = false;
                } else {
                    s.active = true;
                    s.amplitude = Math.min(s.amplitude + 0.3, 14);
                    s.vy += s.g;
                    s.y += s.vy;
                    s.x += Math.sin(time * 3 + s.phase) * 0.4;

                    if (s.y < canvasHeight + 100) {
                        allFallen = false;

                        const segments = 12;
                        const segH = s.h / segments;
                        const srcSegH = s.sh / segments;
                        for (let j = 0; j < segments; j++) {
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
                preloader.classList.add('loaded');
                canvasState = 'unraveling';
                
                setTimeout(() => {
                    document.querySelector('.hero').classList.add('active');
                    document.querySelector('.hero-content').classList.add('appear');
                }, 600);

                setTimeout(() => {
                    cancelAnimationFrame(animationFrameId);
                    preloader.style.display = 'none';
                    document.body.classList.add('preloader-done');
                }, 2000);
            }, 600);
        }
    }, 800);

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

    // 5. Cart Drawer (Empty State Demo)
    const cartDrawer = document.getElementById('cart-drawer');
    const cartTrigger = document.querySelector('.cart-trigger');
    if (cartDrawer && cartTrigger) {
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
        if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
        if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    }

    // 6. Intersection Observer for scroll animations
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

    // 7. Coming Soon Form Submission logic
    const comingSoonForm = document.querySelector('.coming-soon-form');
    const successMsg = document.querySelector('.form-success-msg');
    const successText = successMsg ? successMsg.querySelector('.success-text') : null;

    if (comingSoonForm && successMsg) {
        comingSoonForm.addEventListener('submit', (e) => {
            e.preventDefault();
            comingSoonForm.classList.add('hide');
            
            setTimeout(() => {
                comingSoonForm.style.display = 'none';
                successMsg.classList.add('show');
                
                const fx = new TextScramble(successText);
                fx.setText('[ ACCESS GRANTED ]');
            }, 400);
        });
    }

    // 8. Floating Discount Pill Logic
    const discountPill = document.getElementById('discount-pill');
    if (discountPill) {
        const discountClose = discountPill.querySelector('.discount-close');
        const discountForm = discountPill.querySelector('.discount-form');
        const discountInput = discountForm ? discountForm.querySelector('input') : null;
        const discountTriggerText = discountPill.querySelector('.discount-trigger-text');

        discountPill.addEventListener('click', (e) => {
            if (e.target.closest('.discount-close') || e.target.closest('.discount-form')) {
                return;
            }
            if (!discountPill.classList.contains('expanded')) {
                discountPill.classList.add('expanded');
                if (discountInput) {
                    discountInput.focus();
                }
            }
        });

        if (discountClose) {
            discountClose.addEventListener('click', (e) => {
                e.stopPropagation();
                discountPill.style.opacity = '0';
                discountPill.style.transform = 'translateY(20px)';
                discountPill.style.pointerEvents = 'none';
                setTimeout(() => {
                    discountPill.style.display = 'none';
                }, 400);
            });
        }

        if (discountForm) {
            discountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const submitBtn = discountForm.querySelector('button');
                if (discountInput) discountInput.disabled = true;
                if (submitBtn) submitBtn.disabled = true;
                
                discountForm.style.opacity = '0';
                if (discountTriggerText) discountTriggerText.style.opacity = '0';
                
                setTimeout(() => {
                    discountForm.style.display = 'none';
                    if (discountTriggerText) discountTriggerText.style.display = 'none';
                    
                    const successSpan = document.createElement('span');
                    successSpan.className = 'discount-success';
                    successSpan.innerText = '[ SECURED: TIED5 ]';
                    discountPill.appendChild(successSpan);
                    
                    const fx = new TextScramble(successSpan);
                    fx.setText('[ SECURED: TIED5 ]');
                }, 300);
            });
        }
    }

});
