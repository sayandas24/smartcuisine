import React from 'react'

interface WelcomeBackEmailProps {
  name: string;
}

export default function WelcomeBackEmail({ name }: WelcomeBackEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#4A5568', marginBottom: '24px' }}>Welcome Back, {name}!</h1>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#2D3748', marginBottom: '16px' }}>
        We&apos;re thrilled to see you again! Thank you for continuing to trust us with your dining experience.
      </p>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#2D3748', marginBottom: '16px' }}>
        Your loyalty means a lot to us, and we&apos;re committed to providing you with exceptional service and delicious meals.
      </p>
      
      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E2E8F0' }}>
        <p style={{ fontSize: '14px', color: '#718096' }}>
          If you have any questions, feel free to contact us anytime.
        </p>
      </div>
    </div>
  )
}
