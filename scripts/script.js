document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("ecoPopup");
  const openButton = document.querySelector(".eco-squad__button");
  const closeButton = document.querySelector(".popup__close");
  const joinButton = document.querySelector(".popup__join-button");

  // Open popup
  openButton.addEventListener("click", () => {
    popup.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling when popup is open
  });

  // Close popup
  closeButton.addEventListener("click", () => {
    popup.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  });

  // Close popup when clicking outside
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Handle join button click
  joinButton.addEventListener("click", () => {
    // Here you would typically handle the join group functionality
    alert(
      "Thank you for joining! We'll send you more details about the upcoming activity."
    );
    popup.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Close popup with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("active")) {
      popup.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
});
