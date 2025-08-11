import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './signup.css'
import { Divider } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import API_BASE from '../../config';

const Signup = () => {
  const [udata, setUdata] = useState({ fname: '', email: '', mobile: '', password: '', cpassword: '' });

  const adddata = (e) => {
    const { name, value } = e.target;
    setUdata(prev => ({ ...prev, [name]: value }));
  };

  const senddata = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(udata)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || 'Registration failed', { position: 'top-center' });
        return;
      }

      const data = await res.json();
      setUdata({ fname: '', email: '', mobile: '', password: '', cpassword: '' });
      toast.success('Registration Successfully done 😃!', { position: 'top-center' });
    } catch (error) {
      console.error('signup error', error);
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
                        <h1>Create account</h1>
                        <div className="form_data">
                            <label htmlFor="name">Your name</label>
                            <input type="text" name="fname"
                                onChange={adddata}
                                value={udata.fname}
                                id="name" />
                        </div>
                        <div className="form_data">
                            <label htmlFor="email">email</label>
                            <input type="email" name="email"
                                onChange={adddata}
                                value={udata.email}
                                id="email" />
                        </div>
                        <div className="form_data">
                            <label htmlFor="mobile">Mobile number</label>
                            <input type="number" name="mobile"
                                onChange={adddata}
                                value={udata.mobile}
                                id="mobile" />
                        </div>
                        <div className="form_data">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password"
                                onChange={adddata}
                                value={udata.password}
                                id="password" placeholder="At least 6 characters" />
                        </div>
                        <div className="form_data">
                            <label htmlFor="passwordg">Password again</label>
                            <input type="password" name="cpassword"
                                onChange={adddata}
                                value={udata.cpassword}
                                id="passwordg" />
                        </div>
                        <button type="submit" className="signin_btn" onClick={senddata}>Continue</button>

                        <Divider />

                        <div className="signin_info">
                            <p>Already have an account?</p>
                            <NavLink to="/login">Sign in</NavLink>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </section>
    );
};

export default Signup;