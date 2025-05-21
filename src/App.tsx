import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Viewer } from './pages/Viewer';
import EditorNew from './pages/EditorNew';
import Auth from './pages/Auth';
import TopBar from './svgedit2/Canvas/TopBar/TopBar';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* <TopBar onClose={() => {}} svgUpdate={() => {}} /> */}
      <Routes>
        <Route path="/" element={<Viewer />} />
        <Route path="/editor" element={<EditorNew />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
