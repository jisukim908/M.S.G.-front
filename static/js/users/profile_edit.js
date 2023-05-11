window.onload = async function loadProfile() {
    user = localStorage.getItem("payload")
    user_id = user.slice(-2)[0]

    const response = await fetch('http://127.0.0.1:8000/users/profile/'+ user_id + '/', {
        method : 'GET'
    })
    response_json = await response.json()
    const email = document.getElementById('email')
    const username = document.getElementById('username')
    const bio = document.getElementById('bio')
    const profile_image = document.getElementById('profile_image')

    email.innerText = response_json['email']
    username.setAttribute("value" ,response_json['username'])
    bio.innerText = response_json['bio']
    profile_image.src = 'http://127.0.0.1:8000' + response_json['profile_image']

    const response_tag = await fetch('http://127.0.0.1:8000/users/tag/', {
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
        const newTag = document.createElement('label')
        newTag.setAttribute("class", "tag-input")
        newTag.innerText = tag['name']
        tags.appendChild(newTag).appendChild(newInput)
    })
    
    response_json['tags'].forEach(e => {
        document.getElementById(e).checked = true;
    })
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

async function handleEdit() {
    user = localStorage.getItem("payload")
    user_id = user.slice(-2)[0]

    const response = await fetch('http://127.0.0.1:8000/users/profile/'+ user_id + '/', {
        method : 'GET'
    })
    response_json = await response.json()

    const query = 'input[name="tag"]:checked';
    const selectedEls = document.querySelectorAll(query)

    const tag = []
    selectedEls.forEach((el) => {
        tag.push(parseInt(el.value))
    })

    console.log(localStorage.getItem("access"))
    console.log(response_json)

    const email = response_json['email']
    const password = response_json['password']
    const username = document.getElementById('username').value;
    const bio = document.getElementById('bio').value;
   
    const response_edit = await fetch('http://127.0.0.1:8000/users/profile/' + user_id + '/', {
        headers:{
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type':'application/json',
        },
        method:'PUT',
        body: JSON.stringify({
            "email": email,
            "password": password,
            "username": username,
            "bio": bio,
            "tags": tag,
        })

    })
    console.log(response_edit)
    location.href = 'profile.html';
}