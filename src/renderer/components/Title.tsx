import * as React from 'react';

//import helpers
import { getStatic } from '../helpers/static';

const Title: React.FC<{}> = (props) => (
  <div className="title">
    <img src={getStatic('nautilx_logo.png')} width='190px' />
    <h1>Nautil<span>X</span></h1>
  </div>
);

export default Title;
