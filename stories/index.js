import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import  Grid  from '../src/index.js';
import  DocUI  from '../src/docTool/DocUI';
import EasyBool from '../src/easyTools/EasyBool';

import DataNoiseMed from './dataNoiseMedium.js'
import DataNoiseSmall from './dataNoiseSmall.js'
import DataNoiseGiant from './dataNoiseGiant.js'

storiesOf('Grid', module)
  .add('DocUI', () => (<DocUI/>))
;



storiesOf('Easy Tools', module)
  .add('EasyBool true', () => (
    <div style={{ border: '1px dashed green', width: '50%' }}>
      <EasyBool
        x={5} y={6} objKey='keyName' cellData={true} trueText='yep' falseText='nope' id='myId'
        onChange={(x, y, objKey, val) => { window.alert(x, y, objKey, val); }}
      />
    </div>
  ))
  .add('EasyBool false', () => (
      <div style={{ border: '1px dashed green', width: '50%' }}>
        <EasyBool
          x={5} y={6} objKey='keyName' cellData={false} trueText='yep' falseText='nope' id='myId'
          onChange={(x, y, objKey, val) => { window.alert(x, y, objKey, val); }}
        />
      </div>
  ))
;  