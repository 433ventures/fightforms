'use client'

import React, { useMemo } from 'react';

import { useSubscription } from '@apollo/client';

import { ApplicationForm, ApplicationFormData } from '../../forms/applicationStatic';

import FIELD_SUBSCRIPTION from './graphql/field.subscription';

type Props = {
  application: { id: string; name: string; answers: { id: string, label: string; answer: string }[] };
  questions: { id: string; question: string }[];
  onCommit: (data: ApplicationFormData) => void;
  loading?: boolean;
}

const defaultFormData: ApplicationFormData = {
  amount: '',
  due_date: '',
  purpose: '',
  business_name: '',
  business_description: '',
  business_operating_duration: '',
  business_turnover: '',
};

const ApplicationFormStatic: React.FC<Props> = ({ application, onCommit, loading }) => {
  useSubscription(FIELD_SUBSCRIPTION, {
    onData: ({ data: subscriptionData }) => {
      console.log(`${new Date().toISOString()}: Field updated`, subscriptionData.data.fieldUpdated);
    },
    variables: {
      id: application.id,
    }
  });

  const formInitialValues = useMemo(() =>
    application.answers.reduce<ApplicationFormData>(
      (acc, appAnswer) => {
        if (appAnswer) {
          acc[appAnswer.label as keyof ApplicationFormData] = appAnswer.answer;
        }
        return acc;
      }, defaultFormData), [application.answers]);

  return (
    <ApplicationForm
      name={application.name}
      onCommit={onCommit}
      loading={loading}
      initialValues={formInitialValues}
    />
  )
}

export default ApplicationFormStatic;
