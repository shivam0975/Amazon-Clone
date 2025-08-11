import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Logincontext } from '../context/Contextprovider';
import { ToastContainer, toast } from 'react-toastify';
import API_BASE from '../../config';
import './signup.css'

const SignIn = () => {
  const { account, setAccount } = useContext(Logincontext);
  const [logdata, setData] = useState({ email: '', password: '' });

  const adddata = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const senddata = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // send/receive cookie
        body: JSON.stringify(logdata)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || 'Login failed', { position: 'top-center' });
        return;
      }

      const data = await res.json();
      setAccount(data);
      setData({ email: '', password: '' });
      toast.success('Login Successfully done 😃!', { position: 'top-center' });
    } catch (error) {
      console.error('login error', error);
      toast.error('Network error', { position: 'top-center' });
    }
  };

  return (
        <section>
            <div className="sign_container">
                <div className="sign_header">
                    <img src="./blacklogoamazon.png" alt="signupimg" />
                </div>
                <div className="sign_form">
                    <form method="POST">
                        <h1>Sign-In</h1>

                        <div className="form_data">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email"
                                onChange={adddata}
                                value={logdata.email}
                                id="email" />
                        </div>
                        <div className="form_data">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password"
                                onChange={adddata}
                                value={logdata.password}
                                id="password" placeholder="At least 6 characters" />
                        </div>
                        <button type="submit" className="signin_btn" onClick={senddata}>Continue</button>
                    </form>
                    <ToastContainer />
                </div>
                <div className="create_accountinfo">
                    <p>New to Amazon?</p>
                    <button>  <NavLink to="/signup">Create your Amazon Account</NavLink></button>
                </div>
            </div>

        </section>
    )
};

export default SignIn;
