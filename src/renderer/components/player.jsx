import React from 'react';

export class VideoPlayer extends React.Component {
    render() {
        return <video poster={this.props.poster} src={this.props.src} controls></video>
    }
}