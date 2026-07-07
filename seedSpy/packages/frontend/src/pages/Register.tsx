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
import { RegisterUser, registerSchema } from '../components/validation/register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosResponse } from 'axios';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../utils/AuthContext';
import { Api } from '../App';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext) || {};

  const form = useForm<RegisterUser>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values: RegisterUser) => {
    setIsSubmitting(true);
    try {
      const res: AxiosResponse<{ jwt: string, status: boolean }> = await axios.post(
        `${Api.url}/api/users/register`,
        values,
        {
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      if (res.status === 200 && res.data.status && login) {
        login(res.data.jwt);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      setError('Registered user is invalid or already exists.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-80">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>
                Sign up to SeedSpy App
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
                      <Input {...field} placeholder="John" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className='pt-2'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="john@doe.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="pt-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          placeholder="**********"
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
                  Register
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
  );
};

export default Register;
