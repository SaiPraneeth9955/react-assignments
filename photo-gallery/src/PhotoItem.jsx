import { memo, useState } from 'react';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const THUMB_WIDTH = 300;
const THUMB_HEIGHT = 200;

// download_url ends in the original size, e.g. https://picsum.photos/id/10/2500/1667.
// The originals are several megabytes each, so ask picsum for the same photo at
// the size we actually display by swapping that trailing /width/height.
const sized = (downloadUrl, width, height) =>
  downloadUrl.replace(/\/\d+\/\d+$/, `/${width}/${height}`);

function PhotoItem({ photo }) {
  const [likes, setLikes] = useState(0);
  const { author, download_url: downloadUrl } = photo;

  return (
    <li className="photo">
      <img
        className="photo__image"
        src={sized(downloadUrl, THUMB_WIDTH, THUMB_HEIGHT)}
        srcSet={`${sized(downloadUrl, THUMB_WIDTH * 2, THUMB_HEIGHT * 2)} 2x`}
        width={THUMB_WIDTH}
        height={THUMB_HEIGHT}
        alt={`Photo by ${author}`}
        loading="lazy"
      />

      <p className="photo__author">
        <span className="photo__label">Author:</span> {author}
      </p>

      <button
        type="button"
        className="like"
        onClick={() => setLikes((count) => count + 1)}
        aria-label={`Like photo by ${author}, ${likes} ${likes === 1 ? 'like' : 'likes'}`}
      >
        <FontAwesomeIcon icon={faThumbsUp} />
        <span className="like__count">{likes}</span>
      </button>
    </li>
  );
}

export default memo(PhotoItem);
