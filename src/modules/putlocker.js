'use strict';

import fetch from 'node-fetch'; 
import Q from 'q';

import { decodePutlockerData } from './util';

Q.longStackSupport = true;

export class Page {
	constructor(response) {
		this.response = response;
		this.text = response.text();
	}

	verify() {
		return this.response.status === 200;
	}
}

export class Episode {

	constructor(id, season, episode) {
		this.id = id;
		this.season = season;
		this.episode = episode;

		this._page = null;
	}

	getURL() {
		return `http://putlocker.is/watch-${this.id}-tvshow-season-${this.season}-episode-${this.episode}-online-free-putlocker.html`;
	}

	// @todo Can probably move this to a potential parent class
	async page(text = false) {
		if (!this._page) {
			this._page = new Page(await fetch(this.getURL()));
		}

		return text ? await this._page.text : this._page;
	}

	async getTheVideosKey() {
		const str = (await this.page(true)).match(/doit\('[^\']+/g)[1].slice(6);
		const code = decodePutlockerData(str);
		const key = code.match(/embed-(.+?)-/)[1];

		return key;
	}

}