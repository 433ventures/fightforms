'use client'

import React, { useEffect, useState, useTransition } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Layout } from '@app/components/ui/layout';

import { EndScreen } from '../../forms/end'

import APPLICATION_QUERY from './graphql/application.query';
import ApplicationFormLive from '@app/components/pages/application/live';
import ApplicationFormStatic from '@app/components/pages/application/static';
import SUBMIT_ANSWERS_MUTATION from '@app/components/pages/application/graphql/submitAnswers.mutation';
import { ApplicationFormData } from '@app/components/forms/applicationStatic';

type Props = {
  id: string;
  live?: boolean;
}

export const ApplicationPage: React.FC<Props> = ({ id, live }) => {
  const [currentScreen, setCurrentScreen] = useState('application')
  const [, startTransition] = useTransition()
  const [fadeOut, setFadeOut] = useState(true);

  const handleScreenChange = (screen: string) => {
    setFadeOut(true)
    setTimeout(() => {
      startTransition(() => {
        setCurrentScreen(screen)
        setFadeOut(false)
      })
    }, 300) // This should match the transition duration in CSS
  }

  useEffect(() => {
    setFadeOut(false);
  }, []);

  const { data, loading, error } = useQuery(APPLICATION_QUERY, {
    variables: {
      id,
    }
  });

  const application = data?.application;
  const questions = data?.questions ?? [];

  const [submitMutation, { loading: submitLoading }] = useMutation(SUBMIT_ANSWERS_MUTATION);

  const onSubmit = async (data: ApplicationFormData) => {
    console.log({ data });
    try {
      const answers = questions.map((q: { id: string, inputName: keyof ApplicationFormData}) => ({
        questionId: q.id,
        answer: data[q.inputName] ?? '',
      }));

      await submitMutation({
        variables: {
          id,
          answers,
        }
      });
      handleScreenChange('end');
    } catch (e) {
      console.error(e);
    }
  }


  if (error) {
    return <div>Error: {error.message}</div>;
  }


  if (!application) {
    return <Layout fadeOut />
  }

  return (
    <Layout fadeOut={fadeOut || loading}>
      {currentScreen === 'application' && live && !loading && (
        <ApplicationFormLive
          application={application}
          questions={questions}
          onCommit={() => handleScreenChange('end')}
        />
      )}
      {currentScreen === 'application' && !live && !loading && (
        <ApplicationFormStatic
          application={application}
          questions={questions}
          onCommit={onSubmit}
          loading={submitLoading}
        />
      )}
      {currentScreen === 'end' && <EndScreen />}
    </Layout>
  )
}