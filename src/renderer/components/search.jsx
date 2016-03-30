'use strict'; 

import React from 'react';
import { Component } from './util';

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

class _Search extends Component {

	state = {
		results : []
	}

	async search(searchString) {
		const results = await this.props.browser.search(searchString);

		await this.asyncSetState({ results });
	}

	render() {
		return <div>
			<SearchInput onSearch={::this.search} />
			<ul>
				{
					this.state.results.map(
						(result, idx) =>
							<li key={idx} onClick={this.props.onChoose.bind(null, result)}>
								<img src={result.image} />
								{result.name}
							</li>
					)
				}
			</ul>
		</div>;
	}

}

export const Search = _Search;

// export const Search = Fit(_Search);