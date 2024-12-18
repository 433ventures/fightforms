'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@app/components/ui/button'
import { Input } from '@app/components/ui/input'
import { Label } from '@app/components/ui/label'
import { TextArea } from '@app/components/ui/textarea';

export type ApplicationFormData = {
  amount: string;
  due_date: string;
  purpose: string;
  business_name: string;
  business_description: string;
  business_operating_duration: string;
  business_turnover: string;
}

type Props = {
  name: string;
  initialValues: ApplicationFormData;
  onCommit: (data: ApplicationFormData) => void;
  loading?: boolean;
}

export const ApplicationForm: React.FC<Props> = ({ onCommit, name, initialValues, loading }) => {
  const [formData, setFormData] = useState<ApplicationFormData>(initialValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCommit(formData)
  }

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues)
    }
  }, [JSON.stringify(initialValues)]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-md w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">{`${name}, provide a response to the following questions`}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="loanAmount" className="text-white">How much are you looking to borrow?</Label>
            <Input
              id="loanAmount"
              name="amount"
              type="text"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="dueDate" className="text-white">When are you looking to have the funds?</Label>
            <Input
              id="dueDate"
              name="due_date"
              type="text"
              value={formData.due_date}
              onChange={(e) => setFormData({...formData, due_date: e.target.value})}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="purpose" className="text-white">What is the finance for?</Label>
            <Input
              id="purpose"
              name="purpose"
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="businessName" className="text-white">What is the name of your business?</Label>
            <Input
              id="businessName"
              name="business_name"
              type="text"
              value={formData.business_name}
              onChange={(e) => setFormData({...formData, business_name: e.target.value})}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="businessDescription" className="text-white">
              Can you provide a brief description of what it does?
            </Label>
            <TextArea
              id="businessDescription"
              name="business_description"
              value={formData.business_description}
              onChange={(e) => setFormData({...formData, business_description: e.target.value})}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="business_operating_duration" className="text-white">
              How long has your business been operating?
            </Label>
            <Input
              id="business_operating_duration"
              name="business_operating_duration"
              type="text"
              value={formData.business_operating_duration}
              onChange={(e) => setFormData({...formData, business_operating_duration: e.target.value})}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="business_turnover" className="text-white">
              How much did your business turnover last year?
            </Label>
            <Input
              id="business_turnover"
              name="business_turnover"
              type="text"
              value={formData.business_turnover}
              onChange={(e) => setFormData({...formData, business_turnover: e.target.value})}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Commit and Send'}
          </Button>
        </form>
      </div>
    </div>
  )
}