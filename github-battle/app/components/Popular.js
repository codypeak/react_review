import React from 'react';
import PropTypes from 'prop-types';
import { fetchPopularRepos } from '../utils/api';
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa';
import Card from './Card';
import Loading from './Loading';
import Tooltip from './Tooltip';

function LanguagesNav({ selected, onUpdateLanguage}) {
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

    return (
        <ul className='flex-center'>
            {languages.map((language) => (
                <li key={language}>
                    <button 
                        className='btn-clear nav-link' 
                        style={language === selected ? { color: 'rgb(187, 46, 31)' } : null}
                        onClick={() => onUpdateLanguage(language)}> 
                            {language}
                    </button> 
                </li>  //need arrow function so only invoked when clicked.  would constantly update without.  also need to pass in language chosen.
            ))}
        </ul>
    )
}

LanguagesNav.propTypes ={
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid ({ repos }) {
    return (
        <ul className='grid space-around'>
            {repos.map((repo, index) => {
            const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
            const { login, avatar_url } = owner

            return (
                <li key={html_url}>
                    <Card
                        header={`#${index + 1}`}
                        avatar={avatar_url}
                        href={html_url}
                        name={login}
                    >
                        <ul className='card-list'>
                            <li>
                                <Tooltip text="Github username">
                                    <FaUser color='rgb(255, 191, 116)' size={22} />
                                    <a href={`https://github.com/${login}`}>
                                        {login}
                                    </a>
                                </Tooltip>
                            </li>
                            <li>
                            <FaStar color='rgb(255, 215, 0)' size={22} />
                                {stargazers_count.toLocaleString()} stars
                            </li>
                            <li>
                                <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                                {forks.toLocaleString()} forks
                            </li>
                            <li>
                                <FaExclamationTriangle color='rgb(241, 138, 147)' size={22} />
                                {open_issues.toLocaleString()} open
                            </li>
                        </ul>
                    </Card>
                </li>
            )
            })}
        </ul>
    )
}

export default class Popular extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedLanguage: 'All',
            repos: {},  //previously set to null, but to cache we need obj with languages as keys.
            error: null,
        }  
        // console.log('here', this)
        this.updateLanguage = this.updateLanguage.bind(this)
        this.isLoading = this.isLoading.bind(this)
    }

    componentDidMount() {
        this.updateLanguage(this.state.selectedLanguage)
    }

    updateLanguage(selectedLanguage) {
        this.setState({
            selectedLanguage,
            error: null,
            // repos: null,
        })
        //only fetch repos if not already cached
        if (!this.state.repos[selectedLanguage]) {
            fetchPopularRepos(selectedLanguage)
            //set data as property on repos obj
            .then((data) => {
                //want to add new data to repo not replace so use function to setstaate not obj
                this.setState(({ repos }) => ({  //repos destructured
                    repos: {
                    ...repos,
                    [selectedLanguage]: data  //data that came back from api for given key in repos obj
                    }
                }))
            })
            .catch(() => {
                // console.warn('Error fetching repos: ', error);
                this.setState({
                    error: 'There was an error fetching the repos.'
                })
            })
        }
    }

    isLoading() {
        const { selectedLanguage, repos, error } = this.state
        return !repos[selectedLanguage] && error === null  //falsey, ie havent already fetched selectedLanguage
    }

    render() {
        const { selectedLanguage, repos, error } = this.state

        return (
            <React.Fragment>
                <LanguagesNav
                    selected={selectedLanguage}
                    onUpdateLanguage={this.updateLanguage}
                />
                {this.isLoading() && <Loading text='Fetching Repos'/>}
                {error && <p className='center-text error'>{error}</p>}
                {repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]} />}
            </React.Fragment>  //logical operator where if 1st statement is truthy(ie not null), second will evaluate  
        )
    }
}

//&& <pre>{JSON.stringify(repos[selectedLanguage], null, 2)}</pre>}
//also repos is object so cant be rendered to view alone.  have to stringify it.  