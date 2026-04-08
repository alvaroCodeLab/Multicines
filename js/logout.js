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
        duration: 0.1
    });
});

// HERO ANIMACIÓN
gsap.from(".title", {
    opacity: 0,
    y: -100,
    duration: 1.2
});

gsap.from(".subtitle", {
    opacity: 0,
    y: 40,
    delay: 0.3
});

// PARALLAX HERO BG
gsap.to(".hero-bg", {
    y: 100,
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        scrub: true
    }
});

// SCROLL SECTIONS
gsap.utils.toArray(".fade-up").forEach(el => {
    gsap.from(el, {
        opacity: 0,
        y: 80,
        duration: 1,
        scrollTrigger: {
            trigger: el,
            start: "top 80%"
        }
    });
});

// BOTÓN ANIMACIÓN
gsap.from(".btn", {
    scale: 0.7,
    opacity: 0,
    duration: 0.8,
    delay: 0.5
});