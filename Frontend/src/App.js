import Evaluation from "./Components/Evaluation";
import  {Main}  from "./Components/Main";
import Results from "./Components/Results";
import { Route, Routes} from 'react-router-dom';

function App() {
  return (
   
    <div>
      <Routes>
        <Route path="/" exact  element={<Main/>} />
        <Route path="/results" element={<Results/>} />
        <Route path="/evaluation" element={<Evaluation/>} />
      </Routes>   
    </div>
  );
}

export default App;
