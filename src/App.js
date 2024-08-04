import logo from './logo.svg';
import './App.css';
import LoginForm from './components/loginForm'

function App() {
  console.log(process.env)
  return (
    <div className="App">
      <LoginForm/>
    </div>
  );
}

export default App;
