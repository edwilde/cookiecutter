# TBD

Like Yeoman but much, much simpler. Create boilerplate files/folders based on templates you provide.

TODO: Insert cool CLI gif

TBD supports:
- Multiple templates with the ability to pick which template to use via the CLI.
- Multiple fields per template with the ability to specify them from the CLI.
- Custom validation & error messages for fields.
- Any type of file or folder structure.

TBD doesn't support:
- Conditionals or any other logic in templates. (You can however achieve similiar things by having multiple templates).
- TODO: Add more things this doesn't do

## Quick Setup
First `npm install --save-dev TBD`. You can also install this globally if you prefer.

The add the following to your package.json (no need to do this if you are using yarn):
```json
{
    "scripts": {
        "TBD": "TBD"
    }
}
```
You can now start creating your template. For example if you create a 'templates' folder in your root and add the following template:

```js
// in templates/COMPONENT_NAME.js
import React from 'react';

class COMPONENT_NAME extends React.Component {
    render() {
        return <div>Hello World</div>;
    }
}

export default COMPONENT_NAME;
```

You can now configure TBD to replace the string `COMPONENT_NAME` like so by creating a file in the root of your project called TBD.config.js:
```js
// in TBD.config.js
module.exports = [
    {
        name: "Normal React Component",
        templatePath: "templates/COMPONENT_NAME.js",
        outputPath: "src/components/",
        fields: [
            {
                templateVariable: 'COMPONENT_NAME',
                question: "What is the component's name?",
            }
        ]
    }
];

```

If you now run `npm TBD` you will be prompted to pick which template you'd like to use. After which you will be asked to answer each field's question. It should look something like this:

TODO: Insert gif here of it working.

That's it. TBD now create the following files:

```diff
    - src
      - components
+       - YourComponentName.js
        - OtherComponent.js
        - Etc.js
```

TBD will **never** overwrite any existing files.

## Validating fields / custom validation
To do this you can add `isValid` and a custome `errorMessage` to a fields configuration.
Using the example above you could, for example, ensure component names follow a naming convention.

```diff
// in TBD.config.js
module.exports = [
    {
       name: "Normal React Component",
        templatePath: "templates/COMPONENT_NAME/index.js",
        outputPath: "src/components/",
        fields: [
            {
                templateVariable: 'COMPONENT_NAME',
                question: "What is the component's name?",
+               errorMessage: 'A component must be in PascalCase and can only include letters.',
+               isValid(value) {
+                   return !!value.match(/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/g);
+               }
            }
        ]
    }
];

```

## Multiple templates
You can configure multiple templates and TBD will let you pick which template to use. The template's 'name' is what will be used in the CLI when asking which template to use.

You can specify multiple templates like so:
```js
// in TBD.config.js
module.exports = [
    {
       // Configuration for the 1st template
    },
    {
       // Configuration for the 2nd template
    },
];

```

## Templates with folders
If you specify a folder as a template, then the folder will be created in the output directory as well. This is useful if you have a folder structure such as:

```
- ComponentName
    - index.js
    - styles.css
```
TBD will recursively copy all files within your templates folder and replace any occurences of your specificed fields.

If you don't want this behaviour, specify a file as your template's `templatePath`.

## Contributing
After cloning the repo `yarn install`.

You can play with the cli in the 'playground' folder. To do this, `cd` into it and run `. run.sh`. This is like running the cli once it's published and on npm but allows you to work on it locally.

To run tests run `yarn test`.

## Roadmap/Plans
- [] Offer a set of helpers for validation user input. Esp. for common 'cases' such as snake_case, PascalCase etc.
- [] Create an 'init' script which talks you through setting something up.
- [] Allow users to specify a custom path for their config.
- [] Offer the ability for people to show a message that is only shown AFTER a template is successfuly rendered. This could be helpful for things such as help-text such as: 'You can import this component like so: ...'

## TODO Before Publishing
- [] Finish Readme (make gifs)
- [] Make sure folder/template rendering is recursive in terms of folder structure
- [] Come up with a name
- [] Update yarn.lock (I think there are old deps)