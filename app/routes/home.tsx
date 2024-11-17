import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import db from '~/utils/db.server';
import { getSession } from '~/utils/session.server';
import React, { useState } from 'react';
import WeatherCard from '~/components/WeatherCard';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');

  if (!userId) {
    return redirect('/login');
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return redirect('/login');
  }

  return json({ user });
};

type User = {
  id: string;
  username: string;
  name: string;
};

type LoaderData = {
  user: User;
};

const HomePage: React.FC = () => {
  const { user } = useLoaderData<LoaderData>();

  const [cityInput, setCityInput] = useState('london');
  const [cities, setCities] = useState<string[]>([]);

  const addCity = () => {
    if (!cityInput.trim()) {
      alert('Please enter a city name.');
      return;
    }

    if (cities.length >= 5) {
      alert('You can only add up to 5 cities.');
      return;
    }

    if (cityInput && !cities.includes(cityInput)) {
      setCities((prevCities) => [...prevCities, cityInput]);
      setCityInput('');
    } else {
      alert('City is either empty or already added');
    }
  };

  const removeCity = (cityToRemove: string) => {
    setCities((prevCities) =>
      prevCities.filter((city) => city !== cityToRemove)
    );
  };

  return (
    <div>
      <div
        style={{
          maxWidth: '600px',
          margin: 'auto',
          padding: '1rem',
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        <h1>Welcome to the weather app , {user.username}!</h1>
      </div>

      <div>
        <main className='container mx-auto p-4'>
          <h2 className='text-xl font-semibold mb-4 text-center'>Add a City</h2>
          <div className='flex flex-col space-y-4'>
            <div className='flex justify-center items-center'>
              <input
                type='text'
                placeholder='City'
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className='p-2 border border-gray-300 rounded w-1/3'
              />
            </div>

            <div className='flex justify-center'>
              <button
                onClick={addCity}
                className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
              >
                Add City
              </button>
            </div>
          </div>

          <div className='mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {cities.map((cityName) => (
              <WeatherCard
                key={cityName}
                cityName={cityName}
                removeCity={removeCity}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
