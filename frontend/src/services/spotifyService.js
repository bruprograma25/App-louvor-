import api from "../api/api";

class SpotifyService {
  /**
   * Search for tracks on Spotify
   * @param {string} query - Search term (song name, artist, etc)
   * @returns {Promise} Array of track results
   */
  async searchTracks(query) {
    try {
      const response = await api.get("/search/spotify", {
        params: { q: query }
      });
      return response.data.tracks || [];
    } catch (error) {
      console.error("Error searching Spotify:", error);
      throw error;
    }
  }

  /**
   * Get detailed information about a track
   * @param {string} trackId - Spotify track ID
   * @returns {Promise} Track details
   */
  async getTrackDetails(trackId) {
    try {
      const response = await api.get(`/spotify/track/${trackId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching track details:", error);
      throw error;
    }
  }

  /**
   * Open a track in Spotify Web Player
   * @param {string} spotifyUrl - Full Spotify URL or track ID
   */
  openInSpotify(spotifyUrl) {
    if (!spotifyUrl) return;
    
    // If it's just an ID, build the URL
    const url = spotifyUrl.includes("spotify.com")
      ? spotifyUrl
      : `https://open.spotify.com/track/${spotifyUrl}`;
    
    window.open(url, "_blank");
  }

  /**
   * Play a preview of a track
   * @param {string} previewUrl - Preview URL from Spotify API
   * @returns {HTMLAudioElement} Audio element for playback
   */
  createPreviewPlayer(previewUrl) {
    if (!previewUrl) return null;
    
    const audio = new Audio(previewUrl);
    return audio;
  }
}

export default new SpotifyService();
