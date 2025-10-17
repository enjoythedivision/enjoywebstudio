gsap.registerPlugin(SplitText);
gsap.set("h1", { opacity: 1 });

let split = SplitText.create(".hero h1", { type: "chars" });
gsap.from(split.chars, {
  y: 20,
  autoAlpha: 0,
  stagger: 0.05
});