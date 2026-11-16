import { useCallback, useRef, useState } from 'react';

const FEED_URL = 'https://picsum.photos/v2/list';

/**
 * Loads the paginated picsum feed one page at a time.
 *
 * status is one of:
 *   'idle'    - ready to load the next page
 *   'loading' - a page request is in flight
 *   'error'   - the last request failed (call loadMore again to retry)
 *   'done'    - the feed returned an empty page, there is nothing more to load
 */
export function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState('idle');
  const nextPage = useRef(1);
  const busy = useRef(false);
  const finished = useRef(false);

  const loadMore = useCallback(async () => {
    // Refs (not state) guard against overlapping calls from the scroll observer.
    if (busy.current || finished.current) return;
    busy.current = true;
    setStatus('loading');

    try {
      const response = await fetch(`${FEED_URL}?page=${nextPage.current}`);
      if (!response.ok) throw new Error(`Feed responded with ${response.status}`);
      const page = await response.json();

      if (!Array.isArray(page) || page.length === 0) {
        finished.current = true;
        setStatus('done');
        return;
      }

      nextPage.current += 1;
      setPhotos((current) => {
        const seen = new Set(current.map((photo) => photo.id));
        return [...current, ...page.filter((photo) => !seen.has(photo.id))];
      });
      setStatus('idle');
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      busy.current = false;
    }
  }, []);

  return { photos, status, loadMore };
}
