import React from 'react'

const AuthLayout = ({
    children
}:{children: React.ReactNode}) => {
  return (
    <div className="h-full min-h-screen flex items-center px-2 justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 to-gray-100 ">{children}</div>
  )
}

export default AuthLayout