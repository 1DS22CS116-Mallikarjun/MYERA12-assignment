import React, { useState, useRef} from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";

import { useImages } from "../hooks/useImages";

import { stickersData } from "../utils/stickers";

const snapToGrid = (pos, gridSize = 40) => {
    Math.round(pos / gridSize) * gridSize;
}
  



export  function StickerCanvas() {
  const [stickers, setStickers] = useState([]);
  const stageRef = useRef();
  const images = useImages(stickersData);

  const addSticker = ({ src }) => {
    const newSticker = {
      src,
      x: snapToGrid(50),
      y: snapToGrid(50),
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  const handleDragEnd = (e, id) => {
    const { x, y } = e.target.position();
    setStickers((prev) =>
      prev.map((st) =>
        st.id === id ? { ...st, x: snapToGrid(x), y: snapToGrid(y) } : st
      )
    );
  };

  const handleDelete = (id) => {
    setStickers((prev) => prev.filter((st) => st.id !== id));
  };

  const downloadCanvas = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = uri;
    link.click();
  };

  return (
    <div className="flex items-center justify gap-6 p-6 bg-gray-700 rounded shadow-lg h-screen">
      <div className="flex flex-col gap-3 items-center">
        {stickersData.map(({ id, src }) => (
          <button
            key={id}
            onClick={() => addSticker({ id, src })}
            className="bg-white p-2 rounded hover:scale-110 transition cursor-pointer"
            title={`Add ${id}`}
          >
            <img src={src} alt={id} className="w-8 h-8" />
          </button>
        ))}
        <button
          onClick={downloadCanvas}
          className="mt-6 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700  cursor-pointer rounded-lg"
        >
          Download PNG
        </button>
      </div>

      <Stage
        width={600}
        height={400}
        ref={stageRef}
        className="border-1 border-gray-300 bg-slate-300"
      >
        <Layer > 
          {stickers.map(({ id, src, x, y }) =>
            images[src] ? (
              <KonvaImage
                key={id}
                image={images[src]}
                x={x}
                y={y}
                width={40}
                height={40}
                draggable
                onDragEnd={(e) => handleDragEnd(e, id)}
                onDblClick={() => handleDelete(id)}
              />
            ) : null
          )}
        </Layer>
      </Stage>
    </div>
  );
}
