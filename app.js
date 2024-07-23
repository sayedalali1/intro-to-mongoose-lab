const prompt = require('prompt-sync')();
const connectToDatabase = require('./config/database');
const Customer = require('./models/model');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const app = express();

const username = prompt('What is your name? ');
console.log(`Your name is ${username}`);

const options = [
    'Create a customer',
    'View all customers',
    'Update a customer',
    'Delete a customer',
    'Quit'
];

const showOptions = () => {
  console.log('What would you like to do?');
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });
};

const addNewCustomer = async () => {
  const customerName = prompt(`What is the customer's new name? `);
  const customerAge = prompt(`What is the customer's age? `);

  let customer = {
    name: customerName,
    age: customerAge
  };

  const newCustomer = await Customer.create(customer);
  console.log(`Customer Details: ID ${newCustomer.id}, Name: ${newCustomer.name}, Age: ${newCustomer.age}`);
};

const viewAllCustomers = async () => {
  const customers = await Customer.find();
  if (customers.length === 0) {
    console.log('No customers found.');
  } else {
    console.log('Customers:');
    customers.forEach(customer => {
      console.log(`ID: ${customer.id}, Name: ${customer.name}, Age: ${customer.age}`);
    });
  }
};

const updateCustomer = async () => {
  const customers = await Customer.find();
  if (customers.length === 0) {
    console.log('No customers found.');
    return;
  }

  console.log('Customers:');
  customers.forEach(customer => {
    console.log(`ID: ${customer.id}, Name: ${customer.name}, Age: ${customer.age}`);
  });

  const customerId = prompt('Enter the ID of the customer you want to update: ');
  const customer = await Customer.findById(customerId);
  if (!customer) {
    console.log('Customer not found.');
    return;
  }

  const customerName = prompt(`Enter the new name for the customer (current: ${customer.name}): `);
  const customerAge = prompt(`Enter the new age for the customer (current: ${customer.age}): `);

  customer.name = customerName
  customer.age = customerAge 

  await customer.save();
  console.log(`Customer updated: ID: ${customer.id}, Name: ${customer.name}, Age: ${customer.age}`);
};

const deleteCustomer = async () => {
  const customers = await Customer.find();
  if (customers.length === 0) {
    console.log('No customers found.');
    return;
  }

  console.log('Customers:');
  customers.forEach(customer => {
    console.log(`ID: ${customer.id}, Name: ${customer.name}, Age: ${customer.age}`);
  });

  const customerId = prompt('Enter the ID of the customer you want to delete: ');
  const customer = await Customer.findByIdAndDelete(customerId);
  if (!customer) {
    console.log('Customer not found.');
  } else {
    console.log(`Customer deleted: ID ${customer.id}, Name: ${customer.name}, Age: ${customer.age}`);
  }
};

const handleChoice = async (choiceIndex) => {
  if (choiceIndex === 0) {
    await addNewCustomer();
  } else if (choiceIndex === 1) {
    await viewAllCustomers();
  } else if (choiceIndex === 2) {
    await updateCustomer();
  } else if (choiceIndex === 3) {
    await deleteCustomer();
  } else if (choiceIndex === 4) {
    console.log('Exiting...');
    process.exit(0);
  } else {
    console.log('Invalid choice');
  }
};

const main = async () => {
  await connectToDatabase();
  showOptions();
  const choice = prompt('Number of action to run: ');
  const choiceIndex = parseInt(choice) - 1;

  await handleChoice(choiceIndex);
  main();
};

main();