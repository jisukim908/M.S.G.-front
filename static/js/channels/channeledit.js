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

    //feed 가져오기
    response_feed.forEach(feed => {

        //feed 가져오기
        const newTitle = document.createElement("h2")
        newTitle.innerHTML = "Title:"

        const newTitlename = document.createElement("input")
        newTitlename.setAttribute("class", "title")
        newTitlename.setAttribute("id", "feed-title")
        newTitlename.setAttribute("type", "text")

        const newUser = document.createElement("h6")
        newUser.setAttribute("class", "col")
        newUser.setAttribute("id", "feed-user")
        newUser.setAttribute("style", "text-align:right;")
        newUser.innerHTML = "글쓴이:"
        newUser.innerText = feed['user']

        const originMedia = document.createElement("h5")
        originMedia.setAttribute("class", "card")
        originMedia.innerHTML = "원본"

        const newMedia = document.createElement("div")
        newMedia.setAttribute("class", "row row-cols-1 row-cols-md-2")
        newMedia.setAttribute("id", "feed")

        const newImage = document.createElement("img")
        newImage.setAttribute("class", "col")
        newImage.setAttribute("id", "feed-image")
        newImage.setAttribute("src", `${backend_base_url}${feed['image']}`)


        const newVideo = document.createElement("iframe")
        newVideo.setAttribute("class", "col")
        newVideo.setAttribute("id", "feed-video")

        if (feed['video_key']) {
            newVideo.setAttribute("src", 'https://www.youtube.com/embed/' + `${feed['video_key']}`)
        }

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
        newContent.appendChild(newDesc)


        feed_list.appendChild(newTitle)
        feed_list.appendChild(newTitlename)
        feed_list.appendChild(newUser)
        feed_list.appendChild(originMedia)
        feed_list.appendChild(newMedia)
        feed_list.appendChild(newContent)
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


    const title = response_feed_json['title']
    const context = response_feed_json['context']
    const video_key = response_feed_json['video_key']

    const response_edit_feed = await fetch(`${backend_base_url}/channel/admin/${user_id}/${e}` + '/', {
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

    response__edit_feed_json = await response_edit_feed.json()
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