'use strict';

const 

const MOCK_NUTRITION_UPDATES =  [

  {
    'Name': 'Wild Rice',
    'Serving Size': 1,
    'Fat': 10,
    'Carbs': 30,
    'Protein': 25,
    'Total Calories': 300
  },
  {
    'Name': 'Apple',
    'Serving Size': 1,
    'Fat': 10,
    'Carbs': 25,
    'Protein': 15,
    'Total Calories': 200
  },
  {
    'Name': 'Potato',
    'Serving Size': 1,
    'Fat': 10,
    'Carbs': 25,
    'Protein': 15,
    'Total Calories': 200
  },
  {
    'Name': 'Turkey',
    'Serving Size': 1,
    'Fat': 10,
    'Carbs': 25,
    'Protein': 15,
    'Total Calories': 200
  }
];

console.table(MOCK_NUTRITION_UPDATES);
//functions to show representation of data
//4 views (5 including 'about')



// ===== Landing Page View ===== (get all)
// add CREATE ENTRY button for landing page
//ajax call to get all food items from db
//send back to user

//render landing view
//template function for landing page view
//way to listen for user interaction (part of template?)
//handler to handle event



// ===== Detail View ===== (single ID get)
//ajax call to get specific item from db
//send renderered data

//render detail view
//template function for detail view



// ===== Create View ===== (post)

//user interaction (even listen for click on item create button)
//render create view
//user submits
//listen for submit and grab values from input

//send ajax call with data to db (to have db capture data and for data to be verified)
//response from db is object of newly created item from db
//render user friendly detail view of newly submitted data



// ===== Edit View =====  (put)

//ajax call to get specific item from db (from detail view)
//listen for user click on edit
//render edit view
//listen for submit and grab values from input

//send ajax call with data to db (to have db capture data and for data to be verified)
//response from db is object of newly edited item from db
//render user friendly detail view of newly submitted data



// ===== Delete View =====  (delete)
//ajax call to get specific item from db (from detail view)
//listen for user click on delete

//render delete confirm view
//user confirms and landing page view is rendered
