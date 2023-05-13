window.onload = async function loadProfile() {
    console.log("로딩 완료")

    //태그 띄우기
    const response_tag = await fetch('http://127.0.0.1:8000/users/tag/', {
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

    //게시글 띄우기

}

async function handleSearch(tagId) {
    console.log(tagId)

    const response_search_tag = await fetch('http://127.0.0.1:8000/search/?search='+tagId, {
        headers:{
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type':'application/json',
        },
        method:'GET',
    })
    response_json_search = await response_search_tag.json()
    console.log(response_json_search)
    
    const feed_card = document.getElementById("feed_card")
    response_json_search.forEach((e) => {
        console.log(e['video_key'])
        const feed_div = document.createElement('div')
        const feed_img = document.createElement('img')
        feed_img.setAttribute("src", "https://img.youtube.com/vi/" + e['video_key'] + "/mqdefault.jpg")
        feed_card.appendChild(feed_div).appendChild(feed_img)
    })
}