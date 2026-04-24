document.addEventListener("DOMContentLoaded", () => {
    // --- Sticky Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- GSAP Animations (Apple-style) ---
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Pinned Scroll Animation Sequence
    const images = document.querySelectorAll('.hero-img');
    const texts = document.querySelectorAll('.hero-text-block');

    if (images.length > 0) {
        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-pinned",
                start: "top top",
                end: "+=5000", // Increased for 6 images
                pin: true,
                scrub: 1,
                anticipatePin: 1
            }
        });

        // Set initial states
        gsap.set(texts[0], { opacity: 1, y: 0 });
        
        // Loop through images to create the scrub sequence dynamically
        for(let i = 0; i < images.length - 1; i++) {
            heroTl.to(images[i+1], { opacity: 1, duration: 1 }, i)
                  .to(texts[i], { opacity: 0, y: -50, duration: 0.5 }, i)
                  .fromTo(texts[i+1], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, i + 0.5);
        }

        // Slight pause at the end before unpinning
        heroTl.to({}, { duration: 0.5 });
    }

    // 2. Generic Reveal Animations for Sections
    const revealElements = document.querySelectorAll('.gs_reveal, .gs_reveal_up, .gs_reveal_left, .gs_reveal_right');
    
    revealElements.forEach(elem => {
        let x = 0, y = 0;
        if(elem.classList.contains('gs_reveal_up')) { y = 50; }
        else if(elem.classList.contains('gs_reveal_left')) { x = -50; }
        else if(elem.classList.contains('gs_reveal_right')) { x = 50; }
        else { y = 30; } // Default gs_reveal is slight fade up

        // Setup initial state
        gsap.set(elem, { autoAlpha: 0, x: x, y: y });

        gsap.to(elem, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%", // Triggers when top of element is 85% down the viewport
                toggleActions: "play none none reverse"
            }
        });
    });

    // 3. Trust Bar Counters Animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2.5,
                    ease: "power2.out",
                    snap: { innerHTML: 1 },
                    onUpdate: function() {
                        counter.innerHTML = Math.round(this.targets()[0].innerHTML);
                    }
                });
            },
            once: true // only animate numbers once
        });
    });

    // --- Form Submission Simulation ---
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.style.backgroundColor = 'var(--black-light)';
            btn.style.color = 'var(--white)';
            
            setTimeout(() => {
                alert('Thank you for reaching out to F2C Contracting. Our experts will contact you shortly.');
                contactForm.reset();
                btn.textContent = originalText;
                btn.style.backgroundColor = 'var(--golden)';
                btn.style.color = 'var(--black)';
            }, 1500);
        });
    }
});
