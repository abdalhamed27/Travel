import React from 'react';
import { PayPalScriptProvider, PayPalButtons, PayPalButtonsComponentActions } from '@paypal/react-paypal-js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PayPalButtonProps {
    id: string;
    ownerId: any;
    amount: any;
    persons:number;
    phone:string;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ id,ownerId, amount,persons,phone }) => {
    const {data:session}=useSession()
    console.log(persons)
    const router=useRouter()
  const createOrder = async (data: any, actions: PayPalButtonsComponentActions) => {
    try {
      const response = await fetch('/api/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount:amount })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating order:', errorData);
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      return order.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw new Error('Could not create PayPal order');
    }
  };

  const onApprove = async (data: any, actions: PayPalButtonsComponentActions) => {
    try {
      return actions.order.capture().then(async (details: any) => {
        // alert('Transaction completed by ' + details.payer.name.given_name,id,ownerId);
        const responseData = await fetch('/api/createOrder/Join', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
        
            body: JSON.stringify({
                email: session?.user?.email,
                owner_id: ownerId,
                trip_id: id,
                payment_id: details.id,
                persons:persons,
                phone:phone,
                price: details.purchase_units[0].amount.value, // Assuming details is an object with this structure
                Transaction_id: details.purchase_units[0].payments.captures[0].id // Check array indices based on your data structure
              })
            
            
            });
            const {data} = await responseData.json();
                router.push('/Trip')
            


      });
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id":"Aen_P8ES2FyzvzKaUhi8eKFVvHND88D3WQrgoeqb28rYP68b9apLNeO0n5QXOfQLfTHao3D_QS90c0yZ"}}>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
