'use strict';

import React from 'react';
import { Episode as EpisodeComponent } from './putflix';
import { Episode } from '../../modules/putlocker';

export class Main extends React.Component {
  render() {
    return (
      <EpisodeComponent episode={new Episode('the-flash', 1, 1)} />
    );
  }
}
