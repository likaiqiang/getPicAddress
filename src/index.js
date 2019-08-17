import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Menu from './menu'
import Address from './address'
import Distance from './distance'
import './style.css';

ReactDOM.render(<Router>
                    <div className="page">
                        <div className="menu">
                            <Menu></Menu>
                        </div>
                            
                        <div className="content">
                            <Route path="/exif/address" component={Address}></Route>
                            <Route path="/map/distance" component={Distance}></Route>
                        </div> 
                    </div>
                </Router>, 
document.getElementById('root'));
