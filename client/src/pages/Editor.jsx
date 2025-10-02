import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useSearchParams } from "react-router-dom";
import "./Editor.css";

export default function Editor() {
  const canvasRef = useRef(null);

  // use refs for history so we always read/write the latest value synchronously
  const historyRef = useRef([]);
  const redoRef = useRef([]);
  const isLoadingRef = useRef(false);

  const [historyState, setHistoryState] = useState([]); // for rendering (optional)
  const [redoState, setRedoState] = useState([]);       // for rendering (optional)
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = new fabric.Canvas("canvas", {
      height: 500,
      width: 800,
      backgroundColor: "#ffffff",
    });
    canvasRef.current = canvas;

    // helper: initialize history with current canvas snapshot
    const initHistory = (snapshot) => {
      historyRef.current = [snapshot];
      redoRef.current = [];
      setHistoryState([...historyRef.current]);
      setRedoState([...redoRef.current]);
    };

    // If opening a saved design by ID -> load it then initialize history with loaded snapshot
    const designId = searchParams.get("id");
    if (designId) {
      setLoading(true);
      isLoadingRef.current = true;
      fetch(`${import.meta.env.VITE_API_URL}/api/designs/${designId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((design) => {
          if (design.jsonData) {
            canvas.loadFromJSON(design.jsonData, () => {
              canvas.renderAll();
              initHistory(canvas.toJSON());
              isLoadingRef.current = false;
              setLoading(false);
            });
          } else {
            // no jsonData — still initialize history
            initHistory(canvas.toJSON());
            isLoadingRef.current = false;
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(err);
          initHistory(canvas.toJSON());
          isLoadingRef.current = false;
          setLoading(false);
        });
    } else {
      // No designId -> just initialize history with empty canvas snapshot
      initHistory(canvas.toJSON());
    }

    // Save history (only if NOT loading programmatically)
    const saveState = () => {
      if (isLoadingRef.current) return;
      const snap = canvas.toJSON();
      historyRef.current = [...historyRef.current, snap];
      redoRef.current = [];
      setHistoryState([...historyRef.current]);
      setRedoState([]);
    };

    canvas.on("object:added", saveState);
    canvas.on("object:modified", saveState);
    canvas.on("object:removed", saveState);

    return () => {
      canvas.off("object:added", saveState);
      canvas.off("object:modified", saveState);
      canvas.off("object:removed", saveState);
      canvas.dispose();
    };
  }, [searchParams]);

  // UNDO: move last snapshot to redo, load previous snapshot
  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // if only initial snapshot exists, can't undo
    if (historyRef.current.length <= 1) return;

    // Move latest snapshot to redo
    const last = historyRef.current.pop();
    redoRef.current.push(last);

    // The snapshot to load is now the new last element of historyRef
    const prevSnapshot = historyRef.current[historyRef.current.length - 1];

    // update state refs and UI state copies
    setHistoryState([...historyRef.current]);
    setRedoState([...redoRef.current]);

    // load previous snapshot
    isLoadingRef.current = true;
    canvas.loadFromJSON(prevSnapshot, () => {
      canvas.renderAll();
      isLoadingRef.current = false;
    });
  };

  // REDO: pop from redo, push to history, load it
  const redo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (redoRef.current.length === 0) return;

    const state = redoRef.current.pop();
    historyRef.current.push(state);

    setHistoryState([...historyRef.current]);
    setRedoState([...redoRef.current]);

    isLoadingRef.current = true;
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
      isLoadingRef.current = false;
    });
  };

  // Add Elements
  const addText = () => {
    const text = new fabric.IText("Edit me!", { left: 100, top: 100, fontSize: 24, fill: "black" });
    canvasRef.current.add(text).setActiveObject(text);
  };

  const addShape = (type) => {
    let shape;
    switch (type) {
      case "rect":
        shape = new fabric.Rect({ left: 200, top: 200, width: 120, height: 90, fill: "#6c63ff" });
        break;
      case "circle":
        shape = new fabric.Circle({ left: 250, top: 250, radius: 50, fill: "lightgreen" });
        break;
      case "triangle":
        shape = new fabric.Triangle({ left: 300, top: 300, width: 100, height: 100, fill: "pink" });
        break;
      case "line":
        shape = new fabric.Line([50, 100, 200, 200], { stroke: "black", strokeWidth: 3 });
        break;
      case "arrow":
        shape = new fabric.Polygon(
          [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 100, y: -20 },
            { x: 140, y: 20 },
            { x: 100, y: 60 },
            { x: 100, y: 40 },
            { x: 0, y: 40 },
          ],
          { fill: "orange", left: 200, top: 200 }
        );
        break;
      case "polygon":
        shape = new fabric.Polygon(
          [
            { x: 50, y: 0 },
            { x: 100, y: 38 },
            { x: 80, y: 100 },
            { x: 20, y: 100 },
            { x: 0, y: 38 },
          ],
          { fill: "skyblue", left: 250, top: 250 }
        );
        break;
      default:
        return;
    }
    canvasRef.current.add(shape).setActiveObject(shape);
  };

  // Toggle Freehand Drawing
  const toggleDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setIsDrawing(canvas.isDrawingMode);
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.width = 3;
      canvas.freeDrawingBrush.color = "black";
    }
  };

  // Change Color (also updates brush color if drawing)
  const changeColor = (color) => {
    const active = canvasRef.current.getActiveObject();
    if (active) {
      if (active.type === "line") {
        active.set("stroke", color);
      } else {
        active.set("fill", color);
      }
      canvasRef.current.renderAll();
    }
    if (canvasRef.current.isDrawingMode) {
      canvasRef.current.freeDrawingBrush.color = color;
    }
  };

  // Upload Image
  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      fabric.Image.fromURL(reader.result, (img) => {
        img.scaleToWidth(300);
        canvasRef.current.add(img).setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  // Export PNG
  const exportPNG = () => {
    const dataURL = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "design.png";
    link.click();
  };

  // Save Design (POST to backend)
  const saveDesign = async () => {
    const canvas = canvasRef.current;
    const title = prompt("Enter a title for your design:");
    if (!title) return;

    const jsonData = canvas.toJSON();
    const thumbnailUrl = canvas.toDataURL("image/png");

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/designs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, jsonData, thumbnailUrl }),
      });
      alert("✅ Design saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error saving design");
    }
  };

  return (
    <div className="editor-container">
      <h2 className="editor-title">🎨 Design Editor</h2>
      {loading && <p>Loading design...</p>}
      <div className="editor-toolbar">
        <button onClick={addText}>Add Text</button>

        {/* Dropdown for shapes */}
        <select onChange={(e) => addShape(e.target.value)} defaultValue="">
          <option value="" disabled>➕ Add Shape</option>
          <option value="rect">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="triangle">Triangle</option>
          <option value="line">Line</option>
          <option value="arrow">Arrow</option>
          <option value="polygon">Polygon</option>
        </select>

        <input type="color" onChange={(e) => changeColor(e.target.value)} />

        <label className="upload-btn">
          Upload Image
          <input type="file" accept="image/*" onChange={uploadImage} hidden />
        </label>

        <button onClick={toggleDrawing}>{isDrawing ? "✏️ Stop Drawing" : "✏️ Free Draw"}</button>

        <button onClick={undo}>↩ Undo</button>
        <button onClick={redo}>↪ Redo</button>
        <button onClick={exportPNG}>💾 Export PNG</button>
        <button onClick={saveDesign}>💾 Save Design</button>
      </div>

      <div className="editor-canvas-wrapper">
        <canvas id="canvas" className="editor-canvas" />
      </div>
    </div>
  );
}
