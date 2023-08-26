import { startTransition, useEffect, useRef, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { v4 as uuidv4 } from 'uuid';
import styles from './ImageAnnotator.module.css';

export default function ImageAnnotator({ idImage, drawBox, src, auth, activeKey, ListBoundingBox, mode, onSelectTag }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const [isDrawBox, setIsDrawBox] = useState(false);
  const ReactZoomPanPinchRef = useRef(null);

  const handleCursor = () => {
    switch (mode) {
      case 'addTags':
        return 'crosshair';
      case 'zoom':
        return 'grab';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    if (mode === 'addTags') {
      if (ReactZoomPanPinchRef.current) {
        ReactZoomPanPinchRef.current.resetTransform();
      }
    }
  }, [mode]);

  const handleLoadIMG = (e) => {
    const img = e.target;
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    setWidth(width);
    setHeight(height);
  };
  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    const rect = e.currentTarget.getBoundingClientRect();
    startTransition(() => {
      setIsDrawBox(true);
      setStartX(clientX - rect.left);
      setStartY(clientY - rect.top);
    });
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const rect = e.currentTarget.getBoundingClientRect();
    startTransition(() => {
      setEndX(clientX - rect.left);
      setEndY(clientY - rect.top);
    });
  };

  const handleMouseUp = () => {
    const id = uuidv4();
    setIsDrawBox(false);
    if (Math.abs(endX - startX) < 10 || Math.abs(endY - startY) < 10) return;
    drawBox([
      ...ListBoundingBox,
      {
        id,
        _id: idImage,
        tagName: `Tag ${ListBoundingBox.length + 1}`,
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
        imageWidth: width,
        imageHeight: height,
        code: '',
        description: '',
        origin: '',
        userEdit: auth ? auth.fullName : 'Anonymous',
        color: 'red',
      },
    ]);
  };
  return (
    <TransformWrapper disabled={mode !== 'zoom'} ref={ReactZoomPanPinchRef}>
      <TransformComponent>
        <div>
          <div style={{ width: width, height: height, maxWidth: '148vh', maxHeight: '81vh', cursor: handleCursor() }}>
            {mode === 'addTags' && (
              <>
                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  style={{
                    width: width,
                    height: height,
                    maxWidth: '148vh',
                    maxHeight: '81vh',
                    position: 'absolute',
                    zIndex: 10,
                  }}
                />
                {isDrawBox && (
                  <div
                    style={{
                      position: 'absolute',
                      top: Math.min(startY, endY),
                      left: Math.min(startX, endX),
                      width: Math.abs(endX - startX),
                      height: Math.abs(endY - startY),
                      backgroundColor: 'green',
                      opacity: 0.3,
                    }}
                  />
                )}
              </>
            )}
            {ListBoundingBox.map((box) => (
              <div
                key={box.id}
                style={{
                  position: 'absolute',
                  top: box.y,
                  left: box.x,
                  width: box.width,
                  height: box.height,
                  border: '2px dashed',
                  borderColor: box.color,
                }}
                className={`transition-colors ${activeKey === box.id && styles.bgSelectBox} ${
                  mode === 'selectTag' && 'cursor-pointer'
                }`}
                onClick={() => {
                  mode === 'selectTag' && onSelectTag(box.id);
                }}
              >
                {activeKey === box.id && (
                  <p className='absolute -top-3 rounded-sm bg-slate-200' style={{ fontSize: 9, lineHeight: 1 }}>
                    {box.tagName}
                  </p>
                )}
              </div>
            ))}
            <img
              style={{ width: '100%', height: '100%', userSelect: 'none', pointerEvents: 'none', display: 'block' }}
              onLoad={handleLoadIMG}
              draggable={false}
              crossOrigin='anonymous'
              src={src}
            />
          </div>
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
