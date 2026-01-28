/*
 Plugin name: Password protect blog
 Description: Add a password to a blog in order to view the content.
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function() {
      // Initially hide the content
      document.body.style.display = "none";

      // Check if the user is already logged in
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (!isLoggedIn) {
        // Set password here
        const correctPassword = 'password';

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
})();