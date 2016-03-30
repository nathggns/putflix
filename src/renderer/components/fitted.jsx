import React from 'react';
import { Fit } from './util';

class _FittedVideo extends React.Component {

	render() {
		return <video {...this.props}></video>;
	}

}

export const FittedVideo = Fit(_FittedVideo);