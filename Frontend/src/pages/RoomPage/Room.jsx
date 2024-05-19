import React, { useState, useRef } from "react";
import WhiteBoard from "../../components/whiteboard/WhiteBoard";

function Room({ user, socket }) {
  const [tool, setTool] = useState("pencil");
  const [color, setcolor] = useState("black");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRect = "white";
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setElements([]);
  };
  const undo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.slice(0, prevElements.length - 1)
    );
  };
  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };
  return (
    <div className="">
      <h1 className="text-center py-5 text-3xl font-mono">
        White Board Sharing App
      </h1>
      {user && user.presenter && (
        <div className="flex mt-2 mb-2 align-baseline justify-between">
          <div className="flex gap-4 justify-center px-5">
            <div className="flex gap-1 justify-between">
              <label htmlFor="pencil" className="mt-1">
                Pencil
              </label>
              <input
                selected
                type="radio"
                name="tool"
                value="pencil"
                checked={tool === "pencil"}
                id="pencil"
                className="mt-1"
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
            <div className="flex gap-1">
              <label htmlFor="line" className="mt-1">
                Line
              </label>
              <input
                selected
                type="radio"
                name="tool"
                id="line"
                checked={tool === "line"}
                className="mt-1"
                value="line"
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
            <div className="flex gap-1">
              <label htmlFor="rect" className="mt-1">
                Rectangle
              </label>
              <input
                selected
                type="radio"
                name="tool"
                id="rect"
                checked={tool === "rect"}
                className="mt-1"
                value="rect"
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
          </div>
          <div className="">
            <div className="flex gap-2 align-baseline justify-items-center">
              <label htmlFor="color" className="mt-1">
                Select color
              </label>
              <input
                type="color"
                id="color"
                className="mt-1"
                onChange={(e) => setcolor(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-items-center">
            <button
              onClick={undo}
              disabled={elements.length === 0}
              className="mt-1 border-2 border-blue-700 rounded-2xl px-2 bg-blue-400 hover:shadow "
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={history.length < 1}
              className="mt-1 border-2 border-blue-700 rounded-2xl px-2  hover:shadow "
            >
              Redo
            </button>
          </div>
          <div>
            <button
              onClick={handleClearCanvas}
              className="mt-1 border-2 border-red-700 rounded-2xl px-2 bg-red-500 hover:shadow-lg"
            >
              Clear canvas
            </button>
          </div>
        </div>
      )}
      <div className=" border-2 w-full border-black">
        <WhiteBoard
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          tool={tool}
          user={user}
          color={color}
          socket={socket}
          setElements={setElements}
        />
      </div>
    </div>
  );
}

export default Room;
