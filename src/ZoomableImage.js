import React from 'react';
import { Zoom } from 'react-image-zoom';
import poster from './5456.png';

const ZoomableImage = () => {
  const zoomImage = {
    // Replace with the URL or file path of your image
    src: { poster },
    // Set the initial zoom level (e.g., 1 for normal size, 2 for double size, etc.)
    zoomStyle: { zoom: 1 },
  };

  return (
    <div style={{ width: '500px' }}>
      <Zoom {...zoomImage} />
    </div>
  );
}

export default ZoomableImage;
