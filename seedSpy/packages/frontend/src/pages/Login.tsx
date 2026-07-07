import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { LoginUser, loginSchema } from '../components/validation/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosResponse } from 'axios';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../utils/AuthContext';
import { Api } from '../App';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext) || {};

  const form = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (values: LoginUser) => {
    setIsSubmitting(true);
    try {
      const res: AxiosResponse<{ jwt: string, status: string }> = await axios.post(
        `${Api.url}/api/users/login`,
        values,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (res.status === 200 && res.data.status === 'success' && login) {
        login(res.data.jwt);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      setError('Login or password is incorrect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-80">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Please login to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="pt-3">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {
                          showPassword ? <Eye className='w-5' /> : <EyeOff className='w-5' />
                        }
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className='flex justify-center'>
            {isSubmitting ? (
              <Button type="submit" variant="default" disabled>
                Loading...
              </Button>
            ) : (
              <Button type="submit" className='bg-green-700 w-full hover:bg-green-800' variant="default">
                Login
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default Login;
