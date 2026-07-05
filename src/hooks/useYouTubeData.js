import { useState, useEffect, useCallback } from 'react';
import episodesFallback from '../data/episodes.fallback.json';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY?.trim();
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID?.trim();

/**
 * Hook to fetch episode data from YouTube Data API v3.
 * Falls back to static episodes.fallback.json if:
 * - No API key is configured
 * - API fetch fails
 * - Network is unavailable
 *
 * Returns the same normalized shape regardless of data source.
 */
export function useYouTubeData({ maxResults = 10 } = {}) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [channelStats, setChannelStats] = useState({
    subscribers: 54200, // realistic fallbacks
    views: 4200000,
    videos: 17,
  });

  const fetchEpisodes = useCallback(async () => {
    // No API key or IDs → use fallback immediately
    if (!API_KEY || !CHANNEL_ID) {
      setEpisodes(episodesFallback.slice(0, maxResults));
      setIsLive(false);
      setLoading(false);
      return;
    }

    try {
      let targetPlaylistId;

      // Step 0: Get the channel's "Uploads" playlist and channel statistics using the CHANNEL_ID
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics&id=${CHANNEL_ID}&key=${API_KEY}`
      );
      if (!channelRes.ok) throw new Error(`Channel API error: ${channelRes.status}`);
      const channelData = await channelRes.json();
      
      if (channelData.items && channelData.items.length > 0) {
        targetPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
        const stats = channelData.items[0].statistics;
        setChannelStats({
          subscribers: parseInt(stats.subscriberCount) || 0,
          views: parseInt(stats.viewCount) || 0,
          videos: parseInt(stats.videoCount) || 0,
        });
      } else {
        throw new Error('Channel not found');
      }

      // Step 1: Get playlist items (thumbnails, titles, video IDs)
      const playlistRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?` +
        `part=snippet&maxResults=${maxResults}&playlistId=${targetPlaylistId}&key=${API_KEY}`
      );

      if (!playlistRes.ok) throw new Error(`Playlist API error: ${playlistRes.status}`);
      const playlistData = await playlistRes.json();

      const videoIds = playlistData.items
        .map((item) => item.snippet.resourceId.videoId)
        .join(',');

      // Step 2: Get video statistics (view counts, like counts, duration)
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?` +
        `part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
      );

      if (!statsRes.ok) throw new Error(`Videos API error: ${statsRes.status}`);
      const statsData = await statsRes.json();

      // Step 3: Merge and normalize
      const statsMap = {};
      statsData.items.forEach((item) => {
        statsMap[item.id] = {
          viewCount: item.statistics.viewCount,
          likeCount: item.statistics.likeCount,
          duration: item.contentDetails.duration,
        };
      });

      const normalized = playlistData.items.map((item) => {
        const videoId = item.snippet.resourceId.videoId;
        const stats = statsMap[videoId] || {};
        
        // Auto-categorize based on title keywords
        const titleLower = item.snippet.title.toLowerCase();
        const tags = [];
        
        if (titleLower.includes('mom') || titleLower.includes('grandma') || titleLower.includes('parent') || titleLower.includes('friend')) {
          tags.push('Relatable');
        }
        if (titleLower.includes('door') || titleLower.includes('button') || titleLower.includes('choice') || titleLower.includes('would you') || titleLower.includes('press') || titleLower.includes('win') || titleLower.includes('$')) {
          tags.push('Choices');
        }
        if (titleLower.includes('moral') || titleLower.includes('lesson') || titleLower.includes('war') || titleLower.includes('warning') || titleLower.includes('incredible') || titleLower.includes('thief')) {
          tags.push('Lessons');
        }
        if (titleLower.includes('prank') || titleLower.includes('heatwave') || titleLower.includes('summer') || titleLower.includes('chaos')) {
          tags.push('Chaos');
        }
        
        // Default fallback if no keyword matches
        if (tags.length === 0) {
          tags.push('Relatable');
        }

        return {
          id: videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails?.maxres?.url
            || item.snippet.thumbnails?.high?.url
            || item.snippet.thumbnails?.medium?.url,
          publishedAt: item.snippet.publishedAt,
          videoId,
          viewCount: stats.viewCount || '0',
          likeCount: stats.likeCount || '0',
          duration: stats.duration || 'PT0M0S',
          series: tags[0] || 'Relatable',
          tags,
        };
      });

      setEpisodes(normalized);
      setIsLive(true);
      setLoading(false);
    } catch (err) {
      console.warn('[useYouTubeData] API fetch failed, using fallback:', err.message);
      setError(err.message);
      setEpisodes(episodesFallback.slice(0, maxResults));
      setIsLive(false);
      setLoading(false);
    }
  }, [maxResults]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  return { episodes, loading, error, isLive, refetch: fetchEpisodes, channelStats };
}

/**
 * Format a YouTube ISO 8601 duration (PT12M44S) to "12:44"
 */
export function formatDuration(isoDuration) {
  if (!isoDuration) return '';
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format view count to human-readable (e.g., 2.4M, 89K)
 */
export function formatViewCount(count) {
  const num = typeof count === 'string' ? parseInt(count) : count;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return String(num);
}
