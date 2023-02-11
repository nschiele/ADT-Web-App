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
      

function changeActiveNavLinkColor(){
  var clickedNav = document.getElementById("toolsTab");
  if(clickedNav.classList.contains("collapsed")){
    console.log(clickedNav.classList.contains("collapsed"));
    clickedNav.classList.remove("active");
    // clickedNav.className += "collapsed Active";
  }
  else{
    clickedNav.className += " active";
  }
}

(() => {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })
})()

document.querySelectorAll('[data-bs-toggle="tooltip"]')
  .forEach(tooltip => {
    new bootstrap.Tooltip(tooltip)
})