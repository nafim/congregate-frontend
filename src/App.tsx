import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Home from './Home';

function App() {
  return (
    <Router>
    <div>
        {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
        </Switch>
    </div>
</Router>
  );
}

export default App;
