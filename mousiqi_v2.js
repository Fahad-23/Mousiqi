document.addEventListener("DOMContentLoaded", function () {
  // Initializing variables as references to HTML elements
const playlistView = document.getElementById("playlistPage");
const audioPlayerView = document.getElementById("audioPlayerView");
const switchToAudioPlayer = document.getElementById("switchToAudioPlayer");
const switchToPlaylist = document.getElementById("switchToPlaylist");
const playlistBody = document.getElementById("playlist");


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


  const searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", function() {
    const songName = document.getElementById('songNameInput').value;
    getSongs(songName); // Call the function to fetch songs
  });

// Get the name of the song from some input field in your HTML

function getSongs(songName){

playlistBody.innerHTML = '';
fetch(`http://127.0.0.1:5000/songs/${encodeURIComponent(songName)}`, {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
      // You might need to add additional headers here depending on your backend requirements
  },
  body: JSON.stringify({ songName: songName }) // Send the song name as JSON data
})
.then((response) => response.json())
.then(data => {
  console.log("data is: ", data)
  data.forEach((song) => { // using .forEach method to itterate the function for every song 
      const url = song.url; // URL of the song
      const row = document.createElement("tr");
      row.innerHTML = `<td class="song-title button">${song.title}</td>`; // Displaying the title in the playlist
     // Add click event listener to song titles
      const songTitleCell = row.querySelector(".song-title"); // Selecting song-title element from the dynamically generated row
      songTitleCell.addEventListener("click", () => { // Listening for click
        handleSongClick(song); // Calling function handleSongClick with parameter song object
      });

      playlistBody.appendChild(row); // appending the new row to the playlist
    });
  })
.catch(error => {
  // Handle error if the request fails
  console.error('There was a problem with the fetch operation:', error);
});


}
// Function to handle clicking on song title and play the song
function handleSongClick(song) {
  console.log(song.title, song.url);
  const title = song.title;
  fetch(
    `http://127.0.0.1:5000/get_audio_stream/${encodeURIComponent(song.url)}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.audio_stream_url) {
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.src = data.audio_stream_url;
        playMusic(); // play music automatically when new song is loaded
        switchViews(audioPlayerView, playlistView);
        const trackNameElement = document.querySelector('.track-name'); // Select the element for track name
       // Update the text content of the track name and track artist elements
       trackNameElement.textContent = title;
      } else {
        console.error("Error: ", data.error || "Song not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching audio:", error);
    });
  }

})
const audioPlayer = document.getElementById('audioPlayer');

// Add event listener for the 'timeupdate' event of the audio element
audioPlayer.addEventListener('timeupdate', updateProgress);

// Music player functions

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
