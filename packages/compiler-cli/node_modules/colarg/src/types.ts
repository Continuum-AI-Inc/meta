interface Command {
	[key: string]: any;
}

interface Option {
	name: string;
	alias?: string;
	type?: string;
	defaults?: any;
	description?: string;
	required?: boolean;
	callback?: (args: {[key: string]: any}, options: Option[], commands: Command[]) => void | never;
}

export {Option, Command }