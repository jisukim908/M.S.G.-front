const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5501"

console.log("loading")

window.onload = async function getFeedDetail(){
    // onload 시 url 쿼리 파라미터를 가져온다
    const urlParams = new URL(location.href).searchParams;
    const feed_id = urlParams.get('id');
    console.log(feed_id)

    const response = await fetch(`${backend_base_url}`+ '/' + feed_id + '/', {
        method : 'GET'
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
    const feedImage = document.getElementById('image')
    
    title.innerText = response_json['title']
    context.innerText = response_json['context']
    createdDate.innerText = new Date().toString(response_json['created_date']) + " 작성"
    updatedDate.innerText = new Date().toString(response_json['updated_date']) + " 수정"
    console.log("여기?1")
    
    //comment가 null이면 0 반환, else면 숫자값 반환
    if (commentCount === null){
        const obj = commentCount || {'comments_count':0}
        console.log(obj)
        console.log("여기?2")
        commentCount.innerText = obj['comments_count'] 
        console.log("여기?3")
    } else {
        commentCount.innerText = response_json['comments_count']
    }
    likeCount.innerText = response_json['like_count']
    hitCount.innerText = response_json['hit_count']

    
    // user 정보, channel정보 받아와야함(백엔드 구현)
    const username = document.getElementById('user')
    username.innerText = response_json['username']

    //key값에 video_key가 들어왔는지 확인
    video_in = Object.keys(response_json).includes('video_key')
    
    if(video_in === true){
        //video 보기, video-box 위치에 입력
        const feedVideo = document.createElement('video')
        // Use local file
        // video.src = 'video.mp4';

        // Use remote file
        feedVideo = ("src", 'https://www.youtube.com/embed/' + feed['video_key'])
        feedVideo.controls = true;
        feedVideo.muted = false;
        feedVideo.height = 240; // in px
        feedVideo.width = 320; // in px
        
        const videoBox = document.getElementById('video-box');
        videoBox.appendChild(feedVideo);
        
    } else if(image) {
        //image가 있으면 넣어주기
        feedImage.setAttribute("src", `${backend_base_url}${feed.image}`)
        title.feedImage = response_json['image']
    } else {
        //image가 없으면 defaultimage 넣어주기?
        feedImage.setAttribute("src", "/static/img/default_image.jpg")
    }
    
}







    

