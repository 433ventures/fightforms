'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@app/components/ui/button'
import { Input } from '@app/components/ui/input'
import { Label } from '@app/components/ui/label'

export type ApplicationFormData = {
  amount: string;
  purpose: string;
  employment: string;
}

type Props = {
  name: string;
  initialValues?: ApplicationFormData;
  onCommit: (data: ApplicationFormData) => void;
  loading?: boolean;
}

export const ApplicationForm: React.FC<Props> = ({ onCommit, name, initialValues, loading }) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    amount: '',
    purpose: '',
    employment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically validate the form and maybe send the data to an API
    onCommit(formData)
  }

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues)
    }
  }, [initialValues]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-md w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">{`${name}, provide a response to the following questions`}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="loanAmount" className="text-white">Desired loan amount</Label>
            <Input
              id="loanAmount"
              name="amount"
              type="text"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="propertyValue" className="text-white">Loan Purpose</Label>
            <Input
              id="propertyValue"
              name="purpose"
              type="text"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="employmentStatus" className="text-white">Employment status</Label>
            <Input
              id="employmentStatus"
              name="employment"
              type="text"
              value={formData.employment}
              onChange={(e) => setFormData({ ...formData, employment: e.target.value })}
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