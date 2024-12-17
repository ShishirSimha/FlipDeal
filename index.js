const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

const TAX_RATE = 5;
const DISCOUNT_RATE = 10;
const LOYALTY_RATE = 2;

// Define the endpoint cart-total
app.get('/cart-total', (req, res) => {
  // Extract and parse newItemPrice and cartTotal from query parameters
  const newItemPrice = parseFloat(req.query.newItemPrice) || 0;
  const cartTotal = parseFloat(req.query.cartTotal) || 0;

  // Calculate the total cart value
  const totalCartValue = newItemPrice + cartTotal;

  // Return the result as a string
  res.send(totalCartValue.toString());
});

// Define the endpoint cart-total
app.get('/membership-discount', (req, res) => {
  // Extract and parse cartTotal and isMember from query parameters
  const cartTotal = parseFloat(req.query.cartTotal) || 0;
  const isMember = req.query.isMember === 'true'; // Convert query param to boolean

  // Define discount percentage
  const discountPercentage = isMember ? DISCOUNT_RATE : 0; // 10% discount for members

  // Calculate the final price
  const discountAmount = (cartTotal * discountPercentage) / 100;
  const finalPrice = cartTotal - discountAmount;

  // Return the final price as a string
  res.send(finalPrice.toString());
});

//Define end point calculate-tax
app.get('/calculate-tax', (req, res) => {
  //Extract the total amount
  const cartTotal = parseFloat(req.query.cartTotal);

  //calculate final price
  let taxAmount = (cartTotal * TAX_RATE) / 100;
  const finalPrice = cartTotal + taxAmount;

  //Return string as the final price
  res.send(finalPrice.toString());
});

//Define end point for shipping
app.get('/estimate-delivery', (req, res) => {
  const shippingMethod = req.query.shippingMethod.toLowerCase();
  const distance = parseFloat(req.query.distance);

  let perDayDistance = 1;
  if (shippingMethod === 'standard') {
    perDayDistance = 50;
  } else if (shippingMethod === 'express') {
    perDayDistance = 100;
  } else {
    throw Error('Invalid Shippung Method');
  }

  let estimatedDeliveryDays = distance / perDayDistance;

  res.send(estimatedDeliveryDays.toString());
});


//Define API for cost of shipping
app.get('/shipping-cost', (req, res) => {

  const weight = parseFloat(req.query.weight);
  const distance = parseFloat(req.query.distance);

  let cost = weight * distance * 0.1;
  res.send(cost.toString());

});

app.get('/loyalty-points', (req, res) => {

  const purchaseAmount = parseFloat(req.query.purchaseAmount);

  let loyaltyPoints = purchaseAmount * LOYALTY_RATE;
  res.send(loyaltyPoints.toString());

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
