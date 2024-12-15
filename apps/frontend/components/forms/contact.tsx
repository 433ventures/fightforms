'use client'

import { useState } from 'react'
import { Button } from '@app/components/ui/button'
import { Input } from '@app/components/ui/input'
import { Label } from '@app/components/ui/label'

export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  useAI: boolean;
}

type Props = {
  onNext: (data: ContactFormData) => void
}

export const ContactForm: React.FC<Props> = ({ onNext }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    useAI: true,
  });

  const handleChange = (key: keyof ContactFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [key]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-md w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">What&apos;s your name?</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">What&apos;s your email?</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-white">Phone number?</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              required
              className="bg-white/10 text-white placeholder-white/50 border-white/20"
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              checked={formData.useAI}
              onChange={() => setFormData({ ...formData, useAI: !formData.useAI })}
              className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-checkbox"
              className="ms-2 text-sm font-medium dark:text-gray-300 text-white"
            >
              I would like an AI to call me and help complete my application.
            </label>
          </div>
          <Button type="submit" className="w-full">
            Next
          </Button>
        </form>
      </div>
    </div>
  )
}