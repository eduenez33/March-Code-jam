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

    // Variables that will be recalculated on resize
    let cardWidth;
    let totalUniqueWidth;
    let currentPosition = 0;
    let autoScrollInterval;

    // Different transitions for different purposes
    const buttonTransition = "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
    const autoScrollTransition = "transform 0.5s linear"; // Linear for continuous scrolling

    // Function to calculate dimensions based on current viewport
    const calculateDimensions = () => {
      // Get the current width of a card including gap
      const cardElement = uniqueCards[0];
      const cardStyle = window.getComputedStyle(cardElement);
      const cardWidthValue = cardElement.offsetWidth;
      const gapValue = parseInt(
        getComputedStyle(cardsContainer).columnGap || 20
      );

      cardWidth = cardWidthValue + gapValue;

      // Adjust calculation to account for the full set plus first card for smooth looping
      totalUniqueWidth = cardWidth * 8;

      // Reset position if needed to avoid being in a strange state
      if (Math.abs(currentPosition) > totalUniqueWidth * 1.5) {
        currentPosition = 0;
        cardsContainer.style.transition = "none";
        cardsContainer.style.transform = `translateX(0px)`;
        cardsContainer.offsetHeight; // Force reflow
      }

      // Adjust animation speed based on viewport width
      if (autoScrollInterval) {
        // Restart auto-scroll with new dimensions
        stopAutoScroll();
        startAutoScroll();
      }
    };

    // Function to update position and handle infinite loop
    const updatePosition = (useTransition = true, isAutoScroll = false) => {
      // Check if we've scrolled past the point where we need to loop
      if (currentPosition <= -(totalUniqueWidth + cardWidth / 4)) {
        // Reset to beginning position
        currentPosition = 0;

        // Disable transition for the position reset
        cardsContainer.style.transition = "none";
        cardsContainer.style.transform = `translateX(${currentPosition}px)`;

        // Force browser to acknowledge the style change before re-enabling transition
        cardsContainer.offsetHeight;

        // Re-enable transition if needed
        if (useTransition) {
          cardsContainer.style.transition = isAutoScroll
            ? autoScrollTransition
            : buttonTransition;
        }
      } else if (currentPosition > 0) {
        // For backward navigation, move to end of the cloned set
        currentPosition = -totalUniqueWidth;

        cardsContainer.style.transition = "none";
        cardsContainer.style.transform = `translateX(${currentPosition}px)`;
        cardsContainer.offsetHeight;

        if (useTransition) {
          cardsContainer.style.transition = isAutoScroll
            ? autoScrollTransition
            : buttonTransition;
        }
      }

      // Apply the transform
      cardsContainer.style.transform = `translateX(${currentPosition}px)`;
    };

    // Function to start auto-scrolling
    const startAutoScroll = () => {
      stopAutoScroll(); // Clear any existing interval first

      // Set initial transition to linear for continuous scrolling
      cardsContainer.style.transition = autoScrollTransition;

      // Adjust scroll speed based on viewport width
      const scrollSpeed = window.innerWidth <= 768 ? 120 : 100;

      autoScrollInterval = setInterval(() => {
        // Move a fraction of the card width for smooth scrolling
        // Smaller devices move slightly faster to complete in the same time
        currentPosition -= cardWidth / scrollSpeed;
        updatePosition(true, true); // Pass true for isAutoScroll
      }, 16); // ~60fps for smoother animation
    };

    // Function to stop auto-scrolling
    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };

    // Function to smoothly advance by one card
    const smoothAdvance = (direction) => {
      // Stop auto-scrolling
      stopAutoScroll();

      // Set transition for the manual navigation (eased)
      cardsContainer.style.transition = buttonTransition;

      // Calculate the target position (advancing by exactly one card)
      currentPosition += direction * cardWidth;

      // Apply the transform
      updatePosition(true, false); // Pass false for isAutoScroll to use button transition

      // After the transition completes, resume auto-scrolling
      setTimeout(() => {
        startAutoScroll();
      }, 600); // Slightly longer than transition duration to ensure it completes
    };

    // Next button: move left (negative direction)
    nextBtn.addEventListener("click", () => {
      smoothAdvance(-1);
    });

    // Prev button: move right (positive direction)
    prevBtn.addEventListener("click", () => {
      smoothAdvance(1);
    });

    // Pause on hover
    cardsContainer.addEventListener("mouseenter", () => {
      // Get current computed position before stopping
      const computedStyle = window.getComputedStyle(cardsContainer);
      const matrix = new DOMMatrixReadOnly(computedStyle.transform);
      currentPosition = matrix.m41; // Extract the X translation value

      // Now stop the animation with the exact current position
      stopAutoScroll();
      cardsContainer.style.transition = "none";
      cardsContainer.style.transform = `translateX(${currentPosition}px)`;
    });

    // Resume on mouse leave
    cardsContainer.addEventListener("mouseleave", () => {
      // Restore transition before starting auto-scroll
      cardsContainer.style.transition = autoScrollTransition;
      startAutoScroll();
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      // Debounce resize events
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        calculateDimensions();
      }, 200);
    });

    // Initial calculations and setup
    calculateDimensions();
    cardsContainer.style.transform = `translateX(${currentPosition}px)`;
    startAutoScroll();
  }

  const popup = document.getElementById("ecoPopup");
  const openButton = document.querySelector(".eco-squad__button");
  const ecoCloseButton = document.querySelector(".popup__close");
  const joinButton = document.querySelector(".popup__join-button");
  const quizLink = document.getElementById("quiz-link");
  const quizCloseButton = document.querySelector(".quiz__close");

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

  // Quiz link click handler
  quizLink.addEventListener("click", () => {
    quizPopup.classList.add("quiz__pop-up_opened");
    displayQuestion(currentQuestion);
  });

  // Function to close quiz popup and reset
  const closeQuizPopup = () => {
    // Clear the answers container immediately
    const answersContainer = document.getElementById("answers");
    const questionElement = document.getElementById("question");
    if (answersContainer) {
      answersContainer.innerHTML = "";
    }
    if (questionElement) {
      questionElement.textContent = "";
    }

    // Remove class to hide the popup
    quizPopup.classList.remove("quiz__pop-up_opened");
    document.body.style.overflow = "";

    // Reset quiz state
    currentQuestion = 0;
    userAnswers = [];
  };

  // Close Quiz Popup when clicking the X button
  quizCloseButton.addEventListener("click", closeQuizPopup);

  // Close quiz when clicking outside the modal
  quizPopup.addEventListener("click", (e) => {
    if (e.target === quizPopup) {
      closeQuizPopup();
    }
  });

  // Close quiz with Escape key
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      quizPopup.classList.contains("quiz__pop-up_opened")
    ) {
      closeQuizPopup();
    }
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
        <button class="quiz__button-result" id="restartQuiz">Take Quiz Again</button>
      </div>
    `;

    // Add restart button functionality
    document.getElementById("restartQuiz").addEventListener("click", () => {
      currentQuestion = 0;
      userAnswers = [];
      displayQuestion(currentQuestion);
    });
  }

  // Eco-squad popup functionality
  openButton.addEventListener("click", () => {
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  ecoCloseButton.addEventListener("click", () => {
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

  // Event-location data with coordinates
  const events = [
    {
      name: "2025 Earth Day Festival",
      date: "Saturday, April 19th, 2025",
      location: "Yerba Buena Gardens, San Francisco, CA",
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    {
      name: "Earth Day Marketplace: A Celebration of Sustainable Living",
      date: "Saturday, April 19th, 2025",
      location: "Downtown, Santa Monica, CA",
      coordinates: { lat: 34.0161, lng: -118.4962 },
    },
    {
      name: "Earth Day Clean-Up 2025",
      date: "Tuesday, April 22nd, 2025",
      location: "USU Botanical Center, Kaysville, UT",
      coordinates: { lat: 41.0352, lng: -111.9386 },
    },
    {
      name: "Earth Day Parks Clean-Up 2025",
      date: "Saturday, April 26th, 2025",
      location: "Smith Park, Chicago, IL",
      coordinates: { lat: 41.8934, lng: -87.6895 },
    },
    {
      name: "Greenfield Earth Day Clean-Up",
      date: "Saturday, April 26th, 2025",
      location: "Magee Recreation Center, Pittsburgh, PA",
      coordinates: { lat: 40.4244, lng: -79.9368 },
    },
    {
      name: "Broadway Celebrates Earth Day",
      date: "Saturday, April 26th, 2025",
      location: "Times Square, New York, NY",
      coordinates: { lat: 40.758896, lng: -73.98513 },
    },
    {
      name: "Earth Day Celebration: Caminantes de la Nueva Tierra",
      date: "Saturday, April 26th, 2025",
      location: "Manuel Artime Theater, Miami, FL",
      coordinates: { lat: 25.772546, lng: -80.209594 },
    },
    {
      name: "Earth Day Festival",
      date: "Tuesday, April 22nd, 2025",
      location: "Atlanta Botanical Garden, Atlanta, GA",
      coordinates: { lat: 33.79, lng: -84.3726 },
    },
    {
      name: "Earth Day Rail Trail Clean Up",
      date: "Saturday, April 19th, 2025",
      location: "New Bern Station, Charlotte, NC",
      coordinates: { lat: 35.1045, lng: -77.0373 },
    },
    {
      name: "Earth Day Celebration & Community Activation",
      date: "Saturday, April 19th, 2025",
      location: "The Portal, Austin, TX",
      coordinates: { lat: 30.1944, lng: -97.8049 },
    },
  ];

  // Function to calculate distance between two points using Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  // Function to find the closest event to user's location
  function findClosestEvent(userLat, userLng) {
    let closestEvent = null;
    let minDistance = Infinity;

    events.forEach((event) => {
      const distance = calculateDistance(
        userLat,
        userLng,
        event.coordinates.lat,
        event.coordinates.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestEvent = event;
      }
    });

    return { event: closestEvent, distance: minDistance };
  }

  // Function to get user's location and suggest nearest event
  function suggestNearestEvent() {
    const locationButton = document.querySelector(".eco-squad__button");
    const popup = document.getElementById("ecoPopup");

    if (locationButton && popup) {
      // Store original popup content for when we need to restore it
      const popupContent = document.querySelector(".popup__content");
      const originalContent = popupContent ? popupContent.innerHTML : "";

      // Create a permission prompt content
      const permissionPromptContent = `
        <button class="popup__close">&times;</button>
        <h2 class="popup__title">Find Events Near You</h2>
        <div class="popup__group">
          <p class="popup__group-description">
            To show you events closest to your location, we need permission to access your location data.
          </p>
        </div>
        <button class="popup__join-button" id="location-permission-button">Share My Location</button>
      `;

      // Modify the button's click handler
      locationButton.addEventListener("click", (e) => {
        e.preventDefault();

        // Show popup with permission prompt
        if (popupContent) {
          popupContent.innerHTML = permissionPromptContent;

          // Add new close button event listener
          const newCloseButton = popupContent.querySelector(".popup__close");
          if (newCloseButton) {
            newCloseButton.addEventListener("click", () => {
              popup.classList.remove("active");
              document.body.style.overflow = "";

              // Restore original content after popup is closed
              setTimeout(() => {
                popupContent.innerHTML = originalContent;

                // Reattach original close button event listener
                const originalCloseButton =
                  popupContent.querySelector(".popup__close");
                if (originalCloseButton) {
                  originalCloseButton.addEventListener("click", () => {
                    popup.classList.remove("active");
                    document.body.style.overflow = "";
                  });
                }
              }, 300);
            });
          }
        }

        // Show the popup
        popup.classList.add("active");
        document.body.style.overflow = "hidden";

        // Add click handler to the permission button
        const permissionButton = document.getElementById(
          "location-permission-button"
        );
        if (permissionButton) {
          permissionButton.addEventListener("click", () => {
            if ("geolocation" in navigator) {
              permissionButton.textContent = "Locating...";
              permissionButton.disabled = true;

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const userLat = position.coords.latitude;
                  const userLng = position.coords.longitude;

                  const { event: closestEvent, distance } = findClosestEvent(
                    userLat,
                    userLng
                  );

                  // Update popup with closest event information
                  if (popupContent) {
                    popupContent.innerHTML = `
                      <button class="popup__close">&times;</button>
                      <h2 class="popup__title">Closest Event To You</h2>
                      <div class="popup__group">
                        <h3 class="popup__group-name">${closestEvent.name}</h3>
                        <p class="popup__group-description">
                          This event is approximately ${Math.round(
                            distance
                          )} km away from your current location.
                        </p>
                      </div>
                      <div class="popup__activity">
                        <h3 class="popup__activity-title">Event Details</h3>
                        <p class="popup__activity-details">
                          ${closestEvent.name} - ${closestEvent.date}
                        </p>
                        <p class="popup__activity-location">📍 ${
                          closestEvent.location
                        }</p>
                      </div>
                      <button class="popup__join-button">Register for Event</button>
                    `;

                    // Add new close button event listener
                    const newCloseButton =
                      popupContent.querySelector(".popup__close");
                    if (newCloseButton) {
                      newCloseButton.addEventListener("click", () => {
                        popup.classList.remove("active");
                        document.body.style.overflow = "";
                      });
                    }

                    // Add join button event listener
                    const joinButton = popupContent.querySelector(
                      ".popup__join-button"
                    );
                    if (joinButton) {
                      joinButton.addEventListener("click", () => {
                        alert(
                          "Thank you for registering! We'll send you more details about the upcoming event."
                        );
                        popup.classList.remove("active");
                        document.body.style.overflow = "";
                      });
                    }
                  }
                },
                (error) => {
                  if (popupContent) {
                    popupContent.innerHTML = `
                      <button class="popup__close">&times;</button>
                      <h2 class="popup__title">Location Error</h2>
                      <div class="popup__group">
                        <p class="popup__group-description">
                          We couldn't access your location. Please try again later or browse all available events.
                        </p>
                      </div>
                      <button class="popup__join-button" id="view-all-events">View All Events</button>
                    `;

                    // Add new close button event listener
                    const newCloseButton =
                      popupContent.querySelector(".popup__close");
                    if (newCloseButton) {
                      newCloseButton.addEventListener("click", () => {
                        popup.classList.remove("active");
                        document.body.style.overflow = "";

                        // Restore original content after popup is closed
                        setTimeout(() => {
                          popupContent.innerHTML = originalContent;
                        }, 300);
                      });
                    }

                    // Add view all events button event listener
                    const viewAllButton =
                      document.getElementById("view-all-events");
                    if (viewAllButton) {
                      viewAllButton.addEventListener("click", () => {
                        // Show original content with all events
                        popupContent.innerHTML = originalContent;

                        // Reattach original close button event listener
                        const originalCloseButton =
                          popupContent.querySelector(".popup__close");
                        if (originalCloseButton) {
                          originalCloseButton.addEventListener("click", () => {
                            popup.classList.remove("active");
                            document.body.style.overflow = "";
                          });
                        }
                      });
                    }
                  }
                }
              );
            } else {
              if (popupContent) {
                popupContent.innerHTML = `
                  <button class="popup__close">&times;</button>
                  <h2 class="popup__title">Geolocation Not Supported</h2>
                  <div class="popup__group">
                    <p class="popup__group-description">
                      Your browser doesn't support geolocation. Please try using a different browser or view all available events.
                    </p>
                  </div>
                  <button class="popup__join-button" id="view-all-events">View All Events</button>
                `;

                // Add new close button event listener
                const newCloseButton =
                  popupContent.querySelector(".popup__close");
                if (newCloseButton) {
                  newCloseButton.addEventListener("click", () => {
                    popup.classList.remove("active");
                    document.body.style.overflow = "";
                  });
                }

                // Add view all events button event listener
                const viewAllButton =
                  document.getElementById("view-all-events");
                if (viewAllButton) {
                  viewAllButton.addEventListener("click", () => {
                    // Show original content with all events
                    popupContent.innerHTML = originalContent;

                    // Reattach original close button event listener
                    const originalCloseButton =
                      popupContent.querySelector(".popup__close");
                    if (originalCloseButton) {
                      originalCloseButton.addEventListener("click", () => {
                        popup.classList.remove("active");
                        document.body.style.overflow = "";
                      });
                    }
                  });
                }
              }
            }
          });
        }
      });
    }
  }

  // Initialize location feature
  suggestNearestEvent();
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
