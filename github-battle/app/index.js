import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Popular from './components/Popular';
// import Battle from './components/Battle';
// import Results from './components/Results';
import { ThemeProvider } from './contexts/theme';
import Nav from './components/Nav';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loading from './components/Loading';

//only import components when needed dynamically.  need to incorporate suspense by wrapping switch and routes.
const Popular = React.lazy(() => import('./components/Popular'))
const Battle = React.lazy(() => import('./components/Battle'))
const Results = React.lazy(() => import('./components/Results'))

class App extends React.Component {
    //need to add state to App for context:
    constructor(props) {
        super(props)

        this.state = {
            theme: 'light',
            toggleTheme: () => {
                this.setState(({ theme }) => ({
                    theme: theme === 'light' ? 'dark' : 'light'
                }))
            }
        }
    }

    render() {
        return (
            <Router>
                <ThemeProvider value={this.state}>
                    <div className={this.state.theme}>
                        <div className='container'>
                            <Nav />

                            <React.Suspense fallback={<Loading />}>
                                <Switch> 
                                    <Route exact path='/' component={Popular} />
                                    <Route exact path='/battle' component={Battle} />
                                    <Route path='/battle/results' component={Results} />
                                    <Route render={() => <h1>404</h1>} />                            
                                </Switch>
                            </React.Suspense>
                        </div>
                    </div>
                </ThemeProvider>
            </Router>
        )
    }
};

ReactDOM.render(
    <App />,
    document.getElementById('app')
)


//https://github.com/tylermcginnis/react-course

//https://github.com/tylermcginnis/react-course-curriculum