const { compile, compileFile } = require("pug");


const render = (template, variables) => {
    const compiled = compileFile("./templates/" + template + ".pug", { cache: true });

    return compiled(variables);
  }

const renderString = (templateString, variables) => {
  return compile(templateString, { cache: true })(variables);
}

module.exports = {
  render,
  renderString
}
