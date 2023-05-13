

// 해당 게시글 댓글 가져오기
async function getComments(feedId) {
    const token = localStorage.getItem('access');
    const response = await fetch(`http://127.0.0.1:8000/${feedId}/comments/`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const response_json = await response.json();
    console.log(response_json);
    return response_json;
}

// 댓글 모아보기
async function getAllComments() {
    const token = localStorage.getItem('access');
    const response = await fetch('http://127.0.0.1:8000/comments/', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const response_json = await response.json();
    console.log(response_json);
    return response_json;
}


// 댓글 생성
async function createComment(text) {
    const token = localStorage.getItem('access');
    const data = {
        feed: feedId,
        text: text,
    };

    const response = await fetch('http://127.0.0.1:8000/comments/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const response_json = await response.json();
    console.log(response_json);
    return response_json;
}


// 댓글 생성
async function createComment(feedId, text) {
    const token = localStorage.getItem('access');
    const data = {
        feed: feedId,
        text: text,
    };

    const response = await fetch('http://127.0.0.1:8000/comments/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const response_json = await response.json();
    console.log(response_json);
    return response_json;
}


// 댓글 수정
async function updateComment(commentId, content) {
    const token = localStorage.getItem('access');
    const formData = new FormData();
    formData.append('content', content);

    const response = await fetch(`http://127.0.0.1:8000/comments/${commentId}/`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const response_json = await response.json();
    console.log(response_json);
}

// 댓글 삭제
async function deleteComment(commentId) {
    const token = localStorage.getItem('access');
    const response = await fetch(`http://127.0.0.1:8000/comments/${commentId}/`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const response_json = await response.json();
    console.log(response_json);
}

// 댓글 좋아요
async function likeComment(commentId) {
    const token = localStorage.getItem('access');
    const response = await fetch(`http://127.0.0.1:8000/comments/${commentId}/like/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const response_json = await response.json();
    console.log(response_json);
}

// 댓글 싫어요
async function dislikeComment(commentId) {
    const token = localStorage.getItem('access');
    const response = await fetch(`http://127.0.0.1:8000/comments/${commentId}/dislike/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const response_json = await response.json();
    console.log(response_json);
}
