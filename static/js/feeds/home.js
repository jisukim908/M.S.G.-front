const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5501"

async function getFeeds() {
    const response = await fetch(`${backend_base_url}` + '/')
    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("불러오는데 실패했습니다.")
    }
}


window.onload = async function getFeedList(){
    feeds = await getFeeds()
    console.log(feeds)

    const feedList = document.getElementById("feed_card")
    console.log(feedList)

    feeds.forEach(feed => {
        // feed 가지고오기
        const newCol = document.createElement("a")
        newCol.setAttribute("class", "col-md-3 col-sm-6 col-lg-2")
        newCol.setAttribute("href", `../../feed_detail.html?id=${feed.id}`)
        const newCard = document.createElement("a")
        newCard.setAttribute("class", "card")
        newCard.setAttribute("id", feed.id)
        newCol.appendChild(newCard)

        const feedImage = document.createElement("img")
        feedImage.setAttribute("class", "card-img-top")
        
        //video_key 확인
        video_in = Object.keys(feed).includes('video_key')
        console.log(video_in) //true

        
        if(video_in === true){
            //video key가 있으면 썸네일 가져와서 넣어주기
            feedImage.setAttribute("src", "https://img.youtube.com/vi/" + feed['video_key'] + "/mqdefault.jpg")
        } else if(feed.image) {
            //image가 있으면 넣어주기
            feedImage.setAttribute("src", `${backend_base_url}${feed.image}`)
        } else {
            //image가 없으면 defaultimage 넣어주기
            feedImage.setAttribute("src", "/static/img/default_image.jpg")
        }
        
        newCard.appendChild(feedImage)

        const newCardBody = document.createElement("div")
        newCardBody.setAttribute("class", "card-body")
        newCard.appendChild(newCardBody)

        const newCardTitle = document.createElement("h6")
        newCardTitle.setAttribute("class", "card-title")
        newCardTitle.innerText = feed.title
        newCardBody.appendChild(newCardTitle)

        const newCardName = document.createElement("p")
        newCardName.setAttribute("class", "card-text")
        newCardName.innerText = feed.user
        newCardBody.appendChild(newCardName)


        feedList.appendChild(newCol)

    })
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
