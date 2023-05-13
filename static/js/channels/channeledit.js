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

    //게시글 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const feed_id = urlParams.get('feed_id');
    console.log(feed_id)

    const response_feed = await getFeed(user_id, feed_id)
    console.log(response_feed)

    feed_list = document.getElementById("feedupdate")
    button_list = document.getElementById("updatebutton")

    //feed 가져오기
    response_feed.forEach(feed => {

        //feed 가져오기
        const newTitle = document.createElement("h2")
        newTitle.innerHTML = "Title:"

        const newTitlename = document.createElement("input")
        newTitlename.setAttribute("class", "title")
        newTitlename.setAttribute("id", "feed-title")
        newTitlename.setAttribute("type", "text")
        newTitlename.setAttribute("placeholder", feed['title'])

        const newUser = document.createElement("h6")
        newUser.setAttribute("class", "col")
        newUser.setAttribute("id", "feed-user")
        newUser.setAttribute("style", "text-align:right;")
        newUser.innerHTML = "글쓴이:"
        newUser.innerText = feed['user']

        const originMedianame = document.createElement("h5")
        originMedianame.setAttribute("class", "card")
        originMedianame.innerHTML = "원본"

        const originMedia = document.createElement("div")
        originMedia.setAttribute("class", "row row-cols-1 row-cols-md-2")
        originMedia.setAttribute("id", "feed")

        const originImage = document.createElement("img")
        originImage.setAttribute("class", "col")
        originImage.setAttribute("id", "feed-image")
        originImage.setAttribute("src", `${backend_base_url}${feed['image']}`)


        const originVideo = document.createElement("iframe")
        originVideo.setAttribute("class", "col")
        originVideo.setAttribute("id", "feed-video")

        if (feed['video_key']) {
            originVideo.setAttribute("src", 'https://www.youtube.com/embed/' + `${feed['video_key']}`)
        }

        originMedia.appendChild(originImage)
        originMedia.appendChild(originVideo)

        const newMedianame = document.createElement("h5")
        newMedianame.setAttribute("class", "card")
        newMedianame.innerHTML = "아래에 업로드할 파일과 동영상 key를 넣어주세요."

        const newMedia = document.createElement("div")
        newMedia.setAttribute("class", "row row-cols-1 row-cols-md-2")
        newMedia.setAttribute("id", "feed")

        const newImage = document.createElement("input")
        newImage.setAttribute("type", "file")
        newImage.setAttribute("onchange", "preview(this)")

        const newVideo = document.createElement("input")
        newVideo.setAttribute("type", "text")
        newVideo.setAttribute("placeholder", feed['video_key'])


        newMedia.appendChild(newImage)
        newMedia.appendChild(newVideo)

        const newContent = document.createElement("div")
        newContent.setAttribute("class", "row row-cols-1")
        newContent.setAttribute("id", "feed")

        const newDescname = document.createElement("div")
        newDescname.setAttribute("class", "card")
        newDescname.innerHTML = "상세설명을 적어주세요."
        newContent.appendChild(newDescname)

        const newDesc = document.createElement("input")
        newDesc.setAttribute("class", "card")
        newDesc.setAttribute("id", "feed-desc")
        newDesc.setAttribute("placeholder", feed['context'])
        newContent.appendChild(newDesc)

        const updateButton = document.createElement("button")
        updateButton.setAttribute("type", "button")
        updateButton.setAttribute("class", "feedupdate")
        updateButton.setAttribute("style", "margin-right:10px;")
        updateButton.setAttribute("id", feed_id)
        updateButton.setAttribute("onclick", "FeedUpdate(this.id)")
        updateButton.innerHTML = "수정완료"

        const backButton = document.createElement("button")
        backButton.setAttribute("onclick", "history.back()")
        backButton.innerHTML = "뒤로가기"

        feed_list.appendChild(newTitle)
        feed_list.appendChild(newTitlename)
        feed_list.appendChild(newUser)
        feed_list.appendChild(originMedianame)
        feed_list.appendChild(originMedia)
        feed_list.appendChild(newMedianame)
        feed_list.appendChild(newMedia)
        feed_list.appendChild(newContent)

        button_list.appendChild(updateButton)
        button_list.appendChild(backButton)
    })


    //tag 가져오기
    const response_tag = await fetch('http://127.0.0.1:8000/users/tag/', {
        method: 'GET'
    });

    response_json_tag = await response_tag.json()
    const manytag = document.getElementById("feed-tags")
    response_json_tag.forEach(tag => {
        const newInput = document.createElement('input')
        newInput.setAttribute("type", "checkbox")
        newInput.setAttribute("name", "tag")
        newInput.setAttribute("value", tag['id'])
        newInput.setAttribute("id", tag['name'])
        const newTag = document.createElement('label')
        newTag.setAttribute("class", "tag-input")
        newTag.setAttribute("style", "margin-right:10px;")
        newTag.innerText = tag['name']
        manytag.appendChild(newTag).appendChild(newInput)
    })

    response_feed['tag'].forEach(e => {
        document.getElementById(e).checked = true;
    })

}


async function FeedUpdate(feed_id) {
    user = localStorage.getItem("payload")
    user_id = user.slice(-2)[0]
    console.log(feed_id)
    //누르는 순간 생겼다가 사라져요..ㅜㅜ
    //왜 이럴까요..ㅜㅜ

    const response_feed_update = await fetch(`${backend_base_url}/channel/admin/${user_id}/${feed_id}` + '/', {
        method: 'GET'
    })
    response_feed_update_json = await response_feed_update.json()

    const query = 'input[name="tag"]:checked';
    const selectedEls = document.querySelectorAll(query)
    const tag = []
    selectedEls.forEach((el) => {
        tag.push(parseInt(el.value))
    })

    const title = response_feed_update_json['title']
    const context = response_feed_update_json['context']
    const video_key = response_feed_update_json['video_key']

    const response_edit_feed = await fetch(`${backend_base_url}/channel/admin/${user_id}/${feed_id}` + '/', {
        header: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({
            "title": title,
            "video_key": video_key,
            "context": context,
            "tag": tag,
        })
    })

    console.log(response_edit_feed)
    location.href = "channeldetail.html";

}


//사진 미리보기
function preview(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("feed-image").src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
    else {
        document.getElementById("feed-image").src = "";
    }
}

//게시글 삭제하기 함수
async function FeedDelete() {
    user = localStorage.getItem("payload")
    user_id = user.slice(-2)[0]

    const response = await fetch(`${backend_base_url}/channel/admin/${user_id}/${feedid}`, {
        header: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'DELETE',
    })

    console.log(response)
    location.href = "channel.html";
}