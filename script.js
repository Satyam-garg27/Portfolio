const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const progress = $("#progress");
const header = $("#header");
const nav = $("#nav");
const menuBtn = $("#menuBtn");

const projectThumbs = document.querySelectorAll(".project-thumb");
const projectFilters = document.querySelectorAll(".filter");

projectFilters.forEach(filter => {
  filter.addEventListener("click", () => {
    const selected = filter.dataset.filter;

    projectFilters.forEach(btn => {
      btn.classList.remove("active");
    });

    filter.classList.add("active");

    projectThumbs.forEach(project => {
      const categories = project.dataset.category.split(" ");

      if (selected === "all" || categories.includes(selected)) {
        project.style.display = "";
      } else {
        project.style.display = "none";
      }
    });
  });
});

function updateScroll() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${height > 0 ? (scrollTop / height) * 100 : 0}%`;
  header.classList.toggle("scrolled", scrollTop > 8);
}
window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
$$(".nav a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach(el => revealObserver.observe(el));

const sections = $$("main section[id]");
const navLinks = $$(".nav a");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle(
      "active", link.getAttribute("href") === `#${entry.target.id}`
    ));
  });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

$$(".filter").forEach(button => {
  button.addEventListener("click", () => {
    $$(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    $$(".project").forEach(project => {
      const categories = project.dataset.category || "";
      project.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

$$("[data-count]").forEach(el => {
  const target = Number(el.dataset.count);
  const suffix = el.textContent.includes("+") ? "+" : "";
  let started = false;
  const counterObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    const start = performance.now();
    const duration = 900;
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.disconnect();
  }, { threshold: .8 });
  counterObserver.observe(el);
});

$("#year").textContent = new Date().getFullYear();
