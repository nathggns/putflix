'use strict';

import fetch from 'node-fetch'; 
import Q from 'q';
import React from 'react';
import cheerio from 'cheerio'; 	
import _ from 'lodash';
import { VideoPlayer } from './player';

// @todo: Make this nicer using the symlink trick
import * as TheVideos from '../../modules/thevideo';
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
		loading : true,
		poster : ''
	}

	constructor(props) {
		super();
		
		this.props = props;
		this.setVideoInfo();
	}

	getURL() {
		// @todo: Size? 
		return `http://thevideos.tv/embed-${this.props.id}-728x410.html`;
	}

	async fetchVideoInfo() {
		const page = await Page.fromURL(this.getURL());
		const text = await page.text;
		const $ = cheerio.load(text);

		if (!page.verify()) {
			alert('Failed to Load');
			throw new Error('Failed to load');
		}

		const sources = TheVideos.getSources(
			TheVideos.decodeHTML(text)
		);

		const poster = $('#vplayer img').attr('src');

		return { sources, poster };
	}

	async setVideoInfo() {
		const { sources, poster } = await this.fetchVideoInfo();

		// @todo: What should default source be?
		await this.asyncSetState({
			sources, poster,
			sourceIdx : 0,
			loadedSources : true,
			loading : false
		});
	}

	render() {
		return this.state.loading
			? <h1>Loading</h1>
			: (
				this.state.loadedSources &&
					<VideoPlayer poster={this.state.poster} src={this.state.sources[this.state.sourceIdx].file} />
			)
	}

}
