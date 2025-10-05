import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Link, useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from '../lib/graphql';
import { useAuth } from '../hooks/useAuth';
import { LoginInput } from '../types';
import './Auth.css';

interface LoginResponse {
  login: {
    id: string;
    token: string;
  };
}

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [loginMutation, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION, {
    onCompleted: (data: LoginResponse) => {
      const { id, token } = data.login;
      // Create a temporary user object - we'll fetch the full user data later
      const user = {
        id,
        email: formData.email,
        firstName: '',
        lastName: '',
        suspended: false,
        deleted: false,
      };
      login(token, user);
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      setErrors([error.message]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    if (!formData.email || !formData.password) {
      setErrors(['Please fill in all fields']);
      return;
    }
    
    loginMutation({
      variables: {
        input: formData,
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Your Wallet</h2>
        <form onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((error, index) => (
                <p key={index} className="error-message">{error}</p>
              ))}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};