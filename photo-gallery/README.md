# Photo gallery

Solution to the [Exactspace photo gallery assignment](https://github.com/exact-space/react-assignments/blob/main/photo-gallery/reactjs_photo_gallery_assignment.md).

## Features

- Single page, one column list built from the paginated feed `https://picsum.photos/v2/list?page=N`.
- Each row shows the photo (from `download_url`) and its `author`.
- **Infinite scroll:** when you get near the bottom of the page the next page is fetched and appended to the list. This repeats until the feed returns an empty page, at which point an end message is shown.
- **Likes:** a Font Awesome thumbs-up icon next to each photo with a count that starts at 0 and goes up by one on every click.
- A spinner while a page loads, and a "Try again" link if a request fails.

## Running it

Requires Node 18+.

```bash
npm install
npm run dev
```

Then open http://localhost:5174.

## Structure

```
src/
  App.jsx        Page layout and the infinite scroll trigger (IntersectionObserver)
  usePhotos.js   Fetches the feed page by page, tracks loading / error / end of feed
  PhotoItem.jsx  One row: thumbnail, author, thumbs-up button with its count
  styles.css     Plain CSS
```

## Notes

- **Image size:** `download_url` points at the original photo (often 5000px wide and several megabytes). The row only shows a small thumbnail, so the app keeps the same URL but swaps the trailing `/width/height` for the displayed size (for example `.../id/10/2500/1667` becomes `.../id/10/300/200`). Images are also lazy loaded.
- **Infinite scroll:** an `IntersectionObserver` watches a marker element under the list instead of listening to scroll events, so nothing runs while scrolling until the marker is close to the viewport.
- **CORS:** the picsum API allows cross-origin requests, so no proxy was needed.
- Like counts live in component state, so they reset on page reload.
