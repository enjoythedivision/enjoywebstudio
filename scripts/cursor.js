const cursor = document.querySelector(".custom-cursor");
const cards = document.querySelectorAll(".project-card");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

cards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    cursor.classList.add("hovering-project");
  });
  card.addEventListener("mouseleave", () => {
    cursor.classList.remove("hovering-project");
  });
});





gsap.registerPlugin(SplitText);
gsap.set("h1", { opacity: 1 });

let split = SplitText.create(".hero-title", { type: "chars" });
//now animate each character into place from 20px below, fading in:
gsap.from(split.chars, {
  y: 20,
  autoAlpha: 0,
  stagger: 0.05
});

