// Main menu
function mainMenu() {
	let choice = prompt(
		"Chef's favorite meals!\n1. Take Order\n2. View and complete Orders\n3. Exit\nEnter your choice:"
	);
	// main menu choices
	if (choice === "1") {
		takeOrder();
	} else if (choice === "2") {
		showIncompleteOrders();
	} else if (choice === "3") {
		alert("Goodbye!");
	} else {
		alert("Invalid choice. Try again.");
		mainMenu();
	}
}

// Function to take an order
async function takeOrder() {
	let mainIngredient = prompt(
		"Enter the main ingredient of the chef's favorite meal:"
	);

	if (!mainIngredient) return alert("No ingredient entered. Try again!");
	// Validate ingredient input
	mainIngredient = mainIngredient.trim().toLowerCase().replace(/\s+/g, "_");

	try {
		// fetch meals from the API based on the ingredient
		let response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`
		);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		let data = await response.json();

		if (!data.meals) {
			alert("No meals found for that ingredient. Try another.");
			return takeOrder();
		}
		// Randomly select a meal from the list
		let meal = data.meals[Math.floor(Math.random() * data.meals.length)];
		createOrder(meal.strMeal);
	} catch (error) {
		alert(`An error occurred: ${error.message}. Please try again later.`);
		console.error("Error fetching data:", error);
		mainMenu();
	}
}
// Function to create and store the order in sessionStorage
function createOrder(mealName) {
	let orders = JSON.parse(sessionStorage.getItem("orders")) || [];
	let lastOrderNumber =
		parseInt(sessionStorage.getItem("lastOrderNumber")) || 0;

	let newOrder = {
		orderNumber: lastOrderNumber + 1,
		description: mealName,
		status: "incomplete",
	};

	orders.push(newOrder);
	sessionStorage.setItem("orders", JSON.stringify(orders));
	sessionStorage.setItem("lastOrderNumber", newOrder.orderNumber);

	alert(`Order #${newOrder.orderNumber} placed: ${mealName}`);
	mainMenu();
}

// Function to show incomplete orders and mark them as completed
function showIncompleteOrders() {
	let orders = JSON.parse(sessionStorage.getItem("orders")) || [];
	let incompleteOrders = orders.filter(
		(order) => order.status === "incomplete"
	);

	if (incompleteOrders.length === 0) {
		alert("No incomplete orders!");
		mainMenu();
		return;
	}
	// Display incomplete orders
	let orderList = incompleteOrders
		.map((order) => `Order #${order.orderNumber}: ${order.description} `)
		.join("\n");
	let orderNumber = prompt(
		`Incomplete Orders:\n${orderList}\nEnter an order number to complete (or 0 to cancel):`
	);

	if (orderNumber == "0") {
		mainMenu();
		return;
	}
	// Validate order number
	let order = orders.find((order) => order.orderNumber == orderNumber);
	if (!order) {
		alert("Sorry, the order number you have entered is invalid.");
		mainMenu();
		return;
	}
	// Mark order as completed
	order.status = "completed";
	sessionStorage.setItem("orders", JSON.stringify(orders));
	alert(`Order ${orderNumber} is now complete!`);
	mainMenu();
}
