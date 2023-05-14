console.log("hey")




function displayLocalFile (strFileName) {
    var url = 'file:/media/' + strFileName;
    if (document.layers && location.protocol.toLowerCase() != 'file:' && navigator.javaEnabled())
      netscape.security.PrivilegeManager.enablePrivilege('UniversalFileRead');
    open (url, 'preview');
  }

function preview(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
          document.getElementById("profile_image").src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
  }
  else {
      document.getElementById("profile_image").src = "";
  }
}



//   const response_edit = await fetch('http://127.0.0.1:8000/users/profile/' + user_id + '/', {
//     headers:{
//         'Authorization': 'Bearer ' + localStorage.getItem("access"),
//         'content-type':'application/json',
//     },
//     method:'PUT',
//     body: JSON.stringify({
//         "email": email,
//         "password": password,
//         "username": username,
//         "bio": bio,
//         "tags": tag,
//     })
// })
// console.log(response_edit)
// location.href = 'profile.html';