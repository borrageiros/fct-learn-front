import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import Header from './components/Header/Header';

import ActivitiesList from './screens/Activity/ActivitiesList/ActivitiesList';
import ActivitiesEdit from './screens/Activity/ActivitiesEdit/ActivitiesEdit';

function Index() {
  
    return (
      <BrowserRouter>
        <Header>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/activities/admin" element={<ActivitiesList />}/>
            <Route path="/activities/edit/:id" element={<ActivitiesEdit />}/>
          </Routes>
        </Header>
      </BrowserRouter>
    );
  }
  
  ReactDOM.render(<Index />, document.getElementById('root'))