import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  name: String,
  value: Number,
  group: String,
  subgroup: { type: mongoose.Schema.Types.ObjectId, ref: "BudgetGroup" },
  timestamp: Date,
});

const budgetGroupSchema = new mongoose.Schema({
  name: String,
  subgroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "BudgetGroup" }],
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  expenses: [expenseSchema],
  budgetGroups: [budgetGroupSchema],
});

export const Expense = mongoose.model("Expense", expenseSchema);
export const BudgetGroup = mongoose.model("BudgetGroup", budgetGroupSchema);
export const User = mongoose.model("User", userSchema);
