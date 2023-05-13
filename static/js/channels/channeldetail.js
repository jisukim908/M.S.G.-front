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

//게시글 수정하기 함수
async function FeedUpdate(user_id, feed_id) {
    const response = await fetch(`${backend_base_url}/channel/admin/${user_id}/${feed_id}`, {
        method: 'PUT'
    })
}

//게시글 삭제하기 함수


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

    const response_feed = await getFeed(user_id, feed_id)
    console.log(response_feed)

    //feed 가져오기
    response_feed.forEach(feed => {
        const feedTitle = document.getElementById("feed-title")
        const feedImage = document.getElementById("feed-image")
        const feedVideo = document.getElementById("feed-video")
        const feedContent = document.getElementById("feed-desc")
        const feedUser = document.getElementById("feed-user")
        const feedTag = document.getElementById("feed-tags")
        const feedCreateDate = document.getElementById("feed-createdate")
        const feedUpdateDate = document.getElementById("feed-updatedate")
        const feedLike = document.getElementById("likes")

        feedTitle.innerText = feed['title']
        feedUser.innerText = feed['user']

        if (feed.video_key) {
            // 비디오 주소 가져오기
            feedVideo.src = 'https://www.youtube.com/embed/' + feed['video_key']
            feedImage.src = `${backend_base_url}` + feed['image']
        } else {
            feedImage.src = `${backend_base_url}` + feed['image']
        }
        feedContent.innerText = feed['context']
        feed['tag'].forEach(tag => {
            feedTag.innerText = tag.name
        })
        feedCreateDate.innerText = feed['created_date'].slice(0, 10)
        feedUpdateDate.innerText = feed['updated_date'].slice(0, 10)
        feedLike.innerText = feed['likes_count']
    })


    //조회수 기능 추가하기
}
