# Grammar

This file lays out the base grammar of the C-Meta Metacompiler.
Its design was inspired by Val Schorre's Meta-II Metacompiler from 1964.

However, quite a lot has changed since then and the syntax needed an update.

## Syntax

```
.SYNTAX PROGRAM

PROGRAM = AS $AS .,
	AS = .ID .OUT('ADR' *) '=' EX1 .OUT('STO') ';' .,
	EX1 = EX2 $('+' EX2 .OUT('ADD') /
				'-' EX2 .OUT('SUB') ) .,
	EX2 = EX3 $('*' EX3 .OUT('MUL') /
				'/' EX3 .OUT('DIV') ) .,
	EX3 = EX4 $('**' EX3 .OUT('POW')) .,
	EX4 = '+' EX5 
		/ '-' EX5 .OUT('NEG') / EX5 .,
	EX5 = .ID  .OUT('LDN' *) /
		.NUMBER .OUT('LDC' *) /
		'(' EX1 ')' .,

.END

// New Version

.SYNTAX PROGRAM

PROGRAM = AS $AS;

AS = .ID > ("ADR", *) "=" EX1 > ("STO") ";";

EX1 = EX2 $("+" EX2 > ("ADD")
	| "-" EX2 > ("SUB"));
EX2 = EX3 $("*" EX3 > ("MUL")
	| "/" EX3 > ("DIV"));
EX3 = EX4 $("**" EX3 > ("POW"));

EX4 = "+" EX5
	| "-" EX5 > ("NEG")
	| EX5;
EX5 = .ID > ("LDN", *)
	| .NUMBER > ("LDC", *)
	| "(" EX1 ")";

.END

```

## Directives

### `.STRING`