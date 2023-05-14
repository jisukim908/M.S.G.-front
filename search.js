const bass_url = "http://127.0.0.1:8000";
const cardsBox = document.getElementById("feed_card");

async function searchFilter() {
    const input_value = document.getElementById("feed-search").value;

    const response = await fetch(`${bass_url}/search/?search=${input_value}`, {
        method: 'GET'
    });

    const response_json = await response.json();
    console.log(response_json);

    cardsBox.innerHTML = '';

    response_json.forEach((result) => {
        const cardLink = document.createElement("a");
        cardLink.setAttribute("href", `../../feed_detail.html?id=${result.id}`);
        cardLink.setAttribute("class", "card-link");

        const newCard = document.createElement("div");
        newCard.setAttribute("class", "card");
        newCard.setAttribute("id", result.id);

        const image = document.createElement("img");
        image.setAttribute("class", "card-img-top");

        if (result.image) {
            image.setAttribute("src", result.image);
        } else {
            image.setAttribute("src", "/static/img/default_image.jpg");
        }

        const cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");

        const title = document.createElement("h5");
        title.setAttribute("class", "card-title");
        title.textContent = result.title;

        const context = document.createElement("p");
        context.setAttribute("class", "card-text");
        context.textContent = result.context;

        cardBody.appendChild(title);
        cardBody.appendChild(context);

        newCard.appendChild(image);
        newCard.appendChild(cardBody);

        cardLink.appendChild(newCard);
        cardsBox.appendChild(cardLink);
    });
}
