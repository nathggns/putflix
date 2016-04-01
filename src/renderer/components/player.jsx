import React from 'react';

export class VideoPlayer extends React.Component {

	state = {
		source : null,
		currentTime : 0
	}

	constructor(...args) {
		super(...args);

		this.onEnded = ::this.onEnded;
		this.videoCanPlayThrough = ::this.videoCanPlayThrough;
		this.videoSeek = ::this.videoSeek;
	}

	componentWillReceiveProps(props) {
		this.setState({
			source : this.props.sources[0].file
		});
	}

	componentDidMount() {
		const video = this.refs.video.getDOMNode();
		video.addEventListener('ended', this.onEnded);
		video.addEventListener('canplaythrough', this.videoCanPlayThrough);
		video.addEventListener('seeked', this.videoSeek);
		this.componentWillReceiveProps(this.props);
	}

	componentWillUnmount() {
		const video = this.refs.video.getDOMNode();
		video.removeEventListener('ended', this.onEnded);
		video.removeEventListener('canplaythrough', this.videoCanPlayThrough);
		video.removeEventListener('seeked', this.videoSeek);
	}

	videoSeek() {
		this.setState({ currentTime : this.refs.video.getDOMNode().currentTime });
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

	onSourceChange(e) {
		this.setState({
			source : e.target.value,
			currentTime : this.refs.video.getDOMNode().currentTime
		});
	}

	videoCanPlayThrough() {
		const video = this.refs.video.getDOMNode();
		if (video.currentTime !== this.state.currentTime) {
			video.currentTime = this.state.currentTime;
		}
	}

    render() {

    	return <div>
    		Source:

    		<select mutliple={true} value={this.state.source} onChange={::this.onSourceChange}>
    			{ this.props.sources.map((source, idx) => 
    				<option key={idx} value={source.file}>{source.label}</option>
    			)}
    		</select>

    		<div>
	    		<video
	    			autoPlay
	    			ref="video"
	    			poster={this.props.poster}
	    			src={this.state.source}
	    			controls
	    			onClick={::this.onClick}
	    			// onEnded={::this.onEnded} // this should work but it doesn't???
	    		/>
	    	</div>
    	</div>;
    }
}
