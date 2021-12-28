import React, { ReactElement } from 'react';

function Login():ReactElement {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
    }}
    >
      <h3>Login to Shwe La Won Dental Clinic</h3>
      <a href="">Login with Authentication</a>
    </div>
  );
}

export default Login;