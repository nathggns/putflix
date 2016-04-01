'use strict';

import React from 'react';
import { Episode as EpisodeComponent } from './putflix';
import { Browser, Episode } from '../../modules/putlocker';
import { Search } from './search';
import { Component } from './util';
import Radium from 'radium';

const styles = {
	base : {
		fontFamily : 'Arial, sans-serif',
		background: '#333',
		color: '#fff'
	},

	fullSize : {
		position : 'absolute',
		top : 0,
		left : 0,
		width : '100%',
		height : '100%',
		overflow : 'auto'
	}
}

@Radium
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

	async nextEpisode() {
		const selected = this.state.selected;
		await this.asyncSetState({ selected : null });

		this.setState({ selected : await this.browser.nextEpisode(selected) });
	}

	backToSearch() {
		this.setState({ selected : null });
	}

	render() {
		return <div style={[
			styles.base,
			styles.fullSize
		]}>
			<div style={[
				this.state.selected && { display : 'none' }
			]}>
				<Search browser={this.browser} onChoose={::this.onChoose} />
			</div>

			{this.state.selected && 
				<div>
					<button onClick={::this.backToSearch}>Back</button>
					<button onClick={::this.nextEpisode}>Next</button>
					<EpisodeComponent
						episode={this.state.selected}
						onEnded={::this.nextEpisode} // @todo Should do a timer like netflix does
					/>
				</div>
			}
		</div>;
  	}
}
