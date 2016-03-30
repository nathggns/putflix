'use strict';

// NOTE: None of this is used. It's legacy code that may become useful again at some point.

import fetch from 'node-fetch'; 
import Q from 'q';

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

export class TVBrowser {

	constructor(key, season, episode) {
		this.key = key;
		this.season = season;
		this.episode = episode;
		this._page = null;
	}

	static async verify(browsers) {
		for (const browser of browsers) {
			if (await browser.verify()) {
				return browser;
			}
		}

		return false;
	}

	url() {
		return `http://putlocker.is/watch-${this.key}-tvshow-season-${this.season}-episode-${this.episode}-online-free-putlocker.html`;
	}

	async page() {
		if (!this._page) {
			this._page = new Page(await fetch(this.url()))
		}

		return this._page;
	}

	async verify() {
		return (await this.page()).verify();
	}

	async next() {
		const next = TVBrowser.verify([
			new TVBrowser(this.key, this.season, this.episode + 1),
			new TVBrowser(this.key, this.season + 1, 1)
		]);

		if (!next) {
			throw new Error('Next episode does not exist');
		}

		return next;
	}
}