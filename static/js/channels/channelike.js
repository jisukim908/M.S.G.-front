const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5501"

//게시글 가져오기
async function getFeeds() {
    user = localStorage.getItem("payload")
    user_id = user.slice(-2)[0]

    const response = await fetch(`${backend_base_url}/channel/` + user_id + '/')
    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패했습니다.")
    }
    console.log(response)
}

//로그아웃
async function handleLogout() {
    console.log("버튼 눌림 / 로그아웃")
    const response = await fetch(`${backend_base_url}/users/logout/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
    })
    localStorage.removeItem("payload")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    location.href = 'login.html';
}

//상세페이지로 가기
function feeddetail(feed_id) {
    window.location.href = `${frontend_base_url}/channeldetail.html?feed_id=${feed_id}`
}


window.onload = async function requestChannelInfo() {
    user = localStorage.getItem("payload")
    user_id = user.slice(-2)[0]

    //프로필정보가져오기
    const response = await fetch(`${backend_base_url}/channel/` + user_id + '/info/', {
        method: 'GET',
    })
    response_json = await response.json()
    console.log(response_json)
    const email = document.getElementById('email')
    const username = document.getElementById('username')
    const profile_image = document.getElementById('profile_image')
    const tags = document.getElementById("tags")
    const followings_count = document.getElementById('followings_count')

    email.innerText = response_json['email']
    username.innerText = response_json['username']
    followings_count.innerText = response_json['followings_count']
    profile_image.src = `${backend_base_url}` + response_json['profile_image']

    response_json['tags'].forEach(tag => {
        const user_tag = document.createElement("p")
        user_tag.innerText = tag
        tags.appendChild(user_tag)

    })

    //게시글 가져오기
    feeds = await getFeeds()
    console.log(feeds)

    const feed_list = document.getElementById("cards-box")

    feeds.forEach(feed => {
        // feed 가지고오기
        const newCol = document.createElement("div")
        newCol.setAttribute("class", "col")
        // feed 상세페이지 아이디 가져가기
        newCol.setAttribute("onclick", `feeddetail(${feed.id})`)
        const newCard = document.createElement("div")
        newCard.setAttribute("class", "card")
        newCard.setAttribute("id", feed.id)
        newCol.appendChild(newCard)

        const feedImage = document.createElement("img")
        feedImage.setAttribute("class", "card-img-top")

        //섬네일
        if (feed.video_key) {
            feedImage.setAttribute("src", "https://img.youtube.com/vi/" + feed['video_key'] + "/mqdefault.jpg")
        } else {
            feedImage.setAttribute("src", `${backend_base_url}${feed.image}`)
        }
        newCard.appendChild(feedImage)

        const newCardBody = document.createElement("div")
        newCardBody.setAttribute("class", "card-body")
        newCard.appendChild(newCardBody)

        const newCardTitle = document.createElement("h5")
        newCardTitle.setAttribute("class", "card-title")
        newCardTitle.innerText = feed.title
        newCardBody.appendChild(newCardTitle)

        const newCardName = document.createElement("p")
        newCardName.setAttribute("class", "card-text")
        newCardName.innerText = feed.user
        newCardBody.appendChild(newCardName)

        feed['tag'].forEach(tag => {
            const newCardTag = document.createElement("button")
            newCardTag.setAttribute("class", "card-tags")

            newCardTag.innerText = tag.name
            newCardBody.appendChild(newCardTag)

        })

        feed_list.appendChild(newCol)
    })

}

//내가 좋아요한 게시글 모아보기 추가하기