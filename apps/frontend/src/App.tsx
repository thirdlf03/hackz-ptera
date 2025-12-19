import Board from "./features/chess/compomemt/Board";

import "@/App.css";

function App() {
  return (
    <>
      <div className="app-container">
        <div className="title">Chess</div>
        <Board className="container-3d" />
      </div>
    </>
  );
}

export default App;
