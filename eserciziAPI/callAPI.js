var access_token = "BQBVlZhn3znSrW1d37KKcrfjn4VERsWSdoA9HxXJsgRS9ddQ12cyahHuo-h_mIw2cSKXE5-GN4m3I6bG5SqMvM-uHJtnSghDiOjclZhm8-BP7msWvlsE3Y6W_WXHK-L1Fav3BaMr6fbTN7Moh403bQuWJdhZ8RxBCunVdO-5bLP7ceaP-MiQZR_7E1OEhVf0-OEtdIb64A";
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
            document.getElementById("albumSong").hidden = true;
            songs = songs.items;
            for (let i = 0; i < songs.length; i++){
                tbody += `<tr>
                            <td>${songs[i].track.artists[0].name}</td>
                            <td>${songs[i].track.name}</td>
                            <td>${songs[i].track.album.name}</td>
                            <td><button onclick="renderTable(['${songs[i].track.album.href}','albumSongs'])">Piu info</button></td>
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
            // <img src='${img}' alt ='copertina album' width='50'>
            document.getElementById("comeback").hidden = false;
            document.getElementById("recentlyPlayed").hidden = true;
            document.getElementById("albumSong").hidden = false;
            var albumSong = document.getElementById("albumSong");
            albumSong.innerHTML = `<img src='${img}' alt = 'copertina album' width='50'><h3>${title}</h3`;
            for (let i = 0; i < songs.length; i++){
                tbody += `<tr>
                <td><button onclick="playSong('${songs[i].id}', '${songs[i].name}')">Play</button></td></tr></tr>
                            <td>${songs[i].name}</td>
                            <td>${songs[i].duration_ms}</td>`;
                            
            }
            const tableRow = document.getElementById("albumSongs");
            tableRow.innerHTML = tbody;
        }
        const tableRow = document.getElementById('recently');
        tableRow.innerHTML += tbody;
    } catch (error) {
        console.error('Errore durante la visualizzazione dei dati:', error);
    }
}

async function back(){
    renderTable([recentlyPlayedApiUrl, "recentlyPlayed"]);
    document.getElementById("comeback").hidden = true;
}

renderTable([recentlyPlayedApiUrl, "recentlyPlayed"]);