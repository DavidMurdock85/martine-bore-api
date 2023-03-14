// Import the necessary module
const { compile, compileFile } = require("pug");

// Define a function to render a Pug template file with variables
const render = (template, variables) => {
  // Compile the Pug file into a function
  const compiled = compileFile("./templates/" + template + ".pug", { cache: true });

  // Call the compiled function with the provided variables and return the result
  return compiled(variables);
}

// Define a function to render a Pug template string with variables
const renderString = (templateString, variables) => {
  // Compile the Pug string into a function
  return compile(templateString, { cache: true })(variables);
}

// Export the two rendering functions for use in other modules
module.exports = {
  render,
  renderString
}