const bass_url = "http://127.0.0.1:8000";
const cardsBox = document.getElementById("cards-box");

async function searchFilter() {
    const input_value = document.getElementById("feed-search").value;

    const response = await fetch(`${bass_url}/search/?search=${input_value}`, {
        method: 'GET'
    });

    const response_json = await response.json();
    console.log(response_json);

    cardsBox.innerHTML = '';

    response_json.forEach((result) => {
        const cardItem = document.createElement("div");
        cardItem.classList.add("col-md-4", "col-6");
        cardItem.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${result.title}</h5>
                    <p class="card-text">${result.context}</p>
                </div>
            </div>
        `;
        cardsBox.appendChild(cardItem);
    })
}
