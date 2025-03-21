import React from 'react'
import Signup from './pages/signup.jsx'

//amplify imports

import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  return (
    <Authenticator loginMechanisms={['email']}>
    
    <div>
      
      <Signup/>
    </div>
    </Authenticator>

  )
}

export default App