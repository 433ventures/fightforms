'use client'

import React, { useEffect, useState } from 'react';

import { useSubscription } from '@apollo/client';
import { ApplicationForm } from '../../forms/application'

import FIELD_SUBSCRIPTION from './graphql/field.subscription';
import QUESTION_SUBSCRIPTION from './graphql/question.subscription';



type Props = {
  application: { id: string; name: string; answers: { id: string, label: string; answer: string }[] };
  questions: { id: string; question: string }[];
  onCommit: () => void;
}

const ApplicationFormLive: React.FC<Props> = ({ application, questions, onCommit }) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);

  useSubscription(FIELD_SUBSCRIPTION, {
    onData: ({ data: subscriptionData }) => {
      console.log(`${new Date().toISOString()}: Field updated`, subscriptionData.data.fieldUpdated);
    },
    variables: {
      id: application.id,
    }
  });

  useSubscription(QUESTION_SUBSCRIPTION, {
    onData: ({ data: subscriptionData }) => {
      console.log(`${new Date().toISOString()}: Question changed`, subscriptionData.data.questionChanged);
      const question = questions.find(
        (q: { question: string }) => q.question === subscriptionData.data.questionChanged
      );
      setCurrentQuestionId(question?.id ?? null);
    },
    variables: {
      id: application.id,
    }
  });

  useEffect(() => {
    if (questions[0]) {
      setCurrentQuestionId(questions[0].id);
    }
  }, [questions.map((q: { id: string }) => q.id).join(',')]);

  return (
    <ApplicationForm
      name={application.name}
      onCommit={onCommit}
      questions={questions}
      answers={application.answers}
      currentQuestionId={currentQuestionId ?? undefined}
    />
  )
}

export default ApplicationFormLive;
