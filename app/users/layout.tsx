import React from 'react'
import SideBar from '../components/sidebar/SideBar'

const UsersLayout = async ({children}: {children: React.ReactNode}) => {
  return (
    <SideBar>
        <div className='h-full'>{children}</div>
    </SideBar>
  )
}

export default UsersLayout