const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5501"

window.onload = async function getFeedDetail(){
    // 태그 띄우기
    const response_tag = await fetch(`${backend_base_url}`+ '/users/tag/', {
        method : 'GET'
    })
    response_tags = await response_tag.json()

    const tag_list = document.getElementById('tag_list')
    response_tags.forEach(tag => {
        const tag_li = document.createElement('li')
        tag_li.setAttribute("class", "category-item")
        const tag_a = document.createElement('a')
        tag_a.setAttribute("class", "nav-link")
        tag_a.setAttribute("type", "button")
        tag_a.setAttribute("id", tag['name'])
        tag_a.setAttribute("onclick", "handleSearch(this.id)")
        tag_a.innerText = tag['name']
        tag_list.appendChild(tag_li).appendChild(tag_a)
    })

    // http://127.0.0.1:5501/feed_detail.html?id=4

    const urlParams = new URL(location.href).searchParams;
    const feed_id = urlParams.get('id');

    const response = await fetch(`${backend_base_url}` + '/' + feed_id + '/', {
        method: 'GET'
    })
    response_json = await response.json()
    console.log(response_json)

    // 본문 내용
    const title = document.getElementById('title')
    const context = document.getElementById('context')
    const createdDate = document.getElementById('created_date')
    const updatedDate = document.getElementById('updated_date')
    const commentCount = document.getElementById('comments_count')
    const likeCount = document.getElementById('like_count')
    const hitCount = document.getElementById('hit_count')
    
    title.innerText = response_json['title']
    context.innerText = response_json['context']
    createdDate.innerText = new Date().toDateString(response_json['created_date']) + " 작성"
    updatedDate.innerText = new Date().toDateString(response_json['updated_date']) + " 수정"
    likeCount.innerText = String(response_json['likes_count'])
    hitCount.innerText = String(response_json['hits'])

    // user 정보, channel정보 받아오기
    const response_user = await fetch(`${backend_base_url}` + '/users/profile/'+ response_json['user_id'] + '/', {
        method : 'GET'
    })
    author = await response_user.json()

    const userProfileImage = document.getElementById('profile_image')
    const username = document.getElementById('username')
    const bio = document.getElementById('bio')
    const joinedAt = document.getElementById('joined_at')
    const followers = document.getElementById('followers')
    const tags = document.getElementById('tags')

    userProfileImage.setAttribute('class', 'profile-image')
    userProfileImage.src = `${backend_base_url}` + response_json['profile_image']
    username.innerText = author['username']
    bio.innerText = author['bio']
    joinedAt.innerText = new Date().toDateString(author['joined_at'])
    followers.innerText = author['followers'].length
    if(author['tags']){
        author['tags'].forEach(tag => {
            const userTag = document.createElement("p")
            userTag.setAttribute('class', 'tag-card')

            userTag.innerText = tag
            tags.appendChild(userTag)
        })
    } else {
        message = "아직 관심사가 없습니다"
    }

    // 작성자 채널 링크
    const authorChannel = document.getElementById('author_channel')
    authorChannel.setAttribute('onclick', `${backend_base_url}/channel/` + author['id'] + '/info/')

    //key값에 video_key가 들어왔는지 확인
    if(response_json['video_key'] !== null){
        //video 보기, video-box 위치에 입력
        const videoBox = document.getElementById('video-box');
        const feedVideo = document.createElement('iframe')
        feedVideo.setAttribute('class', 'videocard')

        // Use remote file
        feedVideo.setAttribute("src", 'https://www.youtube.com/embed/' + `${response_json['video_key']}`)

        videoBox.appendChild(feedVideo);
        

        //image, default_image인지 확인하여 출력여부 결정
        if (response_json['image'] === "/media/static/default_image.jpg"){
        } else {
            const imageBox = document.getElementById('image-box');
            const feedImage = document.createElement("img")
            feedImage.setAttribute('class', 'imagecard')
            feedImage.setAttribute("src", `${backend_base_url}` + `${response_json['image']}`)
            imageBox.appendChild(feedImage)
        }
    } else {
        if (response_json['image'] !== null) {
            //image가 있으면 넣어주기
            const imageBox = document.getElementById('image-box');
            const feedImage = document.createElement("img")
            feedImage.setAttribute('class', 'imagecard')
            feedImage.setAttribute("src", `${backend_base_url}` + `${response_json['image']}`)
            imageBox.appendChild(feedImage)
        } else {
            //image가 없으면 defaultimage 넣어주기
            feedImage.setAttribute("src", "/static/img/default_image.jpg")
        }

    }



    // 댓글 불러오기
    commentCount.innerText = response_json['comments_count']
    const response_comment = await fetch(`${backend_base_url}/comments/${feed_id}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
        },
        method: "GET"
    })
    const response_json_comment = await response_comment.json()

    const feed_comments = document.getElementById("feed_comments")
    response_json_comment.forEach(comment => {
        const comment_user = document.createElement('p')
        comment_user.innerText = comment['user']
        feed_comments.appendChild(comment_user)

        const comment_text = document.createElement('p')
        comment_text.innerText = comment['text']
        feed_comments.appendChild(comment_text)
    })
}

async function inputComment() {
    const urlFeed = new URL(location.href).searchParams;
    const feedId = urlFeed.get('id')

    const comment_text = document.getElementById('comment-text').value
    const response_input = await fetch(`${backend_base_url}/comments/${feedId}/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify({
            "text": comment_text,
        })
    })
    location.reload()
}


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


async function handleLike() {
    console.log("버튼 눌림 / 좋아요")

    const urlParams = new URL(location.href).searchParams;
    const feed_id = urlParams.get('id');

    const response = await fetch(`${backend_base_url}/${feed_id}/likes/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'POST',
    })
    location.reload()
}