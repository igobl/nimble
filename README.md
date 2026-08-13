# Nimble

I needed a set of tools to carry out some tasks that I could trust. For example, if I want to prettyfy some json that contains sensitive information, I do not want to send that json to some online formatter that I have no control of. Instead I built this which is running on my local machine in docker ensuring I have the tools I need to help me day to day that without compromising on data security.

This app is designed for functionality over aesthetics - simple tools that get the job done efficiently. I am also not a react developer :D 

## What is Nimble?

Nimble is a toolkit of straightforward utilities that help with common data processing tasks. It's not meant to be beautiful or showcase-worthy, but rather to be a reliable set of tools you can count on when you need to quickly transform or filter data.

## Available Tools

### CSV Substitution Tool
Transform CSV data using pattern substitution with numbered placeholders like `{0}`, `{1}`, `{2}`, etc. Perfect for quickly reformatting data or creating SQL queries from CSV files.

### Line Removal Tool
Remove lines from text that contain specific IDs. Useful for filtering scripts, log files, or any text data where you need to exclude entries based on a list of identifiers.

### JSON Prettyfier
Format a json string and display it in a readable way, allowing for easy inspection of json objects.

![JSON Prettifier screenshot](images/jsonpretty.png)

### JSON to CSV
Paste a JSON payload (a raw array or a nested object), pick which fields to extract, and copy or download a CSV. Field checkboxes are discovered from the selected row array; extra dotted paths can be added by hand.


## Getting Started

### Easiest way (no terminal)

You only need to do this once: install Node.js from [https://nodejs.org](https://nodejs.org) (the LTS version).

Then double-click:

- **Mac:** `Start Nimble.command`
- **Windows:** `Start Nimble.bat`

The first launch can take a few minutes. A browser window should open at [http://localhost:3000](http://localhost:3000). Leave the window that opened until you are finished, then close it to stop the app.

If macOS says the file cannot be opened, right-click it → **Open**, and confirm.

### From the terminal

Prerequisites: Node.js (version 14 or higher) and npm.

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Philosophy

This app follows a "function over form" approach:
- **Runs locally**: Control over where potentially sensitive data is sent
- **Simple and direct**: No unnecessary complexity
- **Fast and reliable**: Tools that work when you need them
- **Practical focus**: Each tool solves a real, common problem
- **Minimal UI**: Clean interfaces that don't get in the way

## Contributing

Feel free to add new tools that follow the same philosophy - simple, practical utilities that solve common data processing problems.

## Built With

- [React](https://reactjs.org/) - Frontend framework
- [Create React App](https://github.com/facebook/create-react-app) - Build tool
- [React Router](https://reactrouter.com/) - Navigation
