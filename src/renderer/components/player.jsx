import React from 'react';

export class VideoPlayer extends React.Component {

	onClick() {
		const video = this.refs.video.getDOMNode();

		if (!video.paused) {
			video.pause();
		} else {
			video.play();
		}

	}

    render() {
        return <video
        	autoPlay
        	ref="video"
        	poster={this.props.poster}
        	src={this.props.src}
        	controls
        	onClick={::this.onClick}
        ></video>
    }
}