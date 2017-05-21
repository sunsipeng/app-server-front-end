/**
 * Created by sipeng on 2017/5/21.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './Assets/styles/main.styles.css';
import { HashRouter, Route } from 'react-router-dom';
import Main from './Components/Main';
import Home from './Components/Home';
import commentManage from './Components/commentManage';
import contentManage from './Components/contentManage';

const renderDom = document.getElementById('AppMainContainer');
ReactDOM.render(
    <HashRouter>
        <Main>
            <Route exact path="/" component={Home} />
            <Route path="/comment" component={commentManage} />
            <Route path="/content" component={contentManage} />
        </Main>
    </HashRouter>,
    renderDom
);