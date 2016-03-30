'use strict';

import fetch from 'node-fetch'; 
import Q from 'q';
import React from 'react';
import cheerio from 'cheerio'; 	
import _ from 'lodash';

// @todo: Make this nicer using the symlink trick
import * as TheVideos from '../../modules/thevideo';
import { FittedVideo } from './fitted';

class Component extends React.Component {

	constructor(props) {
		super();
	}

	async asyncSetState(state) {
		await new Promise((resolve, reject) => {
			this.setState(state, resolve);
		});
	}
}

export class Episode extends Component {

	state = {
		theVideosKey : null
	}

	constructor(props) {
		super();
		this.props = props;

		this.setTheVideosKey();
	}

	componentWillReceiveProps() {
		this.setVideoSources();
	}

	async setTheVideosKey() {
		await this.asyncSetState({
			theVideosKey : await this.props.episode.getTheVideosKey()
		});
	}

	render() {
		return this.state.theVideosKey && <TheVideosTVVideo id={this.state.theVideosKey} />;
	}

}

// Component to wrap a video in
// @todo Error handling
export class TheVideosTVVideo extends Component {

	state = {
		loadedSources : false,
		sources : [],
		sourceIdx : -1,
		id : ''
	}

	constructor(props) {
		super();
		this.state.id = props.id;
		this.setVideoSources();
	}

	getURL() {
		// @todo: Size? 
		return `http://thevideos.tv/embed-${this.state.id}-728x410.html`;
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
		return this.state.loadedSources && <FittedVideo src={this.state.sources[this.state.sourceIdx].file} />
	}

}
