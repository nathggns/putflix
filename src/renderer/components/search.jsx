'use strict'; 

import React from 'react';
import { Component } from './util';
import Radium from 'radium';

const styles = {
	search : {
		background : 'rgba(0, 0, 0, .3)',
		boxShadow : '0 0 3px black inset',
		padding : '30px',
		width : '300px',
		borderRadius : '10px',
		textAlign : 'center'
	},

	center : {
		margin : '30px auto',
	},

	title : {
		color : 'white',
		textShadow : '0 1px 0 white'
	}
}

class SearchInput extends Component {

	state = {
		searchString : '',
		searchTimer : null
	}

	constructor() {
		super();
		this.handleSearchFormChange = ::this.handleSearchFormChange;
	}

	handleSearchFormChange(event) {
		clearTimeout(this.state.searchTimer);

		this.setState({
			searchString : event.target.value,
			searchTimer : setTimeout(::this.search, 500)
		});
	}

	componentWillUnmount() {
		clearTimeout(this.state.searchTimer);
	}

	search() {
		this.props.onSearch(this.state.searchString);
	}

	render() {
		return <input value={this.state.searchString} onChange={this.handleSearchFormChange} />;
	}
}

class EpisodeSelector extends Component {

	state = {
		episodes : []
	}

	componentDidMount() {
		this.getEpisodes();
	}

	async getEpisodes() {
		const episodes = await this.props.browser.getEpisodes(this.props.show.key);

		await this.asyncSetState({ episodes });
	}

	render() {
		return <ul>
			{ this.state.episodes.map((episode, idx) => 
				<li key={idx} onClick={this.props.onChoose.bind(null, episode)}>
					Season {episode.seasonNumber} Episode {episode.episodeNumber}: {episode.name}
				</li>
			)}
		</ul>
	}

}

@Radium
class ShowSelector extends Component {

	state = {
		results : []
	}

	async search(searchString) {
		const results = await this.props.browser.search(searchString);

		await this.asyncSetState({ results });
	}

	onChoose(result) {
		this.props.onChoose(result);
	}

	render() {
		return <div style={[styles.search, styles.center]}>

			<h1 style={[styles.title]}>Putflix</h1>
			<SearchInput onSearch={::this.search} />
			<ul>
				{
					this.state.results.map(
						(result, idx) =>
							<li key={idx} onClick={this.onChoose.bind(this, result)}>
								<img src={result.image} />
								{result.name}
							</li>
					)
				}
			</ul>
		</div>;
	}

}

export class Search extends Component {
	state = {
		show : null
	}

	async onShowChoose(show) {
		await this.asyncSetState({ show });
	}

	onChoose(episode) {
		this.props.onChoose(episode);
	}

	backToShowSelector() {
		this.setState({ show : null });
	}

	render() {

		return <div>
			<div style={{display:this.state.show?'none':'block'}}>
				<ShowSelector browser={this.props.browser} onChoose={::this.onShowChoose} />
			</div>

			{this.state.show &&
				<div>
					<button onClick={::this.backToShowSelector}>Back</button>
					<EpisodeSelector show={this.state.show} browser={this.props.browser} onChoose={::this.onChoose} />
				</div>
			}
		</div>;
	}
}


// export const Search = Fit(_Search);