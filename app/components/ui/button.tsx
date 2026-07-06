'use client'

import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'

type ButtonVariant = 'default' | 'outline'
type ButtonSize = 'default' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

function getVariantClass(variant: ButtonVariant) {
  return variant === 'outline' ? 'button-outline' : 'button-default'
}

function getSizeClass(size: ButtonSize) {
  return size === 'icon' ? 'button-icon' : 'button-default-size'
}

export const Button = forwardRef(function Button(
  { className, variant = 'default', size = 'default', type = 'button', ...props }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const classes = ['button', getVariantClass(variant), getSizeClass(size), className].filter(Boolean).join(' ')

  return <button ref={ref} type={type} className={classes} {...props} />
})

Button.displayName = 'Button'
