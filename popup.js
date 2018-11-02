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
            const songContainer = document.getElementById("song");
            let artistsHtml = "";
            result.hits.forEach(item => {
                const title = item.result.title;
                const artistName = item.result.primary_artist.name;
                const imgSrc = item.result.primary_artist.image_url;
                const songId = item.result.id;
                console.log(songId);
                // language=HTML
                artistsHtml += `
                    <div class="songItem" data-id="${songId}">
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
            Array.prototype.forEach.call(lyricsContainer.getElementsByClassName("songItem"), item => {
                item.addEventListener("click", event => {
                    const id = event.currentTarget.getAttribute("data-id");
                    console.log(id);
                    request(`songs/${id}`).then(result => {
                        // lyricsContainer.innerHTML = "";
                        console.log(eval(result.song.embed_content));
                        // songContainer.innerHTML = result.song.embed_content;
                        // console.log(result);
                    });
                });
            });
        });
    });
});

function request(path) {
    let url = `https://api.genius.com/${path}`;
    let existQueryParams = false;
    for (let i = 0; i < path.length; i++) {
        if (path[i] === "?") existQueryParams = true;
    }
    if(existQueryParams) {
        url += `&access_token=${accessToken}`;
    } else {
        url += `?access_token=${accessToken}`;
    }

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