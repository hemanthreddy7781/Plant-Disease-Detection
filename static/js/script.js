// static/js/script.js
document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("upload-form");
  const imageInput = document.getElementById("image-input");
  const resultContainer = document.getElementById("result-container");
  const previewImage = document.getElementById("preview-image");
  const predictionText = document.getElementById("prediction-text");
  const loading = document.getElementById("loading");

  // Preview image when selected
  imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle form submission
  uploadForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData();
    const file = imageInput.files[0];

    if (!file) {
      alert("Please select an image first");
      return;
    }

    formData.append("file", file);

    try {
      resultContainer.classList.add("hidden");
      loading.classList.remove("hidden");

      const response = await fetch("/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      predictionText.textContent = data.prediction;
      previewImage.src = data.image_path;
      resultContainer.classList.remove("hidden");
    } catch (error) {
      alert("An error occurred while processing the image");
      console.error(error);
    } finally {
      loading.classList.add("hidden");
    }
  });
});
