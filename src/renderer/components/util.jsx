import React from 'react';

export const OnResize = (function() {
	let listeners = [];

	window.addEventListener('resize', (e) => listeners.forEach(l => l(e)));

	function OnResize(Component) {
		const oldMounted = Component.prototype.componentDidMount || (() => undefined);
		const oldUnmount = Component.prototype.componentWillUnmount || (() => undefined);

		Component.prototype.componentDidMount = function() {
			this._resizeListener = () => this.windowDidResize && this.windowDidResize(window.innerWidth, window.innerHeight);
			listeners.push(this._resizeListener);

			const result = oldMounted.apply(this, arguments);

			this._resizeListener();

			return result;
		};

		Component.prototype.componentWillUnmount = function() {
			listeners.splice(listeners.indexOf(this._resizeListener), 1);

			return oldUnmount.apply(this, arguments);
		}
	}

	return OnResize;

})();

export class Component extends React.Component {

	constructor(props) {
		super();
	}

	async asyncSetState(state) {
		await new Promise((resolve, reject) => {
			this.setState(state, resolve);
		});
	}
}