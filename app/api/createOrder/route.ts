import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    // Obtain access token
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`Aen_P8ES2FyzvzKaUhi8eKFVvHND88D3WQrgoeqb28rYP68b9apLNeO0n5QXOfQLfTHao3D_QS90c0yZ:EBk7y9RMQulOLLxz0-0jhxphJ9K-RUaCT-l81qJkhaTpJTo3DBDQTeuB9vFaD6ZKIPxjcbkXV4RiZXlR`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Error obtaining access token:', errorData);
      throw new Error('Failed to obtain access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create PayPal order
    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating order:', errorData);
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
  }
}
