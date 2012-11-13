// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("cat_id");
  var lstrCateId = select.value;
  localStorage["cat_id"] = lstrCateId;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "saved succsssfully";
  setTimeout(function() {
    status.innerHTML = "";
  }, 2000);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["cat_id"];
  if (!favorite) 
  {
  	favorite = "100103476";
    //return;
  }
  var select = document.getElementById("cat_id");
  select.value = favorite;
  localStorage["cat_id"] = favorite; 
}

document.addEventListener('DOMContentLoaded', function () {
 document.querySelector('button').addEventListener('click', save_options);
 restore_options();
});