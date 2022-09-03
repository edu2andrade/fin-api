const express = require('express')
const { v4: uuidv4 } = require("uuid")

const app = express();
app.use(express.json());
const customers = []

// middleware to understand json format

//middleware to verify customers taxId
function verifyIfCustomersTaxIdExists(req, res, next) {
  const { taxId } = req.headers

  const customer = customers.find(
    customer => customer.taxId === taxId
  );
  
  if(!customer) {
    return res.status(400).json({ error: 'Customer not found...' })
  };

  req.customer = customer;

  return next();
}

/**
 * taxId --> string
 * name --> string
 * userId --> uuid
 * statement --> []
 */

// Create an account
app.post('/account', (req, res) => {
  const { name, taxId } = req.body;

  const customerAlreadyExists = customers.some(
    customer => customer.taxId === taxId
  )

  if(customerAlreadyExists) {
    return res.status(400).json({ error: 'Customer already exists!' })
  };

  customers.push({
    name,
    taxId,
    userId: uuidv4(),
    statement: []
  });
  return res.status(201).send()
});

// Get the statement
app.get('/statement', verifyIfCustomersTaxIdExists, (req, res) => {
  const {customer} = req;
  return res.json(customer.statement);
})

app.listen('3333');