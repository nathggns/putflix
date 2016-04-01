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
	}

	componentWillReceiveProps(props) {
		this.setState({
			source : this.props.sources[0].file
		});
	}

	componentDidMount() {
		this.refs.video.getDOMNode().addEventListener('ended', this.onEnded);
		this.refs.video.getDOMNode().addEventListener('canplaythrough', this.videoCanPlayThrough);
		this.componentWillReceiveProps(this.props);
	}

	componentWillUnmount() {
		this.refs.video.getDOMNode().removeEventListener('ended', this.onEnded);
		this.refs.video.getDOMNode().removeEventListener('canplaythrough', this.videoCanPlayThrough);
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
