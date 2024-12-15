'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { useMutation } from '@apollo/client';

import { WelcomeScreen } from '../../forms/welcome'
import { ContactForm, ContactFormData } from '../../forms/contact';

import { Layout } from '@app/components/ui/layout';
import Loader from './loader';
import CREATE_APPLICATION_MUTATION from './graphql/createApplication.mutation';

export function MainPage() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [, startTransition] = useTransition()
  const [fadeOut, setFadeOut] = useState(false);

  const [createApplicationMutation] = useMutation(CREATE_APPLICATION_MUTATION);

  const handleScreenChange = (screen: string) => {
    setFadeOut(true)
    setTimeout(() => {
      startTransition(() => {
        setCurrentScreen(screen)
        setFadeOut(false)
      })
    }, 300) // This should match the transition duration in CSS
  }

  const createSession = async (data: ContactFormData) => {
    handleScreenChange('loading');

    console.log(data);
    try {
      const response = await createApplicationMutation({
        variables: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          useAI: data.useAI,
        }
      });

      if (response.data.createApplication) {
        router.push(`/${response.data.createApplication.id}${data.useAI ? '/live' : ''}`);
      } else {
        handleScreenChange('contact');
      }
    } catch (e) {
      console.error(e);
      handleScreenChange('contact');
    }
  }

  return (
    <Layout fadeOut={fadeOut}>
        {currentScreen === 'welcome' && <WelcomeScreen onApplyNow={() => handleScreenChange('contact')} />}
        {currentScreen === 'contact' && <ContactForm onNext={createSession} />}
        {currentScreen === 'loading' && <Loader />}
    </Layout>
  )
}