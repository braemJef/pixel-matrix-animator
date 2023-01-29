import React from 'react';
import { Grid, View } from '@adobe/react-spectrum';
import Header from './Header';
import Toolbar from './Toolbar';
import Timeline from './Timeline';
import Canvas from './Canvas';

function V2() {
  return (
    <Grid
      areas={['header header', 'toolbar canvas', 'toolbar timeline']}
      columns={['size-700', '3fr']}
      rows={['size-400', 'auto', 'size-2000']}
      height="100vh"
    >
      <View gridArea="header">
        <Header />
      </View>
      <View gridArea="toolbar">
        <Toolbar />
      </View>
      <View gridArea="canvas">
        <Canvas />
      </View>
      <View gridArea="timeline">
        <Timeline />
      </View>
    </Grid>
  );
}

export default V2;
