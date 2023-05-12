console.log("로딩 완료")

async function loadHome(){
    const response = await fetch('http://127.0.0.1:8000/', {
        method:'GET'
    })

    console.log(response)

    user = localStorage.getItem("payload")
    user_id = user.slice(-2)[0]

    response_json = await response.json()
    const username = document.getElementById('username')
    const bio = document.getElementById('bio')
    const profile_image = document.getElementById('profile_image')


}
console.log(response)
