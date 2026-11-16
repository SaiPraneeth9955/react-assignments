import { useEffect, useRef } from 'react';
import PhotoItem from './PhotoItem.jsx';
import { usePhotos } from './usePhotos.js';

export default function App() {
  const { photos, status, loadMore } = usePhotos();
  const sentinelRef = useRef(null);

  // Load the next page whenever the marker below the list gets close to the
  // viewport. The observer is recreated each time a page finishes loading, so
  // it fires again straight away if the marker is still in view.
  useEffect(() => {
    if (status !== 'idle') return;
    const sentinel = sentinelRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [status, loadMore]);

  return (
    <div className="gallery">
      <h1 className="gallery__title">Photo gallery</h1>

      <ul className="gallery__list">
        {photos.map((photo) => (
          <PhotoItem key={photo.id} photo={photo} />
        ))}
      </ul>

      <div ref={sentinelRef} className="gallery__status" role="status">
        {status === 'loading' && <span className="spinner" aria-label="Loading more photos" />}
        {status === 'done' && <p>You have reached the end. {photos.length} photos loaded.</p>}
        {status === 'error' && (
          <p>
            Could not load photos.{' '}
            <button type="button" className="retry" onClick={loadMore}>
              Try again
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
