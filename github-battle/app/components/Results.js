import React from 'react';
import { battle } from '../utils/api';  //named import b/c not default
import { FaCompass, FaBriefcase, FaUsers, FaUserFriends, FaCode, FaUser } from 'react-icons/fa';
import Card from './Card';
import PropTypes from 'prop-types';
import Loading from './Loading';
import Tooltip from './Tooltip';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

function ProfileList ({ profile }) {
    return (
        <ul className='card-list'>
            <li>
                <FaUser color='rgb(239, 115, 115)' size={22} />
                {profile.name}
            </li>
            {profile.location && (
                <li>
                    <Tooltip text="User's Location">
                        <FaCompass color='rgb(144, 115, 255)' size={22} />
                        {profile.location}
                    </Tooltip>
                </li>
            )}
            {profile.company && (
                <li>
                    <Tooltip text="User's Company">
                        <FaBriefcase color='#795548' size={22} />
                        {profile.company}
                    </Tooltip>
                </li>
            )}
            <li>
                <FaUsers color='rgb(129, 195, 245)' size={22} />
                {profile.followers.toLocaleString()} followers
            </li>
            <li>
                <FaUserFriends color='rgb(64, 183, 95)' size={22} />
                {profile.following.toLocaleString()} following
            </li>
        </ul>
    )
}

ProfileList.propTypes = {
    profile: PropTypes.object.isRequired
}

export default class Results extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            winner: null,
            loser: null,
            error: null,
            loading: true
        }
    }

    componentDidMount() {
        const { playerOne, playerTwo } = queryString.parse(this.props.location.search)
        battle([ playerOne, playerTwo ])
            .then((players) => {
                this.setState({
                    winner: players[0],
                    loser: players[1],
                    error: null,
                    loading: false
                })
            }).catch(({ message }) => {  //in UI layer so can actually use catch now instead of throw
                this.setState({
                    error: message,
                    loading: false
                })
            })
    }

    render() {
        const { winner, loser, error, loading } = this.state

        if (loading === true) {
            return <Loading />
        }
        if (error) {
            return (
                <p className='center-text error'>{error}</p>
            )
        }

        return (
            //card component passes props here
            <React.Fragment>
            <div className='grid space-around container-sm'>  
                <Card 
                    header={winner.score === loser.score ? 'Tie' : 'Winner'}
                    subheader={`Score: ${winner.score.toLocaleString()}`}
                    avatar={winner.profile.avatar_url}
                    href={winner.profile.html_url}
                    name={winner.profile.login}
                >
                    <ProfileList profile={winner.profile} />
                </Card>
                <Card
                    header={winner.score === loser.score ? 'Tie' : 'Loser'}
                    subheader={`Score: ${loser.score.toLocaleString()}`}
                    avatar={loser.profile.avatar_url}
                    name={loser.profile.login}
                    href={loser.profile.html_url}
                >
                    <ProfileList profile={loser.profile} />
                </Card>
            </div>
            <Link
                // onClick={this.props.onReset}
                to='/battle'
                className='btn dark-btn btn-space'
            >
                RESET
            </Link>
            </React.Fragment>
        )
    }
}

//props received from battle, ie player one and two

//abstracted to card component
// <div className='card bg-light'>
// <h4 className='header-lg center-text'>
//     {winner.score === loser.score ? 'Tie' : 'Winner'}
// </h4>
// <img 
//     className='avatar'
//     src={winner.profile.avatar_url}
//     alt={`Avatar for ${winner.profile.login}`}
// />
// <h4 className='center-text'>
//     Score: {winner.score.toLocaleString()}
// </h4>
// <h2 className='center-text'>
//     <a className='link' href={winner.profile.html_url}>
//         {winner.profile.login}
//     </a>
// </h2>
// </div>