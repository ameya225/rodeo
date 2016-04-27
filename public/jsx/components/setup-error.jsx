/* globals React, ipc */
'use strict';

const SetupError = window.SetupError = (function () {

  return React.createClass({
    displayName: 'SetupError',
    handleSendError: () => ipc.send('send-error'),
    render: function () {
      return (
        <div className="setup-error container">
          <div className="row possible-error">
            <h2>{'Looks like something has gone wrong.'}</h2>
            <p className="lead">{'There might be something unique about your system that we didn\'t plan for.:'}</p>
          </div>
          <div className="row">
            <h2>{'Help us out by sending the error message?'}</h2>
            <p className="lead">
              <a onClick={this.handleSendError}>{'Click here to report error'}</a>
            </p>
          </div>
        </div>
      );
    }
  });
}());