import React, { useState } from 'react';
import { BrowserRouter, Switch, Link, Route } from 'react-router-dom';
import columnsExample from "./pages/columns-sample"
import pagerExample from "./pages/pager-sample"
import extenderExample from "./pages/extenders_sample"

function App() {
  const routs = [
    { name: "Columns", component: columnsExample },
    { name: "Pager", component: pagerExample },
    { name: "Extenders", component: extenderExample }
  ];
  return (
    <BrowserRouter>
    <div style={{display: 'flex'}}>
      <div style={{width: '200px', margin: '10px' }}>{
        routs.map(r => (<Link to={r.name} key={r.name}><div>{r.name}</div></Link>))
      }</div>
      <div style={ {width: '100%'}}>
        <Switch>{
          routs.map(r => (<Route exact key={r.name} path={`/${r.name}`} component={r.component} />))
        }
        </Switch>
      </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
