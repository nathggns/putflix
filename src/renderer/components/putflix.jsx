'use strict';

import fetch from 'node-fetch'; 
import Q from 'q';
import React from 'react';
import cheerio from 'cheerio'; 	
import _ from 'lodash';

// @todo: Make this nicer using the symlink trick
import * as TheVideos from '../../modules/thevideo';
import { FittedVideo } from './fitted';
import { Component } from './util';
import { Page } from '../../modules/putlocker';


export class Episode extends Component {

	state = {
		theVideosKey : null
	}

	constructor(props) {
		super();
		
		this.props = props;
		this.setTheVideosKey();
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
		id : '',
		loading : true
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

	async fetchVideoSources() {
		const page = await Page.fromURL(this.getURL());

		if (page.status !== 200) {
			alert('Failed to Load');
			throw new Error('Failed to load');
		}

		return TheVideos.getSources(
			TheVideos.decodeHTML(await page.text)
		);
	}

	async setVideoSources() {
		const sources = await this.fetchVideoSources();

		// @todo: What should default source be?
		await this.asyncSetState({
			sources : sources,
			sourceIdx : 0,
			loadedSources : true,
			loading : false
		});
	}

	render() {
		return this.state.loading
			? <h1>Loading</h1>
			: (
				this.state.loadedSources && <FittedVideo src={this.state.sources[this.state.sourceIdx].file} />
			)
	}

}
