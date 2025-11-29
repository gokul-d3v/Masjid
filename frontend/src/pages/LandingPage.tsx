import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set a timer to redirect to login after 3 seconds
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 3000);

    // Clean up the timer if component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Content style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '20px'
        }}>
          <img
            src="/Splash.png"
            alt="Splash Screen"
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
              width: 'auto',
              height: 'auto',
              margin: '0 auto',
              display: 'block'
            }}
          />
          <div style={{ marginTop: '30px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(0, 0, 0, 0.3)',
              borderTop: '4px solid #0D6D3F',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LandingPage;