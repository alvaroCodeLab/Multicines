gsap.registerPlugin(ScrollTrigger);

// LOADER
gsap.to("#loader", {
    opacity: 0,
    duration: 1,
    delay: 1,
    onComplete: () => {
        document.getElementById("loader").style.display = "none";
    }
});

// CURSOR
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", e => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08
    });
});

// HERO
gsap.from(".title", {
    opacity: 0,
    y: -80,
    duration: 1
});

gsap.from(".subtitle", {
    opacity: 0,
    y: 40,
    delay: 0.3
});

gsap.from(".btn", {
    opacity: 0,
    scale: 0.8,
    stagger: 0.2,
    delay: 0.6,
    duration: 0.8,
    clearProps: "all" // 🔥 IMPORTANTE
});

// 🎯 SCROLL TRIGGER
gsap.utils.toArray(".fade-up").forEach(el => {
    gsap.from(el, {
        opacity: 0,
        y: 80,
        duration: 1,
        scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
});

// 🎠 CARRUSEL INFINITO REAL
const carousel = document.getElementById("carousel");

// Clonar elementos UNA sola vez correctamente
const items = Array.from(carousel.children);
items.forEach(item => {
    const clone = item.cloneNode(true);
    carousel.appendChild(clone);
});

let speed = 0.5;
let scroll = 0;
let maxScroll = carousel.scrollWidth / 2;
let isPaused = false;

function animateCarousel() {
    if (!isPaused) {
        scroll += speed;

        if (scroll >= maxScroll) {
            scroll = 0;
        }

        carousel.scrollLeft = scroll;
    }

    requestAnimationFrame(animateCarousel);
}

animateCarousel();

// PAUSA
carousel.addEventListener("mouseenter", () => isPaused = true);
carousel.addEventListener("mouseleave", () => isPaused = false);

// HOVER CARDS
document.querySelectorAll(".movie").forEach(card => {
    card.addEventListener("mouseenter", () => {
        gsap.to(card, { scale: 1.08, duration: 0.3 });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(card, { scale: 1, duration: 0.3 });
    });
});