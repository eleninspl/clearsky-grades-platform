import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store the token
      localStorage.setItem('token', token);
      console.log('✅ Google OAuth token stored successfully');
      
      // Redirect to the main app
      navigate('/redirect', { replace: true });
    } else {
      console.error('❌ No token received from Google OAuth');
      navigate('/login?error=auth_failed&message=No authentication token received', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ fontSize: '18px', color: '#333' }}>
        🔄 Processing Google authentication...
      </div>
      <div style={{ fontSize: '14px', color: '#666' }}>
        Please wait while we log you in.
      </div>
    </div>
  );
} 