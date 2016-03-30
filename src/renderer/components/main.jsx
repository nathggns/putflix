'use strict';

import React from 'react';
import { Episode as EpisodeComponent } from './putflix';
import { Episode, Browser } from '../../modules/putlocker';
import { Search } from './search';
import { Component } from './util';

export class Main extends Component {

	state = {
		selected : null
	}

	constructor() {
		super();
		this.browser = new Browser();
	}

	async onChoose(selected) {
		await this.asyncSetState({ selected });
	}

	render() {
    	return (
    		!this.state.selected
    			? <Search browser={this.browser} onChoose={::this.onChoose} />
      		 	: <EpisodeComponent episode={new Episode(this.state.selected.key, 1, 1)} />
    	);
  	}
}
