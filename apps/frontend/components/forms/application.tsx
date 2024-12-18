'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@app/components/ui/button'
import { Input } from '@app/components/ui/input'
import { TextArea } from '@app/components/ui/textarea';
import { Label } from '@app/components/ui/label'
import { PhoneCall } from 'lucide-react'
import Image from 'next/image';

export type ApplicationFormData = {
  amount: string;
  due_date: string;
  purpose: string;
  business_name: string;
  business_description: string;
  business_operating_duration: string;
  business_turnover: string;
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

type Props = {
  name: string;
  answers: { id: string, questionId: string; answer: string }[];
  questions: { id: string; inputName: string; question: string }[];
  currentQuestionId?: string;
  onCommit: () => void;
}

export const ApplicationForm: React.FC<Props> = ({
                                                   onCommit,
                                                   name,
                                                   answers,
                                                   questions,
                                                   currentQuestionId
                                                 }) => {

  const [isAnimating, setIsAnimating] = useState(false);

  const [formData, setFormData] = useState<ApplicationFormData>(defaultFormData);

  useEffect(() => {
    setIsAnimating(true);
    const timeoutId = setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [currentQuestionId]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // Here you would typically validate the form and maybe send the data to an API
  //   onCommit()
  // }

  useEffect(() => {
    if (answers) {
      const newFormData = { ...formData };
      answers.forEach((item) => {
        const question = questions.find(q => q.id === item.questionId);
        if (!question) {
          return;
        }
        newFormData[question.inputName as keyof ApplicationFormData] = item.answer;
      });

      setFormData(newFormData)
    }
  }, [answers, currentQuestionId]);

  const currentQuestion = questions.find(q => q.id === currentQuestionId);
  const currentAnswer = currentQuestionId && currentQuestionId in formData ?
    formData[currentQuestionId as keyof ApplicationFormData] :
    undefined;

  const allQuestionsAnswered = questions.every(q => q.id in formData && formData[q.id as keyof ApplicationFormData] !== '');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-md w-full max-w-md text-white">
        {!allQuestionsAnswered && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">{name}, we are calling you.</h2>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <PhoneCall size={48} className="text-white"/>
              <div className="relative" style={{ width: 24, height: 24, top: -20, left: -14 }}>
                <Image
                  src="/ai_stars_white.svg"
                  width={24}
                  height={24}
                  alt="Picture of the author"
                  className="text-white animate-pulse"
                />
              </div>
            </div>
          </>
        )}
        {!allQuestionsAnswered ? (
          <div className={`space-y-4 transition-opacity duration-300 ease-in-out ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          } ${currentQuestion ? 'animate-fadeInUp' : ''}`}>
            {currentQuestion && (
              <div>
                <Label htmlFor={currentQuestion.id} className="text-white">{currentQuestion.question}</Label>
                {currentQuestion.id === 'business_description' ? (
                  <TextArea
                    id={currentQuestion.id}
                    value={currentAnswer}
                    onChange={(e) => setFormData({
                      ...formData,
                      [currentQuestionId as keyof ApplicationFormData]: e.target.value
                    })}
                    required
                    className="bg-white/10 text-white placeholder-white/50 border-white/20"
                  />
                ): (
                  <Input
                    id={currentQuestion.id}
                    type="text"
                    value={currentAnswer}
                    onChange={(e) => setFormData({
                      ...formData,
                      [currentQuestionId as keyof ApplicationFormData]: e.target.value
                    })}
                    required
                    className="bg-white/10 text-white placeholder-white/50 border-white/20"
                  />
                )}
              </div>
            )}
            <Button className="w-full">
              Next
            </Button>
          </div>
        ) : (
          <div className="text-center animate-fadeInUp">
            <h2 className="text-2xl font-bold mb-4">Thank you for your time. Please verify and submit application.</h2>
          </div>
        )}
        {answers.length > 0 && (
          <div className="mt-8 pt-8 border-t border-white/20">
            <h3 className="text-xl font-semibold mb-4">Your Application</h3>
            {answers.map((item) => {
              const question = questions.find(q => q.id === item.questionId);
              if (!question) {
                return null;
              }

              const value = question.inputName in formData ? formData[question.inputName as keyof ApplicationFormData] : item.answer;

              return (
                <div key={item.id} className="mb-2 transition-all duration-300 ease-in-out">
                  <Label
                    htmlFor={`edit-${item.id}`}
                    className="font-medium">
                    {question.question}:
                  </Label>
                  {question.inputName === 'business_description' ? (
                    <TextArea
                      id={`edit-${item.id}`}
                      value={value}
                      onChange={(e) => setFormData({
                        ...formData,
                        [question.inputName]: e.target.value
                      })}
                      className="bg-white/10 text-white placeholder-white/50 border-white/20 mt-1"
                    />): (
                    <Input
                      id={`edit-${item.id}`}
                      value={value}
                      onChange={(e) => setFormData({
                        ...formData,
                        [question.inputName]: e.target.value
                      })}
                      className="bg-white/10 text-white placeholder-white/50 border-white/20 mt-1"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
        {allQuestionsAnswered && (
          <Button onClick={onCommit} className="w-full mt-4">
            Submit application
          </Button>
        )}
      </div>
    </div>
  )
}