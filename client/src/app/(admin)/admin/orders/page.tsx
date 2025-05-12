import AdminOrders from '@/components/admin/orders/AdminOrders'
import PendingOrders from '@/components/admin/orders/PendingOrders'
import React from 'react'

export default function page() {


  return (
    <div> 
      <PendingOrders/>
      <AdminOrders/>
      {/* <AdminOrders/>
      <AdminOrders/> */}
    </div>
  )
}
