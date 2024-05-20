# hero-cli

A simple CLI for scaffolding projects.

## Installation

```bash
npm install -g hero-cli
```

## Usage

```bash
hero <command> [options]
```

# Commands

- ```create <project-name>```: Create a new project.
  - ```-t --template [template]```: Input template name.
  - ```-f --force```: Overwrite target directory if it exists.
  - ```-i --ignore```: Ignore the template.json file.
- ```ls```: List all the templates.

- ```-v, --version```: Check version number.

## Help

You can use ```hero --help``` for detailed usage of given command.

## License

MIT