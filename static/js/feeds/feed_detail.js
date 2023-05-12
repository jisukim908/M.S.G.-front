console.log("로딩 완료")

async function loadHome(){
    const response = await fetch('http://127.0.0.1:8000/' + author_id + "/" + feed_id + "/", {
        method:'GET'
    })

    console.log(response)



    

}
