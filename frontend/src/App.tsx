import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import kendoka from './kendoka.svg';
import './App.scss';
import DataGridPage from "./pages/DataGridPage/DataGridPage";

function App() {

  return (
    <div className="App">
      <DataGridPage />
    </div>
  );
}

export default App;
