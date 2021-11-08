import logo from './logo.svg';
import './App.css';
import TodoList from './todolist'

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        
      </header> */}
      <div className="App-container">
        <TodoList/>
      </div>
    </div>
  );
}

export default App;
