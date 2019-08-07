import React from 'react';
import PropTypes from 'prop-types';
import withHover from './withHover';
import Hover from './Hover';

const styles = {
    container: {
      position: 'relative',
      display: 'flex'
    },
    tooltip: {
      boxSizing: 'border-box',
      position: 'absolute',
      width: '160px',
      bottom: '100%',
      left: '50%',
      marginLeft: '-80px',
      borderRadius: '3px',
      backgroundColor: 'hsla(0, 0%, 20%, 0.9)',
      padding: '7px',
      marginBottom: '5px',
      color: '#fff',
      textAlign: 'center',
      fontSize: '14px',
    }
  }

function Tooltip ({ text, children }) {
        return (
            <Hover>
                {(hovering) => (
                    <div style={styles.container}>
                        {hovering === true && <div style={styles.tooltip}>{text}</div>}
                        {children}
                    </div>
                )}  
            </Hover>
        )
    }

Tooltip.propTypes = {
    text: PropTypes.string.isRequired
}

export default Tooltip


//export default withHover(Tooltip)
//not actually exporting Tooltip.  exporting invocation of withHover.
//withHover returns another component, so any props being passed are passed to withHover component.
//to get all the props to be passed through the higher order component, spread them into the HOC.