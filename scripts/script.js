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

//Quiz Arrays and Functions

const question = [
  {
    name: "Question 1: How do you prefer to spend you free time?",
    id: "Question-1__title",
  },
  {
    name: "Question 2: How much time do you want to commit?",
    id: "Question-2__title",
  },
  {
    name: "Question 3: What's your main motivation for celebrating Earth Day?",
    id: "Question-3__title",
  },
  {
    name: "Question 4: Which of these do you enjoy the most?",
    id: "Question-4__title",
  },
  {
    name: "Question 5: Do you prefer solo activiites or group efforts?",
    id: "Question-5__title",
  },
];

const answers = [
  //Value 1 or A's
  {
    name: "Outdoors, being active",
    value: 1,
    id: "Question-1__answer",
  },
  {
    name: "A few hours outdoors",
    value: 1,
    id: "Question-2__answer",
  },
  {
    name: "Helping clean up and protect the environment",
    value: 1,
    id: "Question-3__answer",
  },
  {
    name: "Walking, hiking, or exploring nature",
    value: 1,
    id: "Question-4__answer",
  },
  {
    name: "I like working alone or with close family",
    value: 1,
    id: "Question-5__answer",
  },

  //Value 2 or B's
  {
    name: "Doing hands-on projects",
    value: 2,
    id: "question-1__answer",
  },
  {
    name: "A whole day for a meaningful project",
    value: 2,
    id: "question-2__answer",
  },
  {
    name: "Supporting nature and wildlife",
    value: 2,
    id: "question-3__answer",
  },
  {
    name: "Gardening, DIY projects, or crafting",
    value: 2,
    id: "question-4__answer",
  },
  {
    name: "I enjoy DIY projects at my own pace",
    value: 2,
    id: "question-5__answer",
  },
  //Value 3 or C's
  {
    name: "Learning new things and sharing knowledge",
    value: 3,
    id: "question-1__answer",
  },
  {
    name: "Just a small change in my routine",
    value: 3,
    id: "question-2__answer",
  },
  {
    name: "Raising awareness and inspiring others",
    value: 3,
    id: "question-3__answer",
  },
  {
    name: "Organizing or social events",
    value: 3,
    id: "question-4__answer",
  },
  {
    name: " I love being part of a community or group",
    value: 3,
    id: "question-5__answer",
  },
  {
    name: "Making small but impactful changes in daily life",
    value: 4,
    id: "question-1__answer",
  },
  {
    name: "I'd love something ongoing",
    value: 4,
    id: "question-2__answer",
  },
  {
    name: "Reducing waste and living more sustainably",
    value: 4,
    id: "question-3__answer",
  },
  {
    name: "Trying new eco-friendly habits",
    value: 4,
    id: "question-4__answer",
  },
  {
    name: "I like a mix of both",
    value: 4,
    id: "question-5__answer",
  },
];

const results = [
  {
    name: "Going Car-Free:You enjoy being active outdoors, making clean-ups or nature-focused activities a great fit!",
    value: [4, 5, 6, 7],
    id: "result_A",
  },
  {
    name: "Plant a Tree, Start a Garden, Build a Birdhouse:You like hands-on projects that help the environment grow and thrive.",
    value: [5, 6, 7, 8, 9, 10],
    id: "result_B",
  },
  {
    name: "Attend an Earth Day Event, Host a Clothing Swap: You enjoy social activities that raise awareness and inspire others.",
    value: [11, 12, 13, 14, 15],
    id: "result_C",
  },
  {
    name: "Reduce, Reuse, Recycle Challenge, Switch to Sustainable Products:You prefer making small but impactful lifestyle changes for a greener future.",
    value: [16, 17, 18, 19, 20],
    id: "result_D",
  },
];
