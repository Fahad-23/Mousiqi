import os
from googleapiclient.discovery import build
from flask import Flask, jsonify, request
import requests
from pytube import YouTube
from urllib.parse import unquote
from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app, resources={r"/songs/*": {"origins": "http://127.0.0.1:5500"}})


# Set API key and build the YouTube API service
api_key = "AIzaSyBEcjUXIMp9PuRBGKtL5oaU6diLQZLUemg"  # Replace 'YOUR_API_KEY' with your actual API key
youtube = build('youtube', 'v3', developerKey=api_key)


def search_videos(query, max_results=10):
    """
    Search for videos on YouTube based on a query string.

    Args:
        query (str): The search query.
        max_results (int): Maximum number of results to return. Defaults to 10.

    Returns:
        list: A list of dictionaries, each containing information about a video.
    """
    # Call the search.list method to retrieve results matching the specified query
    request = youtube.search().list(
        part='snippet',
        q=query,
        type='video',
        maxResults=max_results
    )

    response = request.execute()

    # Parse the API response to extract video details
    videos = []
    for item in response['items']:
        video_id = item['id']['videoId']
        video_title = item['snippet']['title']
        video_url = f'https://www.youtube.com/watch?v={video_id}'
        videos.append({
            'title': video_title,
            'url': video_url
        })
    return videos


# Function to fetch audio stream URL from a YouTube video
def get_youtube_audio_stream(video_id):
    try:
        # video_url = f'https://www.youtube.com/watch?v={video_id}'
        decoded_video_url = unquote(video_id)  # Decode the URL
        yt = YouTube(decoded_video_url)
        audio_stream = yt.streams.filter(only_audio=True).first()
        return audio_stream.url if audio_stream else None
    except Exception as e:
        print(f"Error fetching YouTube audio stream: {str(e)}")
        return None


def search_results(query):
    search_results = search_videos(query)
    songs = [{'title': item['title'], 'url': item['url']} for item in search_results]
    return songs


def get_audio_stream_url(video_url):
    print(video_url)
    # Initializing YouTube object  with video_url and storing it in variable yt
    yt = YouTube(video_url)
    # filtering available streams to only include the stream that contain audio and storing it in variable
    audio_stream = yt.streams.filter(only_audio=True).first()
    # Returning audio stream of the given video
    return audio_stream.url


# Route to search for songs on YouTube
@app.route('/songs/<songs>', methods=['POST'])
@cross_origin()
def search_songs(songs):
    results = search_results(songs)
    return jsonify(results), 200


@app.route('/get_audio_stream/<path:video_url>', methods=['GET'])
@cross_origin()
def get_audio_stream(video_url):
    print(video_url)
    try:
        audio_stream_url = get_audio_stream_url(video_url)
        return jsonify({'audio_stream_url': audio_stream_url})
    # Handle other exceptions by giving error in JSON format
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
