var access_token = "BQCwMkl2BLauQnPdgt45jLFHjLCOsjcqRsu9n6xy3Gc1nCCCcfl6bx4IJEU31auGN4qR6rg7vF9goATKTOyCc7ZQmYeZUOiQ8Nz1LBwBvH3-CVgLg6DfKFwllv9FRVi0wNE-Pn_rYjoKV6oQZZo1NScrpUgwhHXSfVMjg5kKPyGY4y1O2BRCLfpqnGG66s4Ke9YyDwL3lA";
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
            <p>Stai ascoltando: ${songTitle.replace(/%27/g, "'")}</p>
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
                            <td><a onclick = "renderTable(['${songs[i].track.album.href}','albumSongs'])">${songs[i].track.album.name}</td>
                            <td><img src='${songs[i].track.album.images[0].url}' alt= 'ciao' width=50></td></tr>`;
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
                tbody += `<tr><td><button onclick="playSong('${songs[i].id}', '${songs[i].name.replace(/'/g, "%27")}')">Play</button></td>
                            <td><a href = "playSong('${songs[i].id}', '${songs[i].name}')">${songs[i].name}</td>
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
