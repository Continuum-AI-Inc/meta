# Meta
Welcome to Meta! This file will be teaching you the basic of the Metalang Compiler and its corresponding debugger and testing framework.

Let's get started, shall we?

## Compile
The first step to take is to compile your first grammar. To do that open the terminal and type the following command:

```
metalang compile
```

That's it! See how a new file has been generated and put into the `bin` directory? This is a `.masm` file, also called `Meta Assembly`, this is what the `Metalang` compiler outputs by default. A `.masm` file can be run by the Virtual Machine integrated into `Metalang`.
If you, however, want to run the file as a binary you can pass the following option to the compiler:

```
metalang compile --binary --mls
```

You might be wondering what `mls` stands for. It is a shorthand for `Meta-LS` or `Metals`, it is a so called `Language Specification` laying the ground rules for our compiler.
Don't worry, you don't have to think about that now, just keep it in the back of your mind for later.

## Debugging