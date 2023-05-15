const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5501"

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

// 게시글 가져오기 함수
async function getFeed(user_id, feed_id) {
    const response = await fetch(`${backend_base_url}/channel/admin/${user_id}/${feed_id}`)

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert("권한이 없습니다.")
    }
}

//수정페이지로 가기
function feedupdate(feed_id) {
    window.location.href = `${frontend_base_url}/channeledit.html?feed_id=${feed_id}`
}

//삭제기능

//게시글 삭제하기 함수
async function FeedDelete(feed_id) {
    user = localStorage.getItem("payload")
    user_id = user.slice(-2)[0]

    const response = await fetch(`${backend_base_url}/channel/admin/${user_id}/${feed_id}`, {
        header: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'DELETE',
    })

    console.log(response)
    location.href = "home.html";
}

window.onload = async function channelDetail() {
    console.log("로딩완료")
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

    //게시글 상세보기
    const urlParams = new URLSearchParams(window.location.search);
    const feed_id = urlParams.get('feed_id');
    console.log(feed_id)

    const response_feed = await getFeed(user_id, feed_id)
    console.log(response_feed)

    const feed_edit = document.getElementById("edit")
    const feed_list = document.getElementById("cards-box")

    //feed 가져오기
    response_feed.forEach(feed => {

        //feed_id 가지고 수정페이지 이동하기
        const newButton = document.createElement("button")
        newButton.setAttribute("onclick", `feedupdate(${feed['id']})`)
        newButton.innerHTML = "수정하기"
        feed_edit.appendChild(newButton)
        const newDeleteButton = document.createElement("button")
        newDeleteButton.setAttribute("onclick", `FeedDelete(${feed['id']})`)
        newDeleteButton.innerHTML = "삭제하기"
        feed_edit.appendChild(newDeleteButton)

        //feed 가져오기
        const newTitle = document.createElement("h2")
        newTitle.setAttribute("class", "col")
        newTitle.setAttribute("id", "feed-title")
        newTitle.innerText = feed['title']

        const newUser = document.createElement("h6")
        newUser.setAttribute("class", "col")
        newUser.setAttribute("id", "feed-user")
        newUser.setAttribute("style", "text-align:right;")
        newUser.innerText = feed['user']

        const newMedia = document.createElement("div")
        newMedia.setAttribute("class", "row row-cols-1 row-cols-md-2")
        newMedia.setAttribute("id", "feed")

        const newImage = document.createElement("img")
        newImage.setAttribute("class", "col")
        newImage.setAttribute("id", "feed-image")
        newImage.setAttribute("src", `${backend_base_url}${feed['image']}`)

        const newVideo = document.createElement("iframe")
        newVideo.setAttribute("class", "card")
        newVideo.setAttribute("id", "feed-video")

        if (feed['video_key']) {
            newVideo.setAttribute("src", 'https://www.youtube.com/embed/' + `${feed['video_key']}`)
        }

        newMedia.appendChild(newImage)
        newMedia.appendChild(newVideo)

        const newContent = document.createElement("div")
        newContent.setAttribute("class", "row row-cols-1")
        newContent.setAttribute("id", "feed")

        const newTagbox = document.createElement("div")
        newTagbox.setAttribute("id", "feed-tags")

        feed['tag'].forEach(tag => {
            const newTag = document.createElement("div")
            newTag.setAttribute("class", "card")
            newTag.setAttribute("id", "feed-tag")
            newTag.innerText = tag.name
            newTagbox.appendChild(newTag)
        })

        newContent.appendChild(newTagbox)

        const newDesc = document.createElement("div")
        newDesc.setAttribute("class", "card")
        newDesc.setAttribute("id", "feed-desc")
        if (feed['context']) {
            newDesc.innerText = feed['context']
        } else {
            newDesc.innerText = "상세설명이 없습니다."
        }
        newContent.appendChild(newDesc)

        const newDate = document.createElement("div")
        newDate.setAttribute("class", "card")

        const newCreatebox = document.createElement("div")
        newCreatebox.setAttribute("class", "col")
        newCreatebox.setAttribute("id", "date")
        newCreatebox.innerHTML = "생성날짜:"

        const newUpdatebox = document.createElement("div")
        newUpdatebox.setAttribute("class", "col")
        newUpdatebox.setAttribute("id", "date")
        newUpdatebox.innerHTML = "수정날짜:"

        const newCreate = document.createElement("div")
        newCreate.setAttribute("class", "col")
        newCreate.setAttribute("id", "feed-createdate")
        newCreate.innerText = feed['created_date'].slice(0, 10)

        const newUpdate = document.createElement("div")
        newUpdate.setAttribute("class", "col")
        newUpdate.setAttribute("id", "feed-updatedate")
        newUpdate.innerText = feed['updated_date'].slice(0, 10)

        newCreatebox.appendChild(newCreate)
        newUpdatebox.appendChild(newUpdate)
        newDate.appendChild(newCreatebox)
        newDate.appendChild(newUpdatebox)
        newContent.appendChild(newDate)

        const newInfo = document.createElement("div")
        newInfo.setAttribute("class", "row row-cols-1 row-cols-md-2")
        newInfo.setAttribute("id", "feed")

        const newHitbox = document.createElement("div")
        newHitbox.innerHTML = "조회수:"

        const newLikebox = document.createElement("div")
        newLikebox.innerHTML = "좋아요수:"

        const newHit = document.createElement("div")
        newHit.setAttribute("id", "hitcount")
        newHit.setAttribute("class", "card")
        newHit.innerText = feed['hits']

        const newLike = document.createElement("div")
        newLike.setAttribute("id", "likes")
        newLike.setAttribute("class", "card")
        newLike.innerText = feed['likes_count']

        newHitbox.appendChild(newHit)
        newLikebox.appendChild(newLike)

        newInfo.appendChild(newHitbox)
        newInfo.appendChild(newLikebox)

        feed_list.appendChild(newTitle)
        feed_list.appendChild(newUser)
        feed_list.appendChild(newMedia)
        feed_list.appendChild(newContent)
        feed_list.appendChild(newInfo)
    })

}