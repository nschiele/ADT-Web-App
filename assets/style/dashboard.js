/* globals Chart:false, feather:false */
// $(document).ready(function() {
  
// });

function checkInput() {
  var textareaValues = document.getElementById("textAreaJsonContent").value;
  if(textareaValues.length > 0) {
    document.getElementById('generateTreeButton').disabled = false; 
    } else { 
        document.getElementById('generateTreeButton').disabled = true;
    }
}

// show alert when submitting the text of the tree
const toggleBtn = document.getElementById("generateTreeButton");
const smallText = document.getElementById("alert");

toggleBtn.addEventListener("click", function() {
  smallText.classList.toggle("hiddenAlert");
});

(() => {
  'use strict'
  feather.replace({ 'aria-hidden': 'true' })
})()

document.querySelectorAll('[data-bs-toggle="tooltip"]')
  .forEach(tooltip => {
    new bootstrap.Tooltip(tooltip)
})