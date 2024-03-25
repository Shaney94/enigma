// Get all elements with the class name "accordion"
var acc = document.getElementsByClassName("accordion");

// Loop through the array of accordion buttons
for (var i = 0; i < acc.length; i++) {
  // Add a click event listener to each accordion button
  acc[i].addEventListener("click", function() {
    // Toggle the "active" class on the clicked accordion button.
    // This serves two purposes:
    // 1. It visually highlights the currently active accordion section.
    // 2. It allows us to use CSS to style the active state differently (e.g., change color).
    this.classList.toggle("active");

    // Select the next element sibling of the clicked accordion,
    // which is the associated panel that contains the content to show or hide.
    var panel = this.nextElementSibling;

    // Check if the panel is already open
    if (panel.style.maxHeight) {
      // If it's open, close it by setting maxHeight to null.
      panel.style.maxHeight = null;
    } else {
      // If it's not open, open it by setting maxHeight to the scrollHeight.
      // scrollHeight is the height of the content inside the panel, even if it's not currently visible.
      // Adding "px" is necessary because maxHeight expects a string value with a unit.
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
