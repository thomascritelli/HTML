var access_token = "BQAoir1xeSAl3BQ3SiO7LE2X-zipOUvfTkIT9ybmgHbCPTwYgn0OMWOvhsUh8X-WaBEzIhqQcPd0omSrWp94TKTi67Zffk_RafwhRgOBi136p1sN0na_hv1hLNN2N4QQhpM6yW3hqNYZ9975OCN6p4z2QbDwHO05S-P48oSCBjxyRAtFNL6nO6SMhGraGI0NJma7xdnWRw";
var recentlyPlayedApiUrl = 'https://api.spotify.com/v1/me/player/recently-played';
async function getJSON(apiLink){
    try{
        const response = await fetch(apiLink, {
            headers: {
                'authorization': 'Bearer '+ access_token
            }
        });
        if (!response.ok){
            throw new Error(`${response.status}`);
        }
        const jsonData = await response.json();
        console.log(jsonData);
        return jsonData;
    } catch (error) {
        console.error('Errore durante la richiesta:', error);
        return [];
    }

}
function msToTime(msDurata) {
    var millisecondi = (msDurata%1000)/100
        , secondi = Math.round((msDurata/1000)%60)
        , minuti = Math.round((msDurata/(1000*60))%60)
        , ore = (msDurata/(1000*60*60))%24;

    ore = (ore < 10) ? "0" + ore : ore;
    minuti = (minuti < 10) ? "0" + minuti : minuti;
    secondi = (secondi < 10) ? "0" + secondi : secondi;

    return minuti + ":" + secondi;
}

async function playSong(songId, songTitle) {
    const playerDiv = document.getElementById('spotifyPlayer');

    const playerHtml = `
        <div>
            <p>Stai ascoltando: ${songTitle}</p>
            <iframe src="https://open.spotify.com/embed/track/${songId}"
                    width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media">
            </iframe>
        </div>
    `;
    playerDiv.innerHTML = playerHtml;
}
async function renderTable(richiesta){
    try {
        var songs = await getJSON(richiesta[0]);
        let tbody = "";
        if (richiesta[1] == "recentlyPlayed"){
            let tbody = "";
            document.getElementById("recentlyPlayed").hidden = false;
            document.getElementById("album").hidden = true;
            songs = songs.items;
            for (let i = 0; i < songs.length; i++){
                tbody += `<tr>
                            <td><a href = "https://open.spotify.com/intl-it/artist/${songs[i].track.artists[0].id}">${songs[i].track.artists[0].name}</td>
                            <td><a href = "https://open.spotify.com/intl-it/track/3ZOEytgrvLwQaqXreDs2Jx?si=${songs[i].track.id}">${songs[i].track.name}</td>
                            <td><a onclick="renderTable(['${songs[i].track.album.href}','albumSongs'])">${songs[i].track.album.name}</td>
                            <td><img src='${songs[i].track.album.images[0].url}' alt= 'ciao' width=50></td>
                            <td><button onclick="playSong('${songs[i].track.id}', '${songs[i].track.name}')">Play</button></td></tr></tr>`;
            }
            const tableRow = document.getElementById('recently');
            tableRow.innerHTML += tbody;
        } else{
            let tbody = "";
            var img = songs.images[0].url;
            var title = songs.name;
            songs = songs.tracks.items;
            document.getElementById("recentlyPlayed").hidden = true;
            document.getElementById("album").hidden = false;
            var albumSong = document.getElementById("albumInfo");
            albumSong.innerHTML = `<img src="${img}" alt = "copertina album" width=200> <h3>${title}</h3`;

            for (let i = 0; i < songs.length; i++){
                tbody += `<tr><td><button onclick="playSong('${songs[i].id}', '${songs[i].name}')">Play</button></td>
                            <td>${songs[i].name}</td>
                            <td>${msToTime(songs[i].duration_ms)}</td></tr>`;
                            
            }
            const tableRow = document.getElementById("albumSongs");
            tableRow.innerHTML += tbody;
        }
    } catch (error) {
        console.error('Errore durante la visualizzazione dei dati:', error);
    }
}

renderTable([recentlyPlayedApiUrl, "recentlyPlayed"]);
