document.addEventListener("DOMContentLoaded", function() {
  // Initially hide the content
  document.body.style.display = "none";

  // Check if the user is already logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    const script = document.currentScript || document.querySelector('script[src*="password-protect.js"]');
    const correctPassword = script.dataset.password;
    
    let userInput;
    let isPasswordCorrect = false;

    while (!isPasswordCorrect) {
      userInput = prompt("Please enter the password:");

      if (userInput === null) { // User pressed cancel
        break;
      } else if (userInput === correctPassword) {
        localStorage.setItem("isLoggedIn", "true");
        document.body.style.display = "block";
        isPasswordCorrect = true;
      } else {
        alert("Incorrect password. Please try again.");
      }
    }
  } else {
    // If the user is logged in, show the content
    document.body.style.display = "block";
  }
});