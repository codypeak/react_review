import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    content: {
        fontSize: '35px',
        position: 'absolute',
        left: '0',
        right: '0',
        marginTop: '20px',
        textAlign: 'center',
    }
}

//continuously rerender UI for loading animation
export default class Loading extends React.Component { 
    constructor(props) {
        super(props)

        this.state = {
            content: props.text
        }
    }

    componentDidMount() {  //setinterval returns an obj to stop it from running need to clear interval passing in what setinterval returned to us.  
        const { text, speed } = this.props
        this.interval = window.setInterval(() => {  //can set instance properties that can be accessed in other parts of the component
            this.state.content === text + '...'
            ? this.setState({ content: text }) 
            : this.setState(({ content }) => ({ content: content + '.'})) 
        }, speed)  //every 300 ms function will be invoked
    }

    componentWillUnmount() {  //clear interval to stop it from running and having memory leakage
        window.clearInterval(this.interval)
    }

    render() {
        return (
            <p style={styles.content}>
                {this.state.content}
            </p>
        )
    }
}

Loading.propTypes = {
    text: PropTypes.string.isRequired,
    speed: PropTypes.number. isRequired
}

Loading.defaultProps = {
    text: 'Loading',
    speed: 300
}