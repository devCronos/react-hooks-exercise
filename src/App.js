import React, { Component, useState } from 'react';

import Todo from './Components/Todo';
import Header from './Components/Header';
import Auth from './Components/Auth';
import AuthContext from './auth-context';

const app = props => {
  const [page, setPage] = useState('auth');
  const [authStatus, setAuthStatus] = useState(false);

  const SwitchPage = (pageName) =>{
    setPage(pageName);
  }

  const login = () => {
    setAuthStatus(true);
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{status: authStatus, login: login}}>
        <Header
          onLoadTodos={SwitchPage.bind(this,'todos')}        
          onLoadAuth={SwitchPage.bind(this,'auth')} 
        />   
        <hr />
        {page ==='auth'? <Auth />: <Todo />}
      </AuthContext.Provider>
    </div>
  )
}

export default app;
