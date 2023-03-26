// Get current date in order to set default values for date inputs
const currentDate = new Date().toJSON().slice(0, 10);

Vue.createApp({
  data() {
    return {
      nextId: 1,
      // The input form
      input: {
        expense: '',
        cost: '',
        date: currentDate,
        category: ''
      },
      // All expenses
      expenses: [],
      // Filter properties
      categoryFilter: 'All',
      dateSpanFilter: false,
      dateStartFilter: '',
      dateEndFilter: ''
    }
  },
  methods: {
    addExpense() {
      this.expenses.push({
        id: this.nextId++,
        expense: this.input.expense,
        cost: this.input.cost,
        date: this.input.date,
        category: this.input.category
      });

      this.input.expense = '';
      this.input.cost = '';
      this.input.date = currentDate;
      this.input.category = '';
    },
    removeExpense(id) {
      let index = this.expenses.findIndex(e => e.id === id);
      this.expenses.splice(index, 1);
    },
    async initializeExpenses() {
      // Loads the dummy data from expenses.json
      let response = await fetch('./json/expenses.json');
      let json = await response.json();

      for (const e of json) {
        this.expenses.push({
          id: this.nextId++,
          expense: e.expense,
          cost: e.cost,
          date: e.date,
          category: e.category
        });
      }
    }
  },
  computed: {
    // Sets the filteredExpenses computed property to the selected filter.
    // If all: get all expenses from the expenses array.
    filteredExpenses() {
      let filtered = [];

      // Filter by category
      if (this.categoryFilter === 'All') {
        filtered = this.expenses;
      }
      else {
        filtered = this.expenses.filter(e => e.category === this.categoryFilter);
      }

      // Filter by date span
      if (this.dateSpanFilter && (this.dateStartFilter != '' && this.dateEndFilter != '')) {
        filtered = filtered.filter(e => e.date >= this.dateStartFilter && e.date <= this.dateEndFilter);
      }

      return filtered;
    },
    // Calculates the total sum of the current visible expenses
    totalSum() {
      let sum = 0;

      for (const expense of this.filteredExpenses) {
        sum += expense.cost;
      }

      return sum;
    }
  },
  beforeMount() {
    // Calls initializeExpenses before mounting the vue application
    this.initializeExpenses();
  }
}).mount('#app');