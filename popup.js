const accessToken = "";

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementsByTagName("input")[0];
    input.addEventListener("keydown", function (e) {
        if (e.code !== "Enter") {
            return;
        }
        const q = input.value;
        request(`search?q=${encodeURIComponent(q)}`).then(result => {
            const lyricsContainer = document.getElementById("lyrics");
            let artistsHtml = "";
            lyricsContainer.innerHTML = "";
            result.hits.forEach(item => {
                const title = item.result.title;
                const artistName = item.result.primary_artist.name;
                const imgSrc = item.result.primary_artist.image_url;
                // language=HTML
                artistsHtml += `
                    <div class="songItem">
                        <div class="artistImg">
                            <img src="${imgSrc}" alt="">
                        </div>
                        <div class="content">
                            <div class="songName">${title}</div>
                            <div class="artistName">${artistName}</div>
                        </div>
                    </div>
                `;
            });
            lyricsContainer.innerHTML = artistsHtml;
            console.log(result);
        })
    });
});

function request(path) {
    const url = `https://api.genius.com/${path}&access_token=${accessToken}`;

    return fetch(url).then(body => body.json()).then(result => {
        if (result.error)
            throw new Error(`${result.error}: ${result.error_description}`);
        if (result.meta.status !== 200)
            throw new Error(`${result.meta.status}: ${result.meta.message}`);
        return result.response;
    }).catch(error => {
        console.log(error);
    });
}