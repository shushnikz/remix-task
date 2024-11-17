import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import bcrypt from 'bcryptjs';
import db from '~/utils/db.server';
import { getSession, commitSession } from '~/utils/session.server';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get('username') as string; // Type assertion to ensure it's a string
  const password = formData.get('password') as string;

  const user = await db.user.findUnique({ where: { username } });
  if (!user) {
    return json({ error: 'Username does not exist' }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return json({ error: 'Incorrect password' }, { status: 400 });
  }

  const session = await getSession(request.headers.get('Cookie'));
  session.set('userId', user.id);

  return redirect('/home', {
    headers: { 'Set-Cookie': await commitSession(session) },
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Use LoaderArgs here
  const session = await getSession(request.headers.get('Cookie'));
  if (session.get('userId')) {
    return redirect('/home');
  }
  return null;
};

type ActionData = {
  error?: string;
};

export default function Login() {
  //   const actionData = useActionData();
  const [showPassword, setShowPassword] = useState(false);
  const transition = useNavigation();

  const actionData = useActionData<ActionData>();

  return (
    <div className='flex items-center justify-center h-screen bg-[#a4c6e6]'>
      <div className='w-full max-w-lg mx-auto p-6 bg-[#eff7f7] rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold text-gray-900 text-center mb-6'>
          User Login
        </h1>
        <Form method='post'>
          <div className='mb-4'>
            <input
              className='w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#13adec] focus:border-transparent'
              placeholder='username'
              type='text'
              name='username'
              id='username'
              required
            />
          </div>
          <div className='mb-4 relative'>
            <input
              className='w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#13adec] focus:border-transparent'
              placeholder='password'
              type={showPassword ? 'text' : 'password'}
              name='password'
              id='password'
              required
            />
            <button
              type='button'
              className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700'
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M13.875 18.825a6.963 6.963 0 01-1.875.175c-3.86 0-7-2.686-7-6s3.14-6 7-6c1.08 0 2.1.23 3 .642m2.49 1.81c1.07.978 1.76 2.33 1.76 3.883 0 3.314-3.14 6-7 6-.64 0-1.25-.075-1.825-.21m-5.29-5.155c.264-.417.582-.797.945-1.132m9.89 9.39A7.963 7.963 0 0112 19c-4.418 0-8-3.582-8-8s3.582-8 8-8c1.844 0 3.54.627 4.91 1.678'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3.98 8.992A10.444 10.444 0 0112 4c5.25 0 9.598 3.47 10.02 7.992m-8.72 7.548A10.436 10.436 0 0112 20c-5.25 0-9.598-3.47-10.02-7.992m4.53-4.545a6.959 6.959 0 00-.51 4.097m11.21-.243c.15-.498.27-.996.35-1.496M12 16a4 4 0 100-8 4 4 0 000 8z'
                  />
                </svg>
              )}
            </button>
          </div>
          {actionData?.error && (
            <p className='text-red-500 mb-4'>{actionData.error}</p>
          )}
          <button
            type='submit'
            disabled={transition.state === 'submitting'}
            className={`w-full py-2 rounded-md text-white bg-[#13adec] hover:bg-[#0badab] transition 
          ${
            transition.state === 'submitting'
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
          >
            {transition.state === 'submitting' ? 'Logging in...' : 'Login'}
          </button>
        </Form>
      </div>
    </div>
  );
}
