// Load schedule
async function loadSchedule(day) {
	try {
    // Add a cache-busting parameter to the URL
    const cacheBuster = new Date().getTime();
    const url = `config/${day}.txt?cache=${cacheBuster}`;

    const response = await fetch(url);
		var schedule = await response.text();
		return schedule;
	} catch (error) {
		console.error(`Error loading schedule for ${day}:`, error);
		return null;
	}
}

// Replace placeholders in the entire document
function replacePlaceholders() {
	walk(document.body, config);
}

// Recursively walk through all child nodes of an element
function walk(node, config) {
	if (node.nodeType === 1) {
		// Element node
		for (var i = 0; i < node.childNodes.length; i++) {
			walk(node.childNodes[i], config);
		}
	} else if (node.nodeType === 3) {
		// Text node
		replaceText(node, config);
	}
}

// Replace placeholders in a text node
function replaceText(node, config) {
	var content = node.nodeValue;

	var replacedContent = content.replace(
		/\{\{([^}]+)\}\}/g,
		function (match, p1) {
			return config.placeholders[p1] || match;
		}
	);

	node.nodeValue = replacedContent;
}

// Generate a table for a given day
async function generateTable(containerId) {
	var tableContainer = document.getElementById(containerId);
	var day = tableContainer.dataset.day; // Get day from data-day attribute

	var table = document.createElement("table");
	table.style.width = "100%";
	tableContainer.appendChild(table);

	var colgroup = document.createElement("colgroup");
	var col1 = document.createElement("col");
	col1.style.width = "16%";
	var col2 = document.createElement("col");
	col2.style.width = "84%";
	colgroup.appendChild(col1);
	colgroup.appendChild(col2);
	table.appendChild(colgroup);

	var tbody = document.createElement("tbody");
	table.appendChild(tbody);

	var schedule = await loadSchedule(day);
	console.log("schedule", schedule);
	if (schedule) {
		var regex = /(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s+(.*)/g;

		var match;
		while ((match = regex.exec(schedule)) !== null) {
			console.log("match", match[1], match[2]);
			var time = match[1];
			var performer = match[2].trim();

			var row = document.createElement("tr");

			var cell1 = document.createElement("td");
			cell1.textContent = time;
			row.appendChild(cell1);

			var cell2 = document.createElement("td");
			cell2.textContent = performer;
			row.appendChild(cell2);

			tbody.appendChild(row);
		}
	} else {
		console.error(`Schedule not found for ${day}.`);
	}
}

// Replace placeholders in the entire document. See cusotm.js
replacePlaceholders();

// Call the function to generate the table for each day
generateTable("day1Container");
generateTable("day2Container");
if (config.HAS_SCHEDULE && config.HAS_SUNDAY) {
	generateTable("day3Container");
}
