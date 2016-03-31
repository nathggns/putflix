'use strict';

import fetch from 'node-fetch'; 
import Q from 'q';

import { decodePutlockerData } from './util';
import cheerio from 'cheerio';
import _ from 'lodash';

Q.longStackSupport = true;

export class Page {
	constructor(response) {
		this.response = response;
		this.text = response.text();
	}

	static async fromURL(url) {
		return new Page(await fetch(url));
	}

	async $() {
		return cheerio.load(await this.text);
	}

	verify() {
		return this.response.status === 200;
	}
}

export class Browser {

	constructor() {

	}

	async search(string) {
		const page = await Page.fromURL(`http://putlocker.is/search/search.php?q=${encodeURIComponent(string)}`);
		const $ = await page.$();
		
		return Array.from($('h2 ~ h2 + table td > a')).map((link, idx) => {
			const $link = $(link);
			const href = $link.attr('href');
			const match = href.match(/watch-(.+?)-tvshow/);

			if (!match) {
				return false;
			}

			const key = match[1];
			const name = $link.attr('title');
			const image = $link.find('img').attr('src');

			return { key, name, image };
		}).filter(i => !!i);
	}

	async getEpisodes(show) {
		const page = await Page.fromURL(`http://putlocker.is/watch-${show}-tvshow-online-free-putlocker.html`);
		const $ = await page.$();
		const seasons = Array.from($('.selector_name'));
		const episodes = _.flatten(seasons.map(
			season => {
				const $season = $(season);
				const seasonNumber = Number($season.find('strong').text().slice('Season '.length));
				const $entries = Array.from($season.parent().next().find('.entry a').parent());

				return $entries.map(entry => {
					const $entry = $(entry);
					const episodeNumber = Number($entry.find('strong').text().slice('Episode '.length));
					const name = $entry.text().match(/-\s+([^\n]+)/)[1];
					const episode = new Episode(show, seasonNumber, episodeNumber, name);

					return { seasonNumber, episodeNumber, name, episode };
				});
			}
		));

		return episodes;
	}

}

export class Episode {

	constructor(id, season, episode, name) {
		this.id = id;
		this.season = season;
		this.episode = episode;
		this.name = name;

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