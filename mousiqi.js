
document.addEventListener("DOMContentLoaded", function () {
  // Initializing variables as references to HTML elements
const playlistView = document.getElementById("playlistPage");
const audioPlayerView = document.getElementById("audioPlayerView");
const switchToAudioPlayer = document.getElementById("switchToAudioPlayer");
const switchToPlaylist = document.getElementById("switchToPlaylist");

// Function to switch views between Playlist and Audio Player using CSS class "hidden"
function switchViews(viewToShow, viewToHide) { // initializing function with 2 parameters
  viewToShow.classList.remove("hidden"); // removing 'hidden' CSS class from HTML element 
  viewToHide.classList.add("hidden"); // adding 'hidden' CSS class to HTML element
}

// Button event listeners to switch views
switchToAudioPlayer.addEventListener("click", () => {
  switchViews(audioPlayerView, playlistView); // button to show Audio player 
});

switchToPlaylist.addEventListener("click", () => {
  switchViews(playlistView, audioPlayerView); // button to show Playlist
});

// Function to fetch songs from the backend and populate the playlist
function fetchAndPopulatePlaylist() {
  const playlistBody = document.getElementById("playlist");
  fetch("http://127.0.0.1:5000/songs")  // Initiating a GET request and returning a promise object
    .then((response) => response.json()) // If the promise is fulfilled, then the response is converted int json
    .then((data) => {    // Chained '.then' function to initialize an arrow function with the 'Response' as its parameter
      data.forEach((song) => { // using .forEach method to itterate the function for every song 
        const row = document.createElement("tr"); // For each song create a new table row in HTML
        // making table cells for each song with HTML attributes
        row.innerHTML = ` 
          <td >${song.id}</td>
          <td class="song-title button">${song.title}</td>
          <td>${song.artist}</td>
          <td>${song.year}</td>
          <td>${song.genre}</td>
        `;

        // Add click event listener to song titles
        const songTitleCell = row.querySelector(".song-title"); // Selecting song-title element from the dynamically generated row
        songTitleCell.addEventListener("click", () => { // Listening for click
          handleSongClick(song); // Calling function handleSongClick wtih parameter song object
        });

        playlistBody.appendChild(row); // appending the new row to the playlist
      });
    })
    .catch((error) => console.error("Error fetching songs:", error));

    // Add click event listener to the next and previous buttons
    const nextButton = document.querySelector('.next-track');
    const prevButton = document.querySelector('.prev-track');

    nextButton.addEventListener('click', playNextSong);
    prevButton.addEventListener('click', playPrevSong);      
}

// Function to handle clicking on song title and play the song
function handleSongClick(song) {
  const { title } = song;
  const { artist } = song;
  fetch(
    `http://127.0.0.1:5000/get_audio_stream/${encodeURIComponent(title)}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.audio_stream_url) {
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.src = data.audio_stream_url;
        playMusic(); // play music automatically when new song is loaded
        switchViews(audioPlayerView, playlistView);
        const trackNameElement = document.querySelector('.track-name'); // Select the element for track name
        const trackArtistElement = document.querySelector('.track-artist'); // Select the element for track artist
       // Update the text content of the track name and track artist elements
       trackNameElement.textContent = title;
       trackArtistElement.textContent = artist;
      } else {
        console.error("Error: ", data.error || "Song not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching audio:", error);
    });
}

const audioPlayer = document.getElementById('audioPlayer');

// Add event listener for the 'timeupdate' event of the audio element
audioPlayer.addEventListener('timeupdate', updateProgress);


// Function to play the next song
function playNextSong() {
  // const audioPlayer = document.getElementById('audioPlayer');
  const playlist = document.getElementById('playlist');
  const currentSongTitle = document.querySelector('.track-name').textContent.trim();
  const songTitles = playlist.getElementsByClassName('song-title');

  for (let i = 0; i < songTitles.length; i++) {
    if (songTitles[i].textContent.trim() === currentSongTitle) {
      const nextIndex = (i + 1) % songTitles.length; // Calculate the index of the next song
      const nextSongTitle = songTitles[nextIndex].textContent.trim();
      const nextSongArtist = songTitles[nextIndex].nextElementSibling.textContent.trim();

      handleSongClick({  title: nextSongTitle, artist: nextSongArtist }); // Play the next song
      break;
    }
  }
}

// Function to play the previous song
  function playPrevSong() {
    // const audioPlayer = document.getElementById('audioPlayer');
    const playlist = document.getElementById('playlist');
    const currentSongTitle = document.querySelector('.track-name').textContent.trim();
    const songTitles = playlist.getElementsByClassName('song-title');

    for (let i = 0; i < songTitles.length; i++) {
      if (songTitles[i].textContent.trim() === currentSongTitle) {
        const prevIndex = (i - 1 + songTitles.length) % songTitles.length; // Calculate the index of the previous song
        const prevSongTitle = songTitles[prevIndex].textContent.trim();
        const prevSongArtist = songTitles[prevIndex].nextElementSibling.textContent.trim();

        handleSongClick({ title: prevSongTitle, artist: prevSongArtist }); // Play the previous song
        break;
      }
    }
  }

// Initial function call to fetch songs and populate the playlist
fetchAndPopulatePlaylist();
});

// Music player function

// Function to play Music
function playMusic() {
const audioPlayer = document.getElementById('audioPlayer');
const playPauseButton = document.querySelector('.playpause-track');

audioPlayer.play();
isPlaying = true;
wave.classList.add('loader');
playPauseButton.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

// Function to play or pause the audio
function togglePlayPause() {
const audioPlayer = document.getElementById('audioPlayer'); // Referencing variable to HTML element audioPlayer
const playPauseButton = document.querySelector('.playpause-track'); // Referencing variable to HTML with CSS attribute playpause-track

if (audioPlayer.paused) {
    playMusic();
} 
else {
  audioPlayer.pause();
  isPlaying = false;
  wave.classList.remove('loader');
  playPauseButton.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
}



// Function to seek to a specific position in the audio
function seekTo() {
const audioPlayer = document.getElementById('audioPlayer');
const seekSlider = document.querySelector('.seek_slider');
const seekToTime = audioPlayer.duration * (seekSlider.value / 100); 
audioPlayer.currentTime = seekToTime; 
}

// Function to adjust the volume
function setVolume() {
const audioPlayer = document.getElementById('audioPlayer');
const volumeSlider = document.querySelector('.volume_slider');
audioPlayer.volume = volumeSlider.value / 100; // Dividing volume slider by 100 to make it between 0 and 1 to give to the volume
}

// Function to update the current time and duration of the audio
function updateProgress() {
const audioPlayer = document.getElementById('audioPlayer');
const seekSlider = document.querySelector('.seek_slider');
const currentTime = document.querySelector('.current-time');
const totalDuration = document.querySelector('.total-duration');

currentTime.textContent = formatTime(audioPlayer.currentTime);
totalDuration.textContent = formatTime(audioPlayer.duration);

const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
seekSlider.value = progress || 0;
}

// Helper function to format time in MM:SS format
function formatTime(seconds) {
const minutes = Math.floor(seconds / 60);
const remainingSeconds = Math.floor(seconds % 60);
return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
