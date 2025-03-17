document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.querySelector(".cards__container");
  const wrapper = document.querySelector(".cards__wrapper");
  const prevBtn = document.querySelector(".cards__nav--prev");
  const nextBtn = document.querySelector(".cards__nav--next");

  if (cardsContainer && wrapper && prevBtn && nextBtn) {
    // Clone cards for infinite scroll
    const uniqueCards = Array.from(
      cardsContainer.querySelectorAll(".card")
    ).slice(0, 8);
    uniqueCards.forEach((card) => {
      const clone = card.cloneNode(true);
      cardsContainer.appendChild(clone);
    });

    const cardWidth = uniqueCards[0].offsetWidth + 20; // Card width + gap
    const totalUniqueWidth = cardWidth * 8; // Width of original 8 cards
    let currentPosition = 0;
    let autoScrollInterval;

    // Function to update position and handle infinite loop
    const updatePosition = () => {
      if (currentPosition <= -totalUniqueWidth) {
        currentPosition += totalUniqueWidth; // Jump back seamlessly
        cardsContainer.style.transition = "none"; // No transition for jump
        cardsContainer.style.transform = `translateX(${currentPosition}px)`;
        cardsContainer.offsetHeight; // Trigger reflow
        cardsContainer.style.transition = "transform 0.5s ease"; // Re-enable transition
      } else if (currentPosition > 0) {
        currentPosition -= totalUniqueWidth; // Jump to end if past start
        cardsContainer.style.transition = "none";
        cardsContainer.style.transform = `translateX(${currentPosition}px)`;
        cardsContainer.offsetHeight;
        cardsContainer.style.transition = "transform 0.5s ease";
      }
      cardsContainer.style.transform = `translateX(${currentPosition}px)`;
    };

    // Function to start auto-scrolling
    const startAutoScroll = () => {
      stopAutoScroll(); // Clear any existing interval first
      autoScrollInterval = setInterval(() => {
        currentPosition -= cardWidth / 50; // Smooth slow scrolling
        updatePosition();
      }, 20);
    };

    // Function to stop auto-scrolling
    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    };

    // Next button: move left
    nextBtn.addEventListener("click", () => {
      stopAutoScroll(); // Pause auto-scroll
      currentPosition -= cardWidth;
      updatePosition();
      setTimeout(startAutoScroll, 1000); // Resume auto-scroll after 1 second
    });

    // Prev button: move right
    prevBtn.addEventListener("click", () => {
      stopAutoScroll(); // Pause auto-scroll
      currentPosition += cardWidth;
      updatePosition();
      setTimeout(startAutoScroll, 1000); // Resume auto-scroll after 1 second
    });

    // Pause on hover
    cardsContainer.addEventListener("mouseenter", () => {
      stopAutoScroll();
    });

    // Resume on mouse leave
    cardsContainer.addEventListener("mouseleave", () => {
      startAutoScroll();
    });

    // Initial position
    cardsContainer.style.transform = `translateX(${currentPosition}px)`;

    // Start auto-scrolling
    startAutoScroll();
  }

  const popup = document.getElementById("ecoPopup");
  const openButton = document.querySelector(".eco-squad__button");
  const closeButton = document.querySelector(".popup__close");
  const joinButton = document.querySelector(".popup__join-button");

  // Quiz elements
  const quizPopup = document.querySelector(".quiz__pop-up");
  const quizButton = document.querySelector(".quiz__button");
  let currentQuestion = 0;
  let userAnswers = [];

  // Quiz button click handler
  quizButton.addEventListener("click", () => {
    quizPopup.classList.add("quiz__pop-up_opened");
    displayQuestion(currentQuestion);
  });

  // Function to display current question
  function displayQuestion(index) {
    const questionElement = document.getElementById("question");
    const answersContainer = document.getElementById("answers");

    if (index < question.length) {
      questionElement.textContent = question[index].name;
      answersContainer.innerHTML = "";

      // Get answers for current question (4 answers per question)
      const startIndex = index * 4;
      for (let i = 0; i < 4; i++) {
        const answer = answers[startIndex + i];
        const button = document.createElement("button");
        button.className = "quiz__button";
        button.textContent = answer.name;
        button.value = answer.value;

        button.addEventListener("click", () => {
          userAnswers.push(parseInt(button.value));
          currentQuestion++;

          if (currentQuestion < question.length) {
            displayQuestion(currentQuestion);
          } else {
            showResult();
          }
        });

        answersContainer.appendChild(button);
      }
    }
  }

  // Function to show quiz result
  function showResult() {
    const questionElement = document.getElementById("question");
    const answersContainer = document.getElementById("answers");
    const total = userAnswers.reduce((sum, value) => sum + value, 0);
    let result;

    // Find appropriate result based on total score
    if (total <= 8) {
      result = results[0];
    } else if (total <= 12) {
      result = results[1];
    } else if (total <= 16) {
      result = results[2];
    } else {
      result = results[3];
    }

    // Display result
    questionElement.textContent = "Your EcoPersona Result:";
    answersContainer.innerHTML = `
      <div class="quiz__result">
        <p>${result.name}</p>
        <button class="quiz__button" id="restartQuiz">Take Quiz Again</button>
      </div>
    `;

    // Add restart button functionality
    document.getElementById("restartQuiz").addEventListener("click", () => {
      currentQuestion = 0;
      userAnswers = [];
      displayQuestion(currentQuestion);
    });
  }

  // Close quiz when clicking outside
  quizPopup.addEventListener("click", (e) => {
    if (e.target === quizPopup) {
      quizPopup.classList.remove("quiz__pop-up_opened");
      currentQuestion = 0;
      userAnswers = [];
    }
  });

  // Close quiz with Escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      quizPopup.classList.contains("quiz__pop-up_opened")
    ) {
      quizPopup.classList.remove("quiz__pop-up_opened");
      currentQuestion = 0;
      userAnswers = [];
    }
  });

  // Eco-squad popup functionality
  openButton.addEventListener("click", () => {
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  closeButton.addEventListener("click", () => {
    popup.classList.remove("active");
    document.body.style.overflow = "";
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  joinButton.addEventListener("click", () => {
    alert(
      "Thank you for joining! We'll send you more details about the upcoming activity."
    );
    popup.classList.remove("active");
    document.body.style.overflow = "";
  });

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
  // Question 1: How do you prefer to spend your free time?
  {
    name: "Finding a peaceful spot in nature to recharge",
    value: 1,
    id: "Question-1__answer",
  },
  {
    name: "Meeting up with a close friend for a nature walk",
    value: 2,
    id: "Question-1__answer",
  },
  {
    name: "Joining local meetups for outdoor activities",
    value: 3,
    id: "Question-1__answer",
  },
  {
    name: "Planning and hosting environmental events",
    value: 4,
    id: "Question-1__answer",
  },

  // Question 2: How much time do you want to commit?
  {
    name: "Just an hour or two when it fits my schedule",
    value: 1,
    id: "Question-2__answer",
  },
  {
    name: "A weekend project with a few friends",
    value: 2,
    id: "Question-2__answer",
  },
  {
    name: "Weekly meetups with the community",
    value: 3,
    id: "Question-2__answer",
  },
  {
    name: "Dedicated time to organize and lead initiatives",
    value: 4,
    id: "Question-2__answer",
  },

  // Question 3: What's your main motivation for celebrating Earth Day?
  {
    name: "To reflect on my environmental impact",
    value: 1,
    id: "Question-3__answer",
  },
  {
    name: "To share eco-friendly tips with friends",
    value: 2,
    id: "Question-3__answer",
  },
  {
    name: "To participate in community action",
    value: 3,
    id: "Question-3__answer",
  },
  {
    name: "To inspire widespread environmental change",
    value: 4,
    id: "Question-3__answer",
  },

  // Question 4: Which of these do you enjoy the most?
  {
    name: "Tending to my own garden sanctuary",
    value: 1,
    id: "Question-4__answer",
  },
  {
    name: "Teaching friends about composting",
    value: 2,
    id: "Question-4__answer",
  },
  {
    name: "Organizing neighborhood cleanups",
    value: 3,
    id: "Question-4__answer",
  },
  {
    name: "Creating environmental education programs",
    value: 4,
    id: "Question-4__answer",
  },

  // Question 5: Do you prefer solo activities or group efforts?
  {
    name: "I thrive on independent projects",
    value: 1,
    id: "Question-5__answer",
  },
  {
    name: "I enjoy collaborating with close friends",
    value: 2,
    id: "Question-5__answer",
  },
  {
    name: "I'm energized by group dynamics",
    value: 3,
    id: "Question-5__answer",
  },
  {
    name: "I love coordinating large teams",
    value: 4,
    id: "Question-5__answer",
  },
];

const results = [
  {
    name: "Solo Eco-Warrior: You prefer making individual impact through personal choices. Try activities like maintaining a home garden, adopting sustainable living practices, or taking solo nature walks to collect litter.",
    values: [5, 6, 7, 8],
    id: "result_A",
  },
  {
    name: "Family & Friends Environmentalist: You enjoy making a difference with close ones. Consider starting a neighborhood composting program, organizing family beach cleanups, or creating a community garden with friends.",
    values: [9, 10, 11, 12],
    id: "result_B",
  },
  {
    name: "Community Environmental Advocate: You thrive in group settings! Join local environmental organizations, participate in community cleanups, or help organize Earth Day events in your area.",
    values: [13, 14, 15, 16],
    id: "result_C",
  },
  {
    name: "Environmental Movement Leader: You're a natural organizer and connector! Consider leading environmental workshops, starting your own eco-initiative, or becoming an environmental education coordinator in your community.",
    values: [17, 18, 19, 20],
    id: "result_D",
  },
];
