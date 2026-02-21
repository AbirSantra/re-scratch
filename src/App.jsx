import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ScratchEditor from "./components/ScratchEditor";
import "./index.css";
import { ThemeProvider } from "./store/themeStore";

export default function App() {
  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <ScratchEditor />
      </DndProvider>
    </ThemeProvider>
  );
}
