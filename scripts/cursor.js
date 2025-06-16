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
