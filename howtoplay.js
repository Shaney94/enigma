// Initialize slideIndex with 1, starting the slideshow from the first slide
let slideIndex = 1;
// Display the initial slide
showSlides(slideIndex);

// Function to change slide when Next/Previous buttons are clicked
// n is the number indicating next (1) or previous (-1) slide
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Function to change slide when dots are clicked
// n is the number of the slide to be shown
function currentSlide(n) {
  showSlides(slideIndex = n);
}

// Main function to control the slideshow's operation
function showSlides(n) {
  let i;
  // Get all elements with the class "mySlides" and "dot"
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  // Loop back to the first slide if n exceeds the number of slides
  if (n > slides.length) {slideIndex = 1}
  // Loop to the last slide if n is less than 1
  if (n < 1) {slideIndex = slides.length}

  // Hide all slides initially
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Remove the "active" class from all dots initially
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  // Display the current slide and highlight the corresponding dot
  // slideIndex-1 is used because slideIndex is 1-based and arrays are 0-based
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
