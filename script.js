// ========== PRELOADER =========

const logo = document.querySelector(".preload-logo");

const pageDiv = document.querySelectorAll(".page-transition .div");

if (document.body.classList.contains("preloader-active")) {
    try {
        sessionStorage.setItem("preloader", "1");
    } catch {}

    const tl = gsap.timeline();

    tl.to(logo, {
        opacity: 1,

        duration: 0.2,
    })

        .add(() => {
            import("https://cdn.jsdelivr.net/npm/animejs@4/+esm").then(({ animate, svg, stagger }) => {
                animate(svg.createDrawable(".preload-logo .line"), {
                    draw: ["0 0", "0 1", "1 1"],

                    ease: "inOutQuad",

                    duration: 500,

                    delay: stagger(15),

                    loop: false,
                });
            });
        })

        .to({}, { duration: 1 })

        .to(logo, {
            opacity: 0,

            duration: 0.2,
        })

        .to(pageDiv, {
            yPercent: -100,

            duration: 0.4,

            ease: "power2.out",

            stagger: 0.06,

            onComplete: () => {
                document.body.classList.remove("preloader-active");
            },
        });
}

// DARK/LIGHT MODE

const themeToggle = document.getElementById("theme-toggle");

const themeIcon = themeToggle.querySelector(".theme-icon");

function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    themeIcon.classList.replace(isDark ? "fa-moon" : "fa-sun", isDark ? "fa-sun" : "fa-moon");
    themeToggle.setAttribute("aria-pressed", String(isDark));
}

try {
    applyTheme(localStorage.getItem("theme") === "dark");
} catch {}

themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");

    applyTheme(isDark);

    try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
});

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    import("https://cdn.jsdelivr.net/npm/animejs@4/+esm").then(({ animate, svg, stagger }) => {
        const heroLogoAnimation = animate(svg.createDrawable(".hero-logo .line"), {
            draw: ["0 0", "0 1", "1 1"],

            ease: "inOutQuad",

            duration: 2000,

            delay: stagger(40),

            loop: true,
        });

        new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                heroLogoAnimation.resume();
            } else {
                heroLogoAnimation.pause();
            }
        }).observe(document.querySelector(".hero-logo"));
    });
}

// ========== ACTIVE SECTION HIGHLIGHTING ==========

const sections = document.querySelectorAll("section[id]");

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;

        const sectionTop = section.offsetTop - 100;

        const sectionId = section.getAttribute("id");

        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add("active");
            } else {
                navLink.classList.remove("active");
            }
        }
    });
}

window.addEventListener("scroll", scrollActive);

// ========== SCROLL TO TOP BUTTON ==========

const scrollTopBtn = document.getElementById("scroll-top");

function showScrollTop() {
    if (window.scrollY >= 400) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
}

window.addEventListener("scroll", showScrollTop);

if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,

            behavior: "smooth",
        });
    });
}

// ========== SMOOTH SCROLL FOR ALL LINKS ==========

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            const headerEl = document.querySelector("header");

            const headerHeight = headerEl ? headerEl.offsetHeight : 0;

            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,

                behavior: "smooth",
            });
        }
    });
});

// ========== SCROLL REVEAL ANIMATION ==========

const revealElements = document.querySelectorAll(".project-card, .grid-wrapper");

revealElements.forEach((el) => el.classList.add("reveal-hidden"));

function revealOnScroll() {
    const windowHeight = window.innerHeight;

    revealElements.forEach((el) => {
        if (el.getBoundingClientRect().top < windowHeight - 150) {
            el.classList.replace("reveal-hidden", "revealed");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);

// ========== VIDEO PLAYBACK OPTIMIZATION ==========

const videos = document.querySelectorAll("video");

const videoObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.play().catch(() => {});
            } else {
                entry.target.pause();
            }
        });
    },
    {
        threshold: 0.5,
    },
);

videos.forEach((video) => {
    videoObserver.observe(video);
});

// ========== INITIALIZE EVERYTHING ON LOAD ==========

document.addEventListener("DOMContentLoaded", () => {
    // Initial scroll check

    scrollActive();

    showScrollTop();

    revealOnScroll();

    const cards = document.querySelectorAll(".project-card, .grid-wrapper");

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});

// ========== PERFORMANCE OPTIMIZATION ==========

function debounce(func, wait = 10) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);

            func(...args);
        };

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);
    };
}

window.addEventListener(
    "scroll",
    debounce(() => {
        scrollActive();

        showScrollTop();

        revealOnScroll();
    }, 10),
);

// FUNZIONE DI FILTRO PER I PROGETTI

var btns = document.querySelectorAll(".filters button");

var cats = document.querySelectorAll("#progetti .portfolio-category");

btns.forEach(function (b) {
    b.addEventListener("click", function () {
        btns.forEach(function (x) {
            x.classList.remove("active");
            x.setAttribute("aria-selected", "false");
        });

        b.classList.add("active");

        b.setAttribute("aria-selected", "true");

        var f = b.dataset.filter;

        cats.forEach(function (c) {
            var show = f === "all" || c.dataset.cat === f;

            c.style.display = show ? "" : "none";
        });
    });
});

// ========== CAROSELLO PROGETTI ==========

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");
    const dotsBox = carousel.querySelector(".carousel-dots");

    if (!track || slides.length === 0) return;

    let current = 0;

    function goTo(i) {
        track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: "smooth" });
    }

    const dots = slides.map((slide, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Vai al progetto ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsBox.appendChild(dot);
        return dot;
    });

    function update() {
        dots.forEach((d, i) => d.setAttribute("aria-current", String(i === current)));
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === slides.length - 1;
    }

    prevBtn.addEventListener("click", () => goTo(Math.max(current - 1, 0)));
    nextBtn.addEventListener("click", () => goTo(Math.min(current + 1, slides.length - 1)));

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    current = slides.indexOf(e.target);
                    update();
                }
            });
        },
        { root: track, threshold: 0.6 },
    );

    slides.forEach((s) => io.observe(s));
    update();
});
