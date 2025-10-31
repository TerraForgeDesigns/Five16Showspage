
import React, { useState, FormEvent } from 'react';
import { useToasts } from '../App'; // Assuming App exports this context hook

export const VendorForm: React.FC = () => {
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    services: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToasts();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Vendor Inquiry Submitted:', formData);
      setIsSubmitting(false);
      addToast('Your inquiry has been received!', 'success');
      setFormData({ company: '', contact: '', email: '', phone: '', services: '', notes: '' });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-gray-800/30 p-8 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField id="company" name="company" label="Company Name" value={formData.company} onChange={handleChange} required />
        <InputField id="contact" name="contact" label="Contact Person" value={formData.contact} onChange={handleChange} required />
        <InputField id="email" name="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} required />
        <InputField id="phone" name="phone" type="tel" label="Phone Number" value={formData.phone} onChange={handleChange} />
      </div>
      <div>
        <InputField id="services" name="services" label="Services Offered (comma-separated)" value={formData.services} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-five16-mint mb-2">Additional Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="w-full bg-gray-900/50 border-gray-700 rounded-md shadow-sm focus:ring-five16-teal focus:border-five16-teal transition"
        ></textarea>
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-five16-teal text-five16-dark font-bold py-3 px-4 rounded-md hover:bg-five16-mint transition-colors disabled:bg-gray-500"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </div>
    </form>
  );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-five16-mint mb-2">{label}</label>
    <input
      id={id}
      {...props}
      className="w-full bg-gray-900/50 border-gray-700 rounded-md shadow-sm focus:ring-five16-teal focus:border-five16-teal transition"
    />
  </div>
);
