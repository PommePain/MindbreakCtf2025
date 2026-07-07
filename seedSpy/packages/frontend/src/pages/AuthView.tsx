import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../utils/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import Login from './Login';
import Register from './Register';

const AuthView: React.FC = () => {
  const { authUser } = useContext(AuthContext) || {};

  if (authUser) {
    return <Navigate to='/home' />;
  }

  return (
    <div className="h-screen bg-emerald-950 w-screen flex justify-center items-center">
      <Tabs defaultValue='login'>
        <TabsList className='w-full shadow-md justify-around'>
          <TabsTrigger className='w-full' value="login">Login</TabsTrigger>
          <TabsTrigger className='w-full' value='register'>Register</TabsTrigger>
        </TabsList>
          <TabsContent value='login'>
            <Login />
          </TabsContent>
          <TabsContent value='register'>
            <Register />
          </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthView;
