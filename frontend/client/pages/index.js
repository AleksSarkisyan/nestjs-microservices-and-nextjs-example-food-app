import { useState } from "react";

export default function Home({ user }) {

  return (
    <div>{user.token.email}</div>
  )
}

export async function getServerSideProps() {
  // Direct call to external API
  // const options = {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     email: 'webi.aleks@gmail.com',
  //     password: 'test123'
  //   }),
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  // }
  // const response = await fetch('http://localhost:3001/api/v1/user/login', options);
  // const user = await response.json();
  // console.log('user is', user)

  // Using Nest js API routes
  let response = await fetch('http://localhost:3000/api/hello')
  const user = await response.json();
  console.log('user is', user)

  const products = [
    {
      "productId": 6,
      "quantity": 2
    },
    {
      "productId": 4,
      "quantity": 1
    },
    {
      "productId": 5,
      "quantity": 1
    },
    {
      "productId": 79,
      "quantity": 3
    }
  ];
  const orderData = {
    products,
    restaurantId: 7
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(orderData),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${user.token.accessToken}`
    },
  }

  // Direct call
  let createOrder = await fetch('http://localhost:3001/api/v1/order/create', options)
  const createOrderResult = await createOrder.json();
  const redirectUrl = createOrderResult.stripeRedirectUrl

  return {
    redirect: {
      destination: redirectUrl,
      permanent: false,
    },
    props: {
      user
    },
  };
}