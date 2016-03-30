import React from 'react';

/**
 * Use this to fit your component to the window size
 */
export function Fit(Component) {

	class Fitter extends React.Component {
		constructor() {
			super();

			this.state = {
				width : window.innerWidth,
				height : window.innerHeight
			};

			this.handleResize = ::this.handleResize;
		}

		getProps() {
			return {
				style : {
					width  : `${this.state.width}px`,
					height : `${this.state.height}px`,
					position : 'absolute',
					top : 0,
					left : 0
				}
			}
		}

		handleResize() {
			this.setState({
				width : window.innnerWidth,
				height : window.innerHeight
			});
		}

		componentDidMount() {
			window.addEventListener('resize', this.handleResize);
		}

		comonentWillUnmount() {
			window.removeEventListener('resize', this.handleResize);
		}

		render() {
			return <Component {...this.props} {...this.getProps()} />;
		}
	}

	return Fitter;
}