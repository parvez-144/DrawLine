import React, { useEffect, useState, useLayoutEffect } from "react";
import { useRef } from "react";
import rough from "roughjs";

const WhiteBoard = ({user, canvasRef, ctxRef, elements, setElements, tool,color,socket }) => {
  const[img,setImg]=useState(null);
  useEffect(()=>{
    socket.on("whiteBoardDataResponse",(data)=>{
           setImg(data.imgURL);
    })
  },[])
  
  if(!user?.presenter){
    return(
      <div
      className="h-96 w-full overflow-hidden border-black border-2"
      >
     
    <img src={img} alt="Real time white board image shared by presenter" 
    className="h-full w-full"
   />
   </div>
   )
  }
  const [isDrawing, setIsDrawing] = useState(false);
  const roughGenerator = rough.generator();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    ctx.strokeStyle=color;
    ctx.lineWidth=2;
    ctx.linecap="round"
    ctxRef.current = ctx;
  }, []);

  useEffect(()=>{
    ctxRef.current.strokeStyle=color;
  },[color])

  useLayoutEffect(() => {
    if(canvasRef){

      const roughCanvas = rough.canvas(canvasRef.current);
      if(elements.length>0){
        ctxRef.current.clearRect(0,0,canvasRef.current.width,canvasRef.current.height)
      }
      elements.forEach((element) => {
        if (element.type === "pencil") {
          roughCanvas.linearPath(element.path, {
            stroke:element.stroke,
            strokeWidth:3,
            roughness:0,
          });
        } else if (element.type === "line") {
          roughCanvas.draw(
          roughGenerator.line(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height, {
              stroke:element.stroke,
              strokeWidth:3,
              roughness:0,
            }
          )
        )
        }
        else if(element.type==="rect"){
          roughCanvas.draw(
            roughGenerator.rectangle(
              element.offsetX,
              element.offsetY,
              element.width,
              element.height,
              {
                stroke:element.stroke,
                strokeWidth:3,
                roughness:0,
              }
            )
          )
        }
      });
      const canvasImage=canvasRef.current.toDataURL();
      socket.emit("whiteboard",canvasImage)
    }
  }, [elements]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } else if (tool === "line") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: color,
        },
      ]);
    }
    else if(tool==="rect"){
      setElements((prevElements)=>[
        ...prevElements,
        {
          type:"rect",
          offsetX,
          offsetY,
          width:0,
          height:0,
          stroke:color

        }
      ])
    }
    setIsDrawing(true);
  };
  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      if (tool === "pencil") {
        const { path } = elements[elements.length - 1];
        const newPath = [...path, [offsetX, offsetY]];
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                path: newPath,
              };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "line") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX,
                height: offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      }
      else if (tool === "rect") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX-ele.offsetX,
                height: offsetY-ele.offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      }
      
    }
  };

  const handleMouseUp = (e) => {
    setIsDrawing(false);
  };
  return (
    <>
      <div
        className="h-96 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};

export default WhiteBoard;
