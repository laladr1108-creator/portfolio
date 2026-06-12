const cards = document.querySelectorAll(".project-card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -4;
    card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

