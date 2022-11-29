import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();

  const createOrGetUser = async (response) => {
    const decoded = jwt_decode(response.credential);
    const { name, sub: googleId, picture: imageUrl } = decoded;
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    };
    localStorage.setItem('user', JSON.stringify(doc));

    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  };
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
      <div className="flex justify-start items-center flex-col h-screen">
        <div className="relative w-full h-full">
          <video
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className="w-full h-full object-cover"
          />
          <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
            <div className="p-5">
              <img src={logo} width="130px" alt="logo" />
            </div>
            <div className="shadow-2xl">
              <GoogleLogin
                onSuccess={(response) => createOrGetUser(response)}
                onError={(error) => console.log(error)}
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
