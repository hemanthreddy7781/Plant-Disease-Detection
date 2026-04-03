const typed = new Typed(".auto-type", {
  strings: ["Plant Assistance", "Plant Personal Doctor"],
  typeSpeed: 50,
  backSpeed: 50,
  loop: true,
  backDelay: 1000,
  cursorChar: " ",
  smartBackspace: true,
});

const l1 = document.querySelectorAll(".l1");
const l2 = document.querySelectorAll(".l2");

l2.forEach((element) => {
  element.addEventListener("click", function () {
    document.querySelector(".howtouse1").style.display = "none";
    document.querySelector(".howtouse2").style.display = "block";
  });
});

l1.forEach((element) => {
  element.addEventListener("click", function () {
    document.querySelector(".howtouse1").style.display = "block";
    document.querySelector(".howtouse2").style.display = "none";
  });
});

const textElements = document.querySelectorAll(".process ol li");
console.log(textElements);

textElements.forEach((element) => {
  element.addEventListener("click", function () {
    // Remove 'active' class from all elements
    textElements.forEach((el) => el.classList.remove("activef"));

    // Add 'active' class to the clicked element
    this.classList.add("activef");
  });
});

// Experiment
document.querySelectorAll(".accordion-header").forEach((button) => {
  button.addEventListener("click", () => {
    const accordionItem = button.parentElement;
    const accordionContent = button.nextElementSibling;

    // Get current height of content for smooth animation
    const contentHeight =
      accordionContent.querySelector(".accordion-body").offsetHeight;

    // If this item is already active
    if (accordionItem.classList.contains("active")) {
      // Close it
      accordionContent.style.maxHeight = "0px";
      accordionItem.classList.remove("active");
      accordionContent.classList.remove("active");
    } else {
      // Close any open items first
      document
        .querySelectorAll(".accordion-item.active")
        .forEach((activeItem) => {
          activeItem.classList.remove("active");
          activeItem.querySelector(".accordion-content").style.maxHeight =
            "0px";
          activeItem
            .querySelector(".accordion-content")
            .classList.remove("active");
        });

      // Open clicked item
      accordionContent.style.maxHeight = contentHeight + "px";
      accordionItem.classList.add("active");
      accordionContent.classList.add("active");
    }
  });
});
