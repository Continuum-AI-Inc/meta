# Getting Started
Ah... This is your first time? How 'bout we get you set up real quick here. Let's start with the basics, [installing](#installation) the basic Meta Compiler.

## Installation
Do you already have [Node JS](https://nodejs.org/en/download/package-manager/) and [NPM]() installed? If you don't, check out their pages, they'll explain everything you need to know, and if you're all set up just check back in, we'll be waiting for you!

Now that you have all the prerequisites installed we can continue, first we need to install the `Metalang` package itself.
```
npm i -g @metalang/core @metalang/cli
```

`Metalang` is divided up into several packages.

- [The Compiler](compiler/index.md)
- [The Debugger](debugger/index.md)
- [The Testing Library](testing/index.md)
- [A Command-Line Interface](cli/index.md)

For now we only need the compiler/core and the CLI. Once these two packages are installed we can head to your favorite directory and run the following command.

```
metalang create --open -y
```

Wow! Would you look at that! We just created our first project using Metalang! Let's go check it out, shall we?

Alright, we've got some directories, but what do they do?

```
.
├── src/
|	└── main.grammar.meta
├── bin/
├── docs/
|	└── index.md
├── tests/
|	└── main.test.txt
├── meta.config.json
├── README.md
└── LICENSE
```

### src/
This is just your typical `src` directory, it contains all the source code for your project, this is where `metalang` will - by default - search for any grammar files.

### docs/
This is where you can store all your documentation that surely you're going to write some day 😉 

`index.md` will serve as the entrypoint to your documentation, it is there to remind you that you actually have something better to do than binge the newest season of your favorite show... We know... We've all been there...

### tests/
Writing tests might be "difficult", "a waste of time" or you might say "i don't need to test my Compiler since i know that i did everything correctly".

To put it politely and to not take your hope before you even got started - you are going to make mistakes!
Lots of them actually... Writing a Compiler is not easy, it's not something you just do in a day or two, it takes time, effort and lots of testing and reiteration on the design of your language.

You want the result to be perfect, don't you?

This is why we built a whole testing/debugging application that allows you to easily identify mistakes, silly errors and design flaws.

The `tests` directory is made for exactly that, it stores all test suites and allows them to be found by `Metalang`, afterall, not everything can be resolved at compile-time...

### meta.config.json
This is where the real fun begins! Config files for days!

For real though, this is where you can change anything and everything about your application. This is where you set options for the Compiler and this is where you can literally make or break your entire application but don't worry, we'll guide you through there...

```json
{
	"compilerOptions": {
		"debugMode": false,
		"performanceMetrics": true,
		"outDir": "bin/",
		"entry": "grammar/index.meta"
	},
	"testingOptions": {
		// This will cause the compiler to output additional debugging information which can be read and interpreted by a debugger.
		"debugMode": false,
		// Whether or not to enable performance metrics, these will tell you about the execution speed of your compiler.
		"performanceMetrics": true,
		// Whether or not to collect code coverage metrics, this will tell you how effective your tests are.
		"coverageMetrics": true,
		// Whether or not to enable compiler optimizations, will result in faster execution but unreadable code.
		"enableOptimizations": false,
		// This will specify the location of a metrics.json file which can be read by our testing application.
		"metricsOutput": "tests/metrics.json",
		"benchmarkOutput": "docs/benchmark.md",
		// Which virtual machine to use when running a test, can either be an NPM package or a URL to a script.
		"virtualMachine": "@metalang/cls-vm",
		// Whether or not to use the Meta Common Language Specification, if this is `false` the virtual machine must be supplied through a URL.
		"useMetaCLS": true
	},
	"watch": true
}
```