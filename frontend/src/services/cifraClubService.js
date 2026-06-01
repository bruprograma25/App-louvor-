import api from "../api/api";

class CifraClubService {
  /**
   * Search for chords/tabs on Cifra Club
   * @param {string} query - Search term (song name, artist, etc)
   * @returns {Promise} Search result with URL
   */
  async searchCifras(query) {
    try {
      const response = await api.get("/search/cifra", {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error("Error searching Cifra Club:", error);
      throw error;
    }
  }

  /**
   * Open Cifra Club search in new window
   * @param {string} query - Search term
   */
  openCifraSearch(query) {
    if (!query) return;
    
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://www.cifraclub.com.br/busca/?q=${encodedQuery}`;
    
    window.open(searchUrl, "_blank");
  }

  /**
   * Direct link to a Cifra Club chord page
   * @param {string} artist - Artist name
   * @param {string} songTitle - Song title
   * @returns {string} Formatted URL for common Cifra Club pattern
   */
  buildCifraUrl(artist, songTitle) {
    if (!artist || !songTitle) return null;
    
    // Format: artist-name/song-name
    const artistSlug = artist.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const songSlug = songTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    
    return `https://www.cifraclub.com.br/${artistSlug}/${songSlug}/`;
  }

  /**
   * Search and get a direct link to the chord page
   * @param {string} artist - Artist name
   * @param {string} songTitle - Song title
   * @returns {Promise} URL object with search_url and formatted_url
   */
  async searchAndBuildUrl(artist, songTitle) {
    try {
      const query = `${artist} ${songTitle}`;
      const searchResult = await this.searchCifras(query);
      
      return {
        ...searchResult,
        formatted_url: this.buildCifraUrl(artist, songTitle)
      };
    } catch (error) {
      console.error("Error building Cifra URL:", error);
      return {
        formatted_url: this.buildCifraUrl(artist, songTitle),
        search_url: `https://www.cifraclub.com.br/busca/?q=${encodeURIComponent(artist + " " + songTitle)}`
      };
    }
  }
}

export default new CifraClubService();
