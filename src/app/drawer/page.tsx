'use client';

import { useState } from 'react';

const weebhooks = {
  n8n: 'https://n8n.apps.lunamanor.com/webhook-test/a082bf1c-57a1-47fd-be87-442a59772525',
  github: 'https://apps.lunamanor.com/api/deploy/ue_xnzbUEy-UZSbIES5Ge'
};

const DrawerPage = () => {
  const [res, setRes] = useState<string>('');

  const testWebhook = async (id: string) => {
    setRes('Testing...');
    const response = await fetch(weebhooks[id as keyof typeof weebhooks])
      .then((res) => res.json())
      .catch((err) => setRes(err.message));
  };

  return (
    <div className='w-full min-h-100vh'>
      <div className='p-20 w-fit mx-auto'>
        <div className='flex gap-2'>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
            onClick={() => {
              testWebhook('n8n');
            }}
          >
            Test N8N Webhook
          </button>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
            onClick={() => {
              testWebhook('github');
            }}
          >
            Test Github Webhook
          </button>
        </div>
        <div className='mt-4 border-2 border-gray-300 p-4 rounded-md'>
          <p>{res}</p>
        </div>
      </div>
    </div>
  );
};

export default DrawerPage;
