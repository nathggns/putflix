'use strict';

import fetch from 'node-fetch'; 
import Q from 'q';
import React from 'react';
import cheerio from 'cheerio'; 	
import _ from 'lodash';

// @todo: Make this nicer using the symlink trick
import * as TheVideos from '../../modules/thevideo';

class Component extends React.Component {
	async asyncSetState(state) {
		await new Promise((resolve, reject) => {
			this.setState(state, resolve);
		});
	}
}

// Component to wrap a video in
export class TheVideosTVVideo extends Component {

	state = {
		loadedSources : false,
		sources : [],
		sourceIdx : -1
	}

	constructor(props) {
		super();
		this.props = props;
		this.setVideoSources();
	}

	getURL() {
		// @todo: Size? 
		return `http://thevideos.tv/embed-${this.props.id}-728x410.html`;
	}

	componentWillReceiveProps() {
		this.setVideoSources();
	}

	async fetchVideoSources() {
		return TheVideos.getSources(
			TheVideos.decodeHTML(await (await fetch(this.getURL())).text())
		);
	}

	async setVideoSources() {
		// @todo: What should default source be?
		await this.asyncSetState({
			sources : await this.fetchVideoSources(),
			sourceIdx : 0,
			loadedSources : true
		});
	}

	render() {
		return this.state.loadedSources && <video src={this.state.sources[this.state.sourceIdx].file}></video>;
	}

}
