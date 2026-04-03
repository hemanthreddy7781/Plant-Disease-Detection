document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".card");
  const createAccountLink = document.querySelector(".createnew a");
  const backToLoginLink = document.querySelector(".backtologin a");

  createAccountLink.addEventListener("click", (e) => {
    e.preventDefault();
    card.classList.add("flipped");
  });

  backToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    card.classList.remove("flipped");
  });

  // Add transition end event to ensure smooth height animation
  card.addEventListener("transitionend", (e) => {
    if (e.propertyName === "transform") {
      if (!card.classList.contains("flipped")) {
        card.style.height = "580px"; // Reset to original height
      }
    }
  });

  // Password toggle functionality
  const passwordContainers = document.querySelectorAll(".password-container");

  passwordContainers.forEach((container) => {
    const toggleBtn = container.querySelector(".password-toggle");
    const input = container.querySelector("input");

    toggleBtn.addEventListener("click", () => {
      container.classList.toggle("show-password");
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  document.querySelector(".loginbtn").addEventListener("click", function () {
    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (username === "ysaipranavreddy09@gmail.com" && password === "12345678") {
      window.location.href = "landingindex.html";
    } else {
      alert("Invalid username or password");
    }
  });
});
