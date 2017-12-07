'use strict';

const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  name: {type: String, required: true},
  servingSize: {type: Number, required: true},
  fat: {type: Number, required: true},
  carbs: {type: Number, required: true},
  protein: {type: Number, required: true}
//   totalCalories: {type: Number, required: true}
//

});


nutritionSchema.virtual('totalCalories').get(function(){
  return (this.fat*9*this.servingSize)+(this.carbs*4*this.servingSize)+(this.protein*4*this.servingSize);
});

nutritionSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    name: this.name,
    servingSize: this.servingSize,
    fat: this.fat,
    carbs: this.carbs,
    protein: this.protein,
    totalCals: this.totalCalories
  };
};

//creates collection from the model
const FoodNutrition = mongoose.model('FoodNutrition', nutritionSchema);

module.exports =  FoodNutrition;