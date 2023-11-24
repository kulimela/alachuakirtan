// Config
var DEBUG = true;

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
		if (DEBUG) {
			return `
        12:00 PM Welcome
        12:05 PM Opening Remarks
        12:10 PM Keynote
      `;
		} else {
			console.error(`Error loading schedule for ${day}:`, error);
		}
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

		// Replace attributes of the element
		for (var i = 0; i < node.attributes.length; i++) {
			replaceAttribute(node, node.attributes[i], config);
		}
	} else if (node.nodeType === 3) {
		// Text node
		replaceText(node, config);
	}
}

// Replace placeholders in an attribute
function replaceAttribute(element, attribute, config) {
	var value = attribute.value;

	var replacedValue = value.replace(/\{\{([^}]+)\}\}/g, function (match, p1) {
		return config.placeholders[p1] || match;
	});

	element.setAttribute(attribute.name, replacedValue);
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
	table.className = "schedule";
	tableContainer.appendChild(table);

	var colgroup = document.createElement("colgroup");
	var col1 = document.createElement("col");
	var col2 = document.createElement("col");
	colgroup.appendChild(col1);
	colgroup.appendChild(col2);
	table.appendChild(colgroup);

	var tbody = document.createElement("tbody");
	table.appendChild(tbody);

	var schedule = await loadSchedule(day);
	if (schedule) {
		var regex = /(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s+(.*)/g;

		var match;
		while ((match = regex.exec(schedule)) !== null) {
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

// Generate a YouTube playlist for a given container
function generateYoutube(containerElement, url) {
	// Get type from containerElement's data-youtube attribute
	var type = containerElement.dataset.youtube;

	// Generate the iframe
	var iframe = document.createElement("iframe");
	iframe.setAttribute("type", "text/html");
	iframe.setAttribute("src", url);
	iframe.setAttribute("frameborder", "0");
	iframe.setAttribute("allowfullscreen", "allowfullscreen");

	switch (type) {
		case "banner":
			iframe.setAttribute("width", "1170");
			iframe.setAttribute("height", "568");
			break;
		case "inline":
			iframe.setAttribute("width", "540");
			iframe.setAttribute("height", "262");
			break;
	}

	// Add the iframe to the container
	containerElement.appendChild(iframe);
}

// Find each element with data-youtube attribute and generate a YouTube playlist
function generateYoutubes() {
	var youtubeElements = document.querySelectorAll("[data-youtube]");
	for (var i = 0; i < youtubeElements.length; i++) {
		var youtubeElement = youtubeElements[i];
		var url = config.placeholders.YOUTUBE;
		generateYoutube(youtubeElement, url);
	}
}

function processConfig() {
	// Replace placeholders in the entire document
	replacePlaceholders();

	// Call the function to generate YouTube playlists
	generateYoutubes();

	// Call the function to generate the table for each day
	generateTable("day1Container");
	generateTable("day2Container");
	if (config.HAS_SCHEDULE && config.HAS_SUNDAY) {
		generateTable("day3Container");
	}
}

// Wait for config to be loaded
async function waitForConfig() {
	while (typeof config === "undefined") {
		console.log("Waiting...");
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	// Check for document readiness using async/await
	while (document.readyState !== "complete") {
		await new Promise((resolve) => requestAnimationFrame(resolve));
	}

	console.log("Processing...");
	processConfig();
}

// Call the function to wait for config
waitForConfig();
