'use client'

import React from 'react';

import { useSubscription } from '@apollo/client';

import { ApplicationForm, ApplicationFormData } from '../../forms/applicationStatic';

import FIELD_SUBSCRIPTION from './graphql/field.subscription';

type Props = {
  application: { id: string; name: string; answers: { id: string, label: string; answer: string }[] };
  questions: { id: string; question: string }[];
  onCommit: (data: ApplicationFormData) => void;
  loading?: boolean;
}

const ApplicationFormStatic: React.FC<Props> = ({ application, onCommit, loading }) => {
  useSubscription(FIELD_SUBSCRIPTION, {
    onData: ({ data: subscriptionData }) => {
      console.log(`${new Date().toISOString()}: Field updated`, subscriptionData.data.fieldUpdated);
    },
    variables: {
      id: application.id,
    }
  });

  return (
    <ApplicationForm
      name={application.name}
      onCommit={onCommit}
      loading={loading}
      initialValues={{
        amount: application.answers.find((item) => item.label === 'amount')?.answer || '',
        purpose: application.answers.find((item) => item.label === 'purpose')?.answer || '',
        employment: application.answers.find((item) => item.label === 'employment')?.answer || '',
      }}
    />
  )
}

export default ApplicationFormStatic;
