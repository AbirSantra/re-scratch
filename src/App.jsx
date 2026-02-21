import React from "react";
import ScratchEditor from "./components/ScratchEditor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ScratchEditor />
    </DndProvider>
  );
}
