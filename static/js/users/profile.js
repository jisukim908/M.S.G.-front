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
    username.innerText = response_json['username']
    bio.innerText = response_json['bio']
    profile_image.src = 'http://127.0.0.1:8000' + response_json['profile_image']

    const response_tag = await fetch('http://127.0.0.1:8000/users/tag/', {
        method : 'GET'
    });

    console.log(response_json['tags'])
    const tags = document.getElementById("tags")
    response_json['tags'].forEach(tag => {
        const user_tag = document.createElement("p")
        user_tag.innerText = tag
        tags.appendChild(user_tag)
    })

}

