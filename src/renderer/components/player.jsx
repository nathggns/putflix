import React from 'react';

export class VideoPlayer extends React.Component {

	constructor(...args) {
		super(...args);

		this.onEnded = ::this.onEnded;
	}

	componentDidMount() {
		this.refs.video.getDOMNode().addEventListener('ended', this.onEnded);
	}

	componentWillUnmount() {
		this.refs.video.getDOMNode().removeEventListener('ended', this.onEnded);
	}

	onClick() {
		const video = this.refs.video.getDOMNode();

		if (!video.paused) {
			video.pause();
		} else {
			video.play();
		}
	}

	onEnded() {
		if (this.props.onEnded) {
			this.props.onEnded();
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
        	// onEnded={::this.onEnded} // this should work but it doesn't???
        ></video>
    }
}