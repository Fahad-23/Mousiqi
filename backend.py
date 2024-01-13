# Importing Libraries
from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS
from pytube import YouTube

# Initializing Flask application
app = Flask(__name__)
# Adding CORS support in Flask
CORS(app)


# Function to connect to the SQLite database
def connect_db():
    # Connecting to SQLite database
    conn = sqlite3.connect('music_1.db')
    return conn


# Function to fetch songs from the SQLite database to fill playlist
def fetch_songs_from_database():
    conn = connect_db()
    # Creating cursor object for executing SQL queries
    cursor = conn.cursor()

    # Execute a SQL query to fetch all songs
    cursor.execute('SELECT id, title, artist, year, genre FROM songs')

    # Fetch all rows and storing the in variable song
    songs = [{'id': row[0], 'title': row[1], 'artist': row[2], 'year': row[3], 'genre': row[4]} for row in cursor.fetchall()]
    # Closing connection to database
    conn.close()
    # Returning song variable
    return songs


# Function to fetch audio stream from YouTube with Parameter video_url
def get_audio_stream_url(video_url):
    # Initializing YouTube object  with video_url and storing it in variable yt
    yt = YouTube(video_url)
    # filtering available streams to only include the stream that contain audio and storing it in variable
    audio_stream = yt.streams.filter(only_audio=True).first()
    # Returning audio stream of the given video
    return audio_stream.url


# Function to call audio_stream_url Function with song URL to fetch audio stream
def main(video_url):
    # retrieving and storing audio stream of song in variable audio_stream_url
    audio_stream_url = get_audio_stream_url(video_url)
    return audio_stream_url


# Using Flask decorator to bind the function get_songs with route /songs
@app.route('/songs', methods=['GET'])
def get_songs():
    # Fetch songs from the database and store in variable songs
    songs = fetch_songs_from_database()
    # Return the song in JSON format
    return jsonify(songs)


# Using Flask decorator to bind get_audio_stream with route /get_audio_stream/<song_name> to dynamically return songs
@app.route('/get_audio_stream/<song_name>', methods=['GET'])
def get_audio_stream(song_name):
    conn = connect_db()
    cursor = conn.cursor()

    try:
        # Executing SQL querry to setch song URL where song title matches the provided name
        cursor.execute('SELECT api FROM songs WHERE lower(title) LIKE ?', (song_name.lower(),))
        result = cursor.fetchone()

        # If the song call the main function to retrieve audio stream of the song
        if result:
            audio_stream_url = main(result[0])
            # return the audio stream URL of song in JSON format
            return jsonify({'audio_stream_url': audio_stream_url})
        else:
            # If song not found, return error in JSON format
            return jsonify({'error': 'Song not found in the database'})
    # Handle other exceptions by giving error in JSON format
    except Exception as e:
        return jsonify({'error': str(e)})
    # close the connection to database once the task is completed
    finally:
        conn.close()


if __name__ == '__main__':
    app.run(debug=True)