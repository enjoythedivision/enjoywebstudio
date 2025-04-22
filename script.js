document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links a");
  
    // Toggle menu
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      nav.classList.toggle("active");
    });
  
    // Close menu when any nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        burger.classList.remove("active");
        nav.classList.remove("active");
      });
    });
  });
  