'use client';

import { useState } from 'react';

const webhooks = {
  n8n: 'https://n8n.apps.lunamanor.com/webhook-test/a082bf1c-57a1-47fd-be87-442a59772525',
  github: 'https://apps.lunamanor.com/api/deploy/ue_xnzbUEy-UZSbIES5Ge'
};

const DrawerPage = () => {
  const [res, setRes] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const testWebhook = async (url: string, body?: Record<string, any>) => {
    setRes('Testing...');
    let response;

    if (body) {
      response = fetch(url, {
        method: 'POST',
        body: JSON.stringify(body)
      });
    } else {
      response = fetch(url);
    }

    response
      .then((res) => res.json())
      .then((data) => {
        setRes(
          'error' in data
            ? data.error
            : 'message' in data
            ? data.message
            : JSON.stringify(data)
        );
      })
      .catch((err) => setRes(err.message));
  };

  return (
    <div className='w-full min-h-100vh'>
      <div className='grid grid-cols-1 p-20 gap-4 w-fit mx-auto'>
        <div className='flex gap-2'>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
            onClick={() => {
              testWebhook(`/api/webhooks/sleep?p=${password}`);
            }}
          >
            Nap
          </button>
          <input
            type='text'
            placeholder='Password'
            className='border-2 border-gray-300 p-2 rounded-md'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='flex gap-2'>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
            onClick={() => {
              testWebhook(webhooks.n8n);
            }}
          >
            Test N8N Webhook
          </button>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
            onClick={() => {
              testWebhook(webhooks.github, { branch: 'main' });
            }}
          >
            Test Github Webhook
          </button>
        </div>
        <div className=' border-2 border-gray-300 p-4 rounded-md'>
          <p>{res}</p>
        </div>
      </div>
    </div>
  );
};

export default DrawerPage;
