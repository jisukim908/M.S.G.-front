const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5501"

console.log("hey")

window.onload = async function loadTag() {

  const response_tag = await fetch(`${backend_base_url}/users/tag/`, {
        method : 'GET'
    });

    response_json_tag = await response_tag.json()
    const tags = document.getElementById("tags")
    response_json_tag.forEach(tag => {
        const newInput = document.createElement('input')
        newInput.setAttribute("type", "checkbox")
        newInput.setAttribute("name", "tag")
        newInput.setAttribute("value", tag['id'])
        newInput.setAttribute("id", tag['name'])
        newInput.setAttribute("class", 'check')
        const newTag = document.createElement('label')
        newTag.setAttribute("class", "tag-input")
        newTag.innerText = tag['name']
        tags.appendChild(newTag).appendChild(newInput)

    })

  }

async function handlePost(){
  user = localStorage.getItem("payload")
  user_id = user.slice(-2)[0]
  
  const title = document.getElementById("title").value
  const context = document.getElementById("context").value
  const image = document.getElementById("image").src
  console.log(image)

  check_video_key = document.getElementById("result")
  console.log(check_video_key)
  if(check_video_key === null){
  } else {
    const video_key = document.getElementById("video_key").value
  }
  const query = 'input[name="tag"]:checked';
  const selectedEls = document.querySelectorAll(query)
  const tag = []
  selectedEls.forEach((el) => {
      tag.push(parseInt(el.value))
  })
  console.log(title)

  if(check_video_key === null){
    stringify = JSON.stringify({
      "title":title,
      "context":context,
      'image':image,
      'tag':tag
    })
  } else {  
    stringify = JSON.stringify({
      "title":title,
      "context":context,
      'image':image,
      'video_key':video_key, 
      'tag':tag
    })
  }

  const request_post = await fetch(`${backend_base_url}/create_feed/`, {
    headers:{
      headers: {
        "access-control-allow-origin": "*",
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': '*',
      },
      'Authorization': 'Bearer ' + localStorage.getItem("access"),
      'contect-type' : 'application/json',
  },
  method:"POST",
  body: stringify
  });
console.log("포스트 성공")
// location.href = 'channelinfo.html'
}

function preview(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
          document.getElementById("image_preview").src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
  }
  else {
      document.getElementById("image").src = "";
  }
}

function printVideoKey()  {
  const video_key = document.getElementById('video_key').value;
  document.getElementById("result").innerText = video_key;
}