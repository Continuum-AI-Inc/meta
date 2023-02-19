# Syntax

## Variables
Variables can be used to store information about the currently executing program in a central point that can be accessed throughout the program's lifecycle.

Variables must be declared before entering the `.SYNTAX` clause.
This may look like this:

```meta
:FUNCTION_NAMES = .HASHMAP;

.SYNTAX PROGRAM

BODY = $(FUNCTION);

FUNCTION = "function" ->("JMP" *1) ~ .ID 
			(.IN(:FUNCTION_NAMES) .ERROR("error: function may only be defined once")
			| (.PUSH(:FUNCTION_NAMES) .LABEL * "(" ~ ARGUMENT_LIST ~ ")");

ARGUMENT_LIST = GET_ARGUMENT ~ $("," GET_ARGUMENT);

GET_ARGUMENT = .ID ->("POP" *);

.END
```

### Variable Initializers
Initializers can be used to define the type of a variable, available initializers are

- [.HASHMAP](#hashmap)
- [.ARRAY](#array)

### `.HASHMAP`
As the name suggests, a hashmap is an object that can store key-value pairs and offers, in most cases, constant-time access speeds. It can therefore be very handy to check whether a name has been used before or can be redefined at this point in time.

Available methods are:


Name | Description | Arguments | Branch Flag State
---------|---------- | --- |---------
 `.PUSH` | Pushes a given value into the Hashmap, this will result in the value of the given key to be set to `true` | KEY { [STRING](datatypes/string.md) \| [REFERENCE](datatypes/reference.md) } | `true`
 `.IN` | Checks whether the last matched string exists as a key in the hashmap | [VARIABLE](datatypes/variable.md) | `true` if it does exist, otherwise `false`
 `.GET` | Retrieves the value from a given key. | VAR {[VARIABLE](datatypes/variable.md)}, KEY {[STRING](datatypes/string.md)}  | `true` if data could be found, otherwise `false`
`.SET` | Sets the corresponding value of a given key. | VAR {[VARIABLE](datatypes/variable.md)}, KEY {[STRING](datatypes/string.md)}, VALUE {[STRING](datatypes/string.md) \| [REFERENCE](datatypes/reference.md)}  | `true` if data could be found, otherwise `false`


### `.ARRAY`