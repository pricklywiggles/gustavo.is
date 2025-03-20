'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { CheckmarkIcon, EnvelopeIcon } from '@/components/icons';
import { accounts } from '@/utils/data';
import { FComp } from '@/types/common';
import { indieFlower } from '@/fonts/fonts';

export const ContactSection: FComp = () => {
  const [result, setResult] = React.useState<string>('');

  return (
    <div className='sm:w-3/5 -mt-6 sm:mt-0 p-6 w-9/10'>
      {result === 'success' ? (
        <div className='flex  items-center bg-blueGray-400 min-h-full p-6 well-shadow shadow-inner rounded-3xl'>
          <div>
            <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100'>
              <CheckmarkIcon className='h-6 w-6 text-green-600' />
            </div>
            <div className='mt-3 text-center sm:mt-5'>
              <h3
                className='text-lg leading-6 font-medium text-gray-100'
                id='modal-headline'
              >
                Your message was sent!
              </h3>
              <div className='mt-2'>
                <p className='text-sm text-gray-600'>
                  I will get back to you as soon as possible, feel free to also
                  reach out to me on LinkedIn, Twitter or GitHub
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <ContactForm
            className='bg-blueGray-400 p-6 well-shadow shadow-inner rounded-3xl'
            onFinished={setResult}
          />
          <div
            className={`${indieFlower.variable} text-right font-quirky ml-auto mr-3 mt-1 text-xs text-gray-500 dark:text-gray-200`}
          >
            *Don&apos;t forget to be nice{' '}
            <span role='img' aria-label='winky face'>
              😉
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

type ContactFormProps = {
  isDialog?: boolean;
  onFinished?: (value: string) => void;
};

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export const ContactForm: FComp<ContactFormProps> = ({
  className,
  isDialog,
  onFinished
}) => {
  const [count, setCount] = React.useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactFormValues>();
  const onSubmit = (data: ContactFormValues) => {
    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then(({ message }) => {
        if (message === 'SUCCESS') {
          if (onFinished) onFinished('success');
          else console.warn('ContactForm has no onFinished callback');
        }
      })
      .catch((error) => {
        if (onFinished) onFinished('failure');
      });
  };

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) =>
    setCount(event.target.value.length);

  const fieldClasses = (fieldName: keyof ContactFormValues) =>
    errors[fieldName] !== undefined
      ? `placeholder-red-500 focus:ring-red-500 border-red-500 border`
      : `placeholder-gray-500 focus:ring-lt-primary-lighter  ${
          isDialog
            ? 'border-coolGray-200 border-2'
            : 'border-transparent border'
        }`;

  return (
    <form
      className={`relative h-full  text-blueGray-700 ${className}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* {sent ? (
        <div className="absolute flex flex-col p-6 justify-center rounded-3xl items-center text-blueGray-500 bg-blur-50 inset-1">
          <div>
            <EnvelopeIcon className="inline h-28" />
            <CheckmarkIcon className="inline h-28" />
          </div>
          <div className="text-4xl text-center py-10">
            All done! <span className="block">Thanks for reaching out.</span>
          </div>
        </div>
      ) : null} */}

      <div>
        <label htmlFor='full_name' className='sr-only'>
          Full name
        </label>
        <input
          type='text'
          className={`block w-full py-3 px-4 mb-4 bg-lt-bg-lightest rounded-md ${fieldClasses(
            'name'
          )}`}
          autoComplete='name'
          placeholder={`${
            errors.name ? '⚠️ You forgot your name' : "What's your name?"
          }`}
          {...register('name', {
            required: 'Please enter your name',
            maxLength: 100
          })}
        />
      </div>
      <div>
        <label htmlFor='email' className='sr-only'>
          Email
        </label>
        <input
          id='email'
          type='email'
          autoComplete='email'
          className={`block w-full py-3 px-4 mb-4 bg-lt-bg-lightest rounded-md  ${fieldClasses(
            'email'
          )}`}
          placeholder={errors.email ? "⚠️ Don't forget your email" : 'Email'}
          {...register('email', {
            required: 'Please enter your email',
            maxLength: 320
          })}
        />
        <div>
          <label htmlFor='message' className='sr-only'>
            Message
          </label>
          <textarea
            id='message'
            rows={4}
            className={`block w-full py-3 px-4 mb-4 bg-lt-bg-lightest rounded-md ${fieldClasses(
              'message'
            )}`}
            placeholder={
              errors.message
                ? "⚠️ Don't be shy, tell me something"
                : 'Tell me everything!*'
            }
            {...register('message', {
              required: 'You forgot to write something',
              maxLength: 2000,
              onChange: handleChange
            })}
          ></textarea>
        </div>
        <div className={`${isDialog ? '' : 'flex justify-between'}`}>
          <div
            className={`text-sm ${
              count >= 2000 ? 'text-error-600' : 'text-blueGray-600'
            } ${isDialog ? 'text-left -mt-2' : ''}`}
          >
            {count >= 2000
              ? `You typed ${-2000 + count} characters too many`
              : `${2000 - count} characters left`}
          </div>
          <div>
            <button
              type='submit'
              className={`flex items-center justify-center ${
                isDialog ? 'w-full py-2 mt-4' : 'py-3 ml-auto px-6 -mb-2'
              } border border-transparent text-base shadow-md font-medium rounded-md text-white bg-lt-primary active:shadow-sm hover:bg-lt-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lt-primary-lighter`}
            >
              <EnvelopeIcon className='h-5 mr-1' />
              Send
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

type SocialSectionProps = {
  noText?: boolean;
};

export const SocialSection: FComp<SocialSectionProps> = ({
  className,
  noText = false
}) => (
  <div className={className}>
    {noText ? null : (
      <p className='pt-4 font-semibold'>Or find me on the web...</p>
    )}
    <div className='flex mt-5 justify-around text-lt-bg dark:text-dk-bg'>
      {Object.entries(accounts).map(([key, account]) => (
        <LogoLink
          key={key}
          url={account.url}
          logo={account.logo}
          alt={`${key} url`}
        />
      ))}
    </div>
  </div>
);

type LogoLinkProps = {
  url: string;
  logo: FComp;
  alt: string;
};

export const LogoLink: FComp<LogoLinkProps> = ({
  className,
  url,
  logo,
  alt
}) => {
  return (
    <Link href={url} aria-label={alt}>
      <div
        className={`hover:cursor-pointer flex rounded-full w-12 h-12 bg-blueGray-400 overflow-hidden well-shadow ${className}`}
      >
        {React.createElement(logo, {
          className: 'm-auto  fill-current w-10 h-10'
        })}
      </div>
    </Link>
  );
};
