const topics = [
  {
    id: "syntax",
    name: "Basic syntax",
    short: "Syntax",
    icon: "braces",
    chapter: "3. An Informal Introduction to Python",
    source: "https://docs.python.org/3/tutorial/introduction.html",
    description:
      "Meet Python expressions, comments, indentation, and the rhythm of readable code.",
  },
  {
    id: "variables",
    name: "Variables",
    short: "Variables",
    icon: "variable",
    chapter: "3.1. Using Python as a Calculator",
    source:
      "https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator",
    description:
      "Give values a name, assign them with =, and reuse them as your program grows.",
  },
  {
    id: "data-types",
    name: "Data types",
    short: "Data types",
    icon: "shapes",
    chapter: "3.1. Numbers and text",
    source: "https://docs.python.org/3/tutorial/introduction.html#numbers",
    description:
      "Recognize integers, floating-point numbers, strings, and the values they represent.",
  },
  {
    id: "input-output",
    name: "Input & output",
    short: "Input / output",
    icon: "message-square-code",
    chapter: "7. Input and output",
    source: "https://docs.python.org/3/tutorial/inputoutput.html",
    description:
      "Collect text with input() and share useful results with print().",
  },
  {
    id: "conditionals",
    name: "Conditionals",
    short: "Conditionals",
    icon: "git-branch",
    chapter: "4.1. if Statements",
    source: "https://docs.python.org/3/tutorial/controlflow.html#if-statements",
    description: "Let if, elif, and else choose which instructions run.",
  },
  {
    id: "lists",
    name: "Lists",
    short: "Lists",
    icon: "list",
    chapter: "3.1.3. Lists",
    source: "https://docs.python.org/3/tutorial/introduction.html#lists",
    description:
      "Keep ordered values together, look them up, and add items as you go.",
  },
  {
    id: "loops",
    name: "Loops",
    short: "Loops",
    icon: "repeat-2",
    chapter: "4.2. for Statements",
    source:
      "https://docs.python.org/3/tutorial/controlflow.html#for-statements",
    description:
      "Repeat an action with for, while, and the values in an iterable.",
  },
  {
    id: "functions",
    name: "Functions",
    short: "Functions",
    icon: "blocks",
    chapter: "4.8. Defining Functions",
    source:
      "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
    description:
      "Bundle reusable steps with def, parameters, and return values.",
  },
];

const lessons = {
  syntax: {
    intro: "Syntax is the set of writing rules a programming language understands. Python is designed to read clearly, but spelling, punctuation, and indentation still matter.",
    beginner: "Think of Python like a recipe: each line is an instruction, and Python reads the recipe from top to bottom. Parentheses group information for a function, quotes mark text, and a colon announces that a block of indented instructions is coming next.",
    keyIdeas: ["print(\"Hello!\") displays a message; the parentheses hold what print should show.", "A # begins a comment for people reading the program; Python skips it.", "Indentation (usually four spaces) shows which lines belong to an if statement, loop, or function."],
    watchOut: "Watch out: Python treats Name and name as different names. A missing colon or inconsistent indentation can also stop a program.",
    example: 'if ready:\n    print("Go!")',
    reveal: "When ready is true, Python prints Go!. The indentation makes print() part of the if block.",
    challenge: ["if ready:", '    print("Go!")'],
  },
  variables: {
    intro: "A variable is a meaningful name that lets you store and reuse a value. It is useful for information that may change, such as a score, a learner’s name, or a number of attempts.",
    beginner: "Imagine a labeled box: the label is the variable name and the contents are its current value. In score = 10, Python stores 10 under the name score. Later, score = score + 1 calculates a new value and puts it back in that box.",
    keyIdeas: ["Use = to assign a value. Use == when you want to compare two values for equality.", "Choose names that explain what a value means, such as student_name or total_score.", "Python works out the right-hand side of an assignment before storing the result on the left."],
    watchOut: "Watch out: a variable must be assigned before you use it. Names cannot contain spaces or start with a digit.",
    example: "score = 10\nscore = score + 1\nprint(score)",
    reveal: "score starts at 10, then increases by 1. The final line prints 11.",
    challenge: ["score = 10", "score = score + 1", "print(score)"],
  },
  "data-types": {
    intro: "A data type tells Python what kind of value it is handling. Knowing the type helps you choose valid operations and avoid mixing values in confusing ways.",
    beginner: "The number 3 is an integer (int), 3.5 is a decimal number (float), and \"3\" is text (str). They may look similar to us, but Python handles them differently. Boolean values are True and False, and are useful for yes/no decisions.",
    keyIdeas: ["Put text inside matching single or double quotes: \"hello\".", "Use int(\"12\") or float(\"3.5\") to convert suitable text into a number.", "Use type(value) in the Code Lab to inspect a value’s type."],
    watchOut: "Watch out: input() always gives you text. Convert it before doing arithmetic, and remember that \"True\" is text while True is a Boolean.",
    example: 'count = 3\nname = "Mina"\nis_ready = True\nprint(type(count).__name__)',
    reveal: "The program prints int because count is a whole-number value.",
    challenge: ["count = 3", 'name = "Mina"', "is_ready = True"],
  },
  "input-output": {
    intro: "Input and output let a program communicate with a person. input() pauses to collect a line of text; print() displays information so the person can see what happened.",
    beginner: "A small interactive program often asks a question, stores the answer in a variable, and prints a reply. input(\"Name: \") shows a prompt and returns the typed answer as text. An f-string starts with f and lets you insert a variable between braces.",
    keyIdeas: ["print(\"Hi\", name) can display several values separated by spaces.", "Use f\"Hello, {name}!\" to include a variable inside a message.", "Convert numeric input with int() or float() before calculating with it."],
    watchOut: "Watch out: input() returns a string even if the person types digits. int(input(...)) is a common pattern for whole-number input.",
    example: 'name = input("Name: ")\nprint(f"Hello, {name}!")',
    reveal: "The program asks for a name, then prints a greeting containing the text entered.",
    challenge: ['name = input("Name: ")', 'print(f"Hello, {name}!")'],
  },
  conditionals: {
    intro: "A conditional lets a program choose which instructions to run. Python checks whether a condition is True, then follows the matching branch.",
    beginner: "An if statement is like a fork in a path: if the test is true, run the indented block; otherwise try an elif condition or use else. For example, if temperature > 20: can choose a warm-weather message.",
    keyIdeas: ["Use == for equality, != for not equal, and <, >, <=, >= for number comparisons.", "Combine tests with and (both true) or or (at least one true).", "The first matching if or elif branch runs; else is optional and catches everything else."],
    watchOut: "Watch out: use a colon at the end of if/elif/else and indent the branch body. A single = assigns; it does not compare.",
    example: 'score = 8\nif score >= 7:\n    print("Ready")\nelse:\n    print("Try again")',
    reveal: "Because 8 is greater than or equal to 7, the program prints Ready.",
    challenge: ["if score >= 10:", '    print("Great!")', "else:", '    print("Keep trying")'],
  },
  lists: {
    intro: "A list stores several values together in a particular order. Lists are handy for a set of scores, names, or tasks that your program needs to work through.",
    beginner: "Create a list with square brackets, for example fruits = [\"pear\", \"plum\"]. Positions are called indexes and start at zero, so fruits[0] is \"pear\". Lists can grow: fruits.append(\"kiwi\") adds a new item at the end.",
    keyIdeas: ["Use len(fruits) to find how many items are in a list.", "Use fruits[-1] for the last item; negative indexes count backward from the end.", "append(value) adds one item; remove(value) removes a matching item."],
    watchOut: "Watch out: asking for an index that does not exist causes an IndexError. A list of three items has indexes 0, 1, and 2.",
    example: 'colors = ["blue"]\ncolors.append("gold")\nprint(colors)',
    reveal: "The list now contains blue followed by gold.",
    challenge: ['colors = ["blue"]', 'colors.append("gold")', "print(colors)"],
  },
  loops: {
    intro: "A loop repeats instructions so you do not have to write the same line over and over. A for loop is often used when you have a sequence or a known range of values.",
    beginner: "In for fruit in [\"pear\", \"plum\"]:, the loop gives fruit one item at a time and runs the indented body for each. range(3) produces 0, 1, 2: it starts at zero and stops just before three.",
    keyIdeas: ["The loop variable gets a new value on each pass.", "Use range(stop) for a count from zero, or range(start, stop) to choose a starting value.", "A while loop keeps going while its condition is true."],
    watchOut: "Watch out: a while loop needs a way for its condition to become false. Otherwise it can run forever. Indent the loop body consistently.",
    example: "for number in range(3):\n    print(number)",
    reveal: "The loop prints 0, 1, and 2 on separate lines. The stop value 3 is not included.",
    challenge: ["for number in range(3):", "    print(number)"],
  },
  functions: {
    intro: "A function is a named group of instructions you can reuse. Functions make programs easier to organize, test, and understand.",
    beginner: "Define a function with def, give it a name, and write parentheses for its inputs (called parameters). A function body is indented. Calling greet(\"Mina\") runs the function with Mina as the argument. return sends a result back to the caller.",
    keyIdeas: ["A function definition starts with def and ends its header with a colon.", "Parameters are the names in the definition; arguments are the actual values you pass when calling it.", "return gives a result back. print() displays a result, but does not return it."],
    watchOut: "Watch out: defining a function does not run it; you must call it. A function that reaches the end without return gives back None.",
    example: 'def greet(name):\n    return f"Hello, {name}"\n\nprint(greet("Mina"))',
    reveal: "Calling greet with Mina returns the greeting, and print() displays it.",
    challenge: ["def greet(name):", '    return f"Hello, {name}"', 'print(greet("Mina"))'],
  },
};

const questionSets = {
  syntax: [
    {
      id: "syntax-indent",
      prompt:
        "Python uses indentation to group statements. Which line belongs inside this if block?",
      code: 'if temperature > 20:\n    print("Warm day")',
      options: [
        "The print line, because it is indented",
        "Any line after the if, regardless of indentation",
        "Only a line ending in a semicolon",
        "The if line itself",
      ],
      answer: 0,
      explain:
        "The indented print statement is the body of the if block. Python uses consistent indentation to define blocks.",
      improve:
        "Review how indentation groups a compound statement, then try spotting the body of a for loop.",
    },
    {
      id: "syntax-comments",
      prompt: "Which character begins a single-line comment in Python?",
      options: ["//", "#", "--", "/*"],
      answer: 1,
      explain:
        "A # starts a comment that continues to the end of that physical line. Python does not interpret it as code.",
      improve:
        "Revisit comments and expressions, then annotate a short snippet in the code lab.",
    },
    {
      id: "syntax-expression",
      prompt: "What value does this Python expression produce?",
      code: "2 + 3 * 2",
      options: ["10", "12", "8", "7"],
      answer: 2,
      explain:
        "Multiplication is evaluated before addition, so 2 + (3 × 2) is 8.",
      improve:
        "Practice the order of arithmetic operators and use parentheses to make grouping explicit.",
    },
  ],
  variables: [
    {
      id: "variables-assign",
      prompt: "What does the = operator do in this statement?",
      code: "score = 12",
      options: [
        "Compares score with 12",
        "Assigns the value 12 to the name score",
        "Adds 12 to score",
        "Prints the value of score",
      ],
      answer: 1,
      explain:
        "The assignment statement binds the name score to the value 12. Equality comparisons use ==.",
      improve:
        "Practice distinguishing assignment (=) from comparison (==) in a few short examples.",
    },
    {
      id: "variables-update",
      prompt: "After these statements, what is the value of total?",
      code: "total = 4\ntotal = total + 3",
      options: ["4", "3", "7", "total + 3"],
      answer: 2,
      explain:
        "Python evaluates the right side first (4 + 3), then assigns 7 to total.",
      improve:
        "Trace each assignment from top to bottom; write down the new value after every line.",
    },
    {
      id: "variables-name",
      prompt: "Which is a valid and descriptive variable name?",
      options: ["2nd_place", "user score", "user_score", "class"],
      answer: 2,
      explain:
        "Names can use letters, digits, and underscores, but cannot start with a digit or contain spaces. class is a reserved keyword.",
      improve:
        "Review Python identifier rules and try renaming a few unclear variables.",
    },
  ],
  "data-types": [
    {
      id: "types-int-float",
      prompt: "What is the type of the value 3.5?",
      options: ["int", "float", "str", "bool"],
      answer: 1,
      explain:
        "A number with a fractional part is a float. A whole number like 3 is an int.",
      improve:
        "Compare integer and floating-point literals, then check your guesses with type() in the lab.",
    },
    {
      id: "types-string",
      prompt: "What type does input() return, even when someone types digits?",
      code: 'age = input("Age? ")',
      options: ["int", "float", "str", "bool"],
      answer: 2,
      explain:
        "input() returns text (a str). Convert it with int() or float() when numeric behavior is needed.",
      improve:
        "Try input() with int() conversion in the lab; notice what happens if the text is not a number.",
    },
    {
      id: "types-bool",
      prompt: "Which value is a Boolean in Python?",
      options: ['"True"', "1", "True", '"False"'],
      answer: 2,
      explain:
        "True and False are Boolean values. Quoted versions are strings, and 1 is an integer.",
      improve:
        "Review the difference between values and their text representations; Python capitalization matters.",
    },
  ],
  "input-output": [
    {
      id: "io-print",
      prompt: "Which function writes a value to the standard output?",
      options: ["show()", "write()", "print()", "output()"],
      answer: 2,
      explain:
        "print() displays values, separating multiple arguments with spaces by default.",
      improve:
        "Run print() with one and then several arguments in the code lab.",
    },
    {
      id: "io-input",
      prompt: "What does input() do in a basic console program?",
      code: 'name = input("Name: ")',
      options: [
        "Displays name on screen",
        "Reads a line of text from the user",
        "Converts a string to a number",
        "Stops the program",
      ],
      answer: 1,
      explain:
        "input() displays an optional prompt, reads a line, and returns the entered text as a string.",
      improve:
        "Try the editor's input field with input() and then print the captured value.",
    },
    {
      id: "io-fstring",
      prompt: "Which is a valid f-string that includes the value of name?",
      options: [
        'print("Hello, {name}")',
        'print(f"Hello, {name}")',
        'print(f("Hello, name"))',
        'print("fHello, name")',
      ],
      answer: 1,
      explain:
        "An f-string starts with f before its quote; expressions inside braces are evaluated.",
      improve:
        "Experiment with f-strings by inserting a variable and a small expression inside braces.",
    },
  ],
  conditionals: [
    {
      id: "conditions-if",
      prompt: "When does the indented statement run?",
      code: 'if score >= 60:\n    print("Pass")',
      options: [
        "Whenever score is less than 60",
        "When score is 60 or greater",
        "Only when score equals 60",
        "Every time, regardless of score",
      ],
      answer: 1,
      explain:
        "The >= comparison is true at 60 and for larger values, so the if body runs then.",
      improve:
        "Review comparison operators (<, >, ==, <=, >=, !=) and test boundary values.",
    },
    {
      id: "conditions-elif",
      prompt: "What is elif short for, and when is it checked?",
      options: [
        "Else if; checked when earlier if/elif conditions were false",
        "End loop; checked after a loop",
        "Else input; checked when input is empty",
        "Equal if; checked before if",
      ],
      answer: 0,
      explain:
        "elif means 'else if'. It gives another condition to check when the previous branch did not match.",
      improve:
        "Sketch the order of if / elif / else branches and trace which first-true branch runs.",
    },
    {
      id: "conditions-equal",
      prompt: "Which operator tests whether two values are equal?",
      code: "if answer ___ 42:",
      options: ["=", "==", "!=", ">="],
      answer: 1,
      explain:
        "== compares two values for equality. A single = assigns a value to a name.",
      improve:
        "Practice reading each operator aloud as 'assign', 'equal to', or 'not equal to'.",
    },
  ],
  lists: [
    {
      id: "lists-literal",
      prompt:
        "Which expression creates a Python list containing three numbers?",
      options: ["(2, 4, 6)", "{2, 4, 6}", "[2, 4, 6]", "list(2, 4, 6)"],
      answer: 2,
      explain:
        "A list literal uses square brackets with comma-separated items.",
      improve:
        "Create a list in the code lab and inspect its first and last items using indexes.",
    },
    {
      id: "lists-index",
      prompt: "What value does numbers[0] return?",
      code: "numbers = [7, 8, 9]",
      options: ["7", "8", "9", "The length of the list"],
      answer: 0,
      explain:
        "Sequence indexing starts at 0, so numbers[0] is the first item: 7.",
      improve:
        "Practice zero-based indexing and try numbers[-1] to access the last item.",
    },
    {
      id: "lists-append",
      prompt: "Which method adds one item to the end of a list?",
      code: 'colors = ["blue"]',
      options: [
        'colors.add("gold")',
        'colors.append("gold")',
        'colors.insert_end("gold")',
        'colors.push("gold")',
      ],
      answer: 1,
      explain: "list.append(value) adds a single item to the end of that list.",
      improve:
        "Use append() in the lab and print the list before and after the call.",
    },
  ],
  loops: [
    {
      id: "loops-for",
      prompt: "What values does range(3) produce in a for loop?",
      code: "for number in range(3):\n    print(number)",
      options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3 only"],
      answer: 1,
      explain:
        "range(3) starts at 0 and stops before 3, so the values are 0, 1, and 2.",
      improve:
        "Try range(2, 6) and write down the first and last values it produces.",
    },
    {
      id: "loops-items",
      prompt: "What does this loop visit on each iteration?",
      code: 'for fruit in ["pear", "plum"]:\n    print(fruit)',
      options: [
        "The list's index numbers",
        "Each item in the list, in order",
        "Only the last item",
        "The list length",
      ],
      answer: 1,
      explain:
        "A Python for loop iterates over items in a sequence, in their order.",
      improve:
        "Try a for loop over a list of your own and predict the output before running it.",
    },
    {
      id: "loops-while",
      prompt: "How long does a while loop repeat its body?",
      options: [
        "Exactly once",
        "As long as its condition is true",
        "Until the list is empty in every case",
        "Only when its condition is false",
      ],
      answer: 1,
      explain:
        "A while loop repeats while its condition remains true. Make sure the body can eventually change that condition.",
      improve:
        "Trace the condition before each iteration; add an update that makes it become false.",
    },
  ],
  functions: [
    {
      id: "functions-def",
      prompt: "Which keyword begins a function definition?",
      options: ["function", "fun", "def", "return"],
      answer: 2,
      explain:
        "The def keyword introduces a function definition, followed by its name and parameters.",
      improve: "Define a tiny function in the code lab and call it by name.",
    },
    {
      id: "functions-return",
      prompt: "What does return 5 do inside a function?",
      options: [
        "Displays 5 on screen",
        "Sends the value 5 back to the caller",
        "Repeats the function five times",
        "Creates a variable named 5",
      ],
      answer: 1,
      explain:
        "return ends that function call and passes a value back to the caller. print() is used to display output.",
      improve:
        "Compare a function that prints a value with one that returns it; assign the returned value.",
    },
    {
      id: "functions-call",
      prompt: "How do you call this function with the argument 4?",
      code: "def double(number):\n    return number * 2",
      options: ["double", "double = 4", "double(4)", "call double 4"],
      answer: 2,
      explain:
        "Write the function name followed by parentheses; put the argument inside them.",
      improve:
        "Try calling double(4) in the lab, then print the returned result.",
    },
  ],
};

const additionalQuestions = {
  syntax: [
    ["syntax-print", "Which call displays the word Ready?", ["print(Ready)", 'print("Ready")', "show('Ready')", "echo(Ready)"], 1, "Quotes make Ready a string, and print() displays it."],
    ["syntax-parens", "What do parentheses do in print(2 + 3)?", ["They group the information passed to print", "They begin a comment", "They end the program", "They make 2 + 3 text"], 0, "Parentheses hold the argument that print() receives."],
    ["syntax-order", "What is the result of 8 - 2 * 3?", ["18", "2", "6", "24"], 1, "Multiplication happens first: 8 - 6 is 2."],
    ["syntax-string", "Which value is text in Python?", ["42", "True", '"42"', "4.2"], 2, "Quotes mark a string, even when its characters look like digits."],
    ["syntax-colon", "What usually comes after the colon in an if statement?", ["A comment only", "An indented block of instructions", "A closing parenthesis", "A second colon on the same line"], 1, "The colon introduces the block, and indentation marks its body."],
    ["syntax-comment", "What does Python do with this line: # show a welcome message?", ["Runs it as a command", "Treats it as a comment", "Prints the words", "Creates a variable"], 1, "Python ignores text after # on that line; it is a note for people."],
    ["syntax-newline", "By default, what does print(\"A\"); print(\"B\") do?", ["Prints A and B on separate lines", "Prints only B", "Adds the values", "Causes a syntax error"], 0, "Each print() call ends with a newline by default."],
  ],
  variables: [
    ["variables-read", "After level = 4, what does print(level) display?", ["level", "4", "None", "An error every time"], 1, "The name level refers to the value 4."],
    ["variables-reassign", "After color = \"blue\" then color = \"gold\", what is color?", ["blue", "gold", "blue gold", "color"], 1, "The second assignment replaces the value associated with color."],
    ["variables-add", "What is points after points = 6; points = points + 2?", ["6", "2", "8", "62"], 2, "Python adds 2 to the previous value, 6."],
    ["variables-identifier", "Which name follows Python's basic naming rules?", ["first-name", "first name", "first_name", "1st_name"], 2, "Underscores are allowed; hyphens and spaces are not, and names cannot start with a digit."],
    ["variables-equals", "Which symbol compares two values for equality?", ["=", "==", "->", "++"], 1, "A pair of equals signs makes an equality comparison."],
    ["variables-case", "Are total and Total the same variable name?", ["Yes, Python ignores capitalization", "No, names are case-sensitive", "Only inside functions", "Only for numbers"], 1, "Python treats uppercase and lowercase letters as different."],
    ["variables-swap", "Which assignment stores 15 in apples?", ["apples == 15", "15 = apples", "apples = 15", "apples: 15"], 2, "The variable is on the left and the value to store is on the right."],
  ],
  "data-types": [
    ["types-integer", "Which value is an integer (int)?", ["2.0", '"2"', "2", "True"], 2, "2 is a whole-number integer; 2.0 is a float and \"2\" is text."],
    ["types-float", "Which value is a floating-point number?", ["7", '"7.5"', "7.5", "False"], 2, "A number written with a decimal point is a float."],
    ["types-convert", "What does int(\"12\") produce?", ["The text 12", "The integer 12", "The float 12.0", "The Boolean True"], 1, "int() converts suitable whole-number text to an integer."],
    ["types-concatenate", 'What does "Py" + "thon" produce?', ["Py thon", "Python", "An error", "0"], 1, "The + operator joins two strings end to end."],
    ["types-bool-false", "Which is the Boolean false value in Python?", ['"False"', "0.0", "False", "false"], 2, "Python spells the Boolean value False with a capital F and no quotes."],
    ["types-type", "What does type(\"hello\") identify?", ["int", "str", "float", "bool"], 1, "Text between quotes is a string, abbreviated str."],
    ["types-add-text", 'What happens with int("3") + 2?', ["The integer 5", "The text 32", "The float 3.2", "An error because conversion is impossible"], 0, "int() converts \"3\" to 3, then Python adds 2."],
  ],
  "input-output": [
    ["io-prompt", 'What does input("Name: ") do first?', ["Prints the prompt and waits for text", "Converts the answer to an integer", "Reads a file", "Ends the program"], 0, "input() shows its prompt and waits for the person to type a line."],
    ["io-newline", "What happens when print(\"Hi\") runs?", ["It displays Hi", "It asks for input", "It stores Hi in a variable", "It converts Hi to a number"], 0, "print() sends its argument to the output."],
    ["io-multiple", 'What does print("Score", 5) display?', ["Score5 with no separator", "Score 5", "Only Score", "An error"], 1, "print() separates multiple arguments with a space by default."],
    ["io-fstring-value", 'If name = "Ari", what does f"Hi, {name}!" display?', ["Hi, {name}!", "Hi, Ari!", "fHi, Ari!", "Ari name"], 1, "An f-string evaluates the expression in braces and inserts its value."],
    ["io-input-type", "What type does input() return?", ["Always int", "Always str", "A Boolean", "It depends on what is typed"], 1, "input() returns text. Convert it when a number is needed."],
    ["io-newline-end", "How can print() avoid moving to a new line at the end?", ["print(end=\"\")", "input(newline=False)", "print(newline)", "Use # at the end"], 0, "The end parameter controls what print() writes after its values."],
    ["io-convert", "If age = input(\"Age: \"), what helps add 1 to age?", ["age + 1", "str(age) + 1", "int(age) + 1", "print(age, 1)"], 2, "Convert the text answer to an integer before adding."],
  ],
  conditionals: [
    ["conditions-else", "When does an else block run?", ["Whenever the if condition is true", "When no preceding if/elif condition matched", "Before the if is checked", "Only inside a loop"], 1, "else is the fallback branch when earlier conditions were false."],
    ["conditions-not-equal", "Which operator means 'not equal to'?", ["<>", "!=", "==", "="], 1, "Python uses != to test that two values differ."],
    ["conditions-and", "When is 4 < 8 and 2 == 2 true?", ["When both comparisons are true", "When either comparison is true", "When both are false", "It is always false"], 0, "and requires both sides of the condition to be true."],
    ["conditions-or", "When is ready or retry true?", ["Only when both are true", "When at least one is true", "Only when both are false", "Never"], 1, "or is true when one or both of its conditions are true."],
    ["conditions-elif-order", "If an if condition matches, are later elif conditions checked?", ["Yes, all are always checked", "No, Python runs the first matching branch", "Only if else is missing", "Only when a loop is running"], 1, "Once a branch matches, Python skips the remaining branches."],
    ["conditions-boundary", "Is 5 >= 5 true?", ["Yes", "No", "Only for strings", "It causes an error"], 0, ">= means greater than or equal to, so equal values satisfy it."],
    ["conditions-indent", "Which line belongs inside if sunny:?", ["A line aligned with if", "An indented line below it", "A line before if", "Only a comment"], 1, "The indented lines directly below the condition form its body."],
  ],
  lists: [
    ["lists-length", "What does len([\"a\", \"b\", \"c\"]) return?", ["2", "3", "4", "a"], 1, "len() counts the items, and this list contains three."],
    ["lists-second", "What does colors[1] select in [\"red\", \"blue\", \"green\"]?", ["red", "blue", "green", "The list length"], 1, "Index 1 is the second item because indexes start at zero."],
    ["lists-change", "How do you replace the first item in items with \"new\"?", ["items[1] = \"new\"", "items[0] = \"new\"", "items.append[0]", "items = 0"], 1, "The first list item has index 0."],
    ["lists-empty", "Which expression creates an empty list?", ["{}", "()", "[]", "None"], 2, "Square brackets create a list; [] is an empty one."],
    ["lists-append-result", "After pets = [\"cat\"]; pets.append(\"dog\"), what is pets?", ["[\"cat\"]", "[\"dog\", \"cat\"]", "[\"cat\", \"dog\"]", "\"catdog\""], 2, "append() adds the new item to the end of the list."],
    ["lists-membership", "Which expression checks whether \"tea\" is in drinks?", ["drinks has \"tea\"", "\"tea\" in drinks", "drinks == \"tea\"", "inside(drinks, \"tea\")"], 1, "The in operator tests whether a value is one of the list's items."],
    ["lists-last", "What does numbers[-1] select?", ["The first item", "The last item", "The item at index -1 from the start", "The list length"], 1, "Index -1 refers to the final item in a sequence."],
  ],
  loops: [
    ["loops-range-four", "How many values are produced by range(4)?", ["3", "4", "5", "It never stops"], 1, "range(4) produces 0, 1, 2, and 3: four values."],
    ["loops-range-start", "What values does range(2, 5) produce?", ["2, 3, 4", "2, 3, 4, 5", "1, 2, 3, 4", "5 only"], 0, "The start is included and the stop value 5 is excluded."],
    ["loops-list", "How many times does for item in [3, 6, 9]: run its body?", ["Once", "Twice", "Three times", "Nine times"], 2, "A for loop runs once for each of the three list items."],
    ["loops-break", "What does break do in a loop?", ["Skips one iteration", "Exits the loop", "Restarts the program", "Defines a function"], 1, "break stops the nearest enclosing loop."],
    ["loops-continue", "What does continue do in a loop?", ["Ends every loop", "Skips to the next iteration", "Pauses for input", "Returns a value"], 1, "continue skips the rest of the current pass and moves to the next."],
    ["loops-stop-condition", "What must eventually happen for a while loop to stop naturally?", ["Its condition becomes false", "Its body is indented", "It prints a value", "A list is always empty"], 0, "The loop checks its condition again and stops when it is false."],
    ["loops-indent", "Where should the body of a for loop be written?", ["Indented below the for line", "On a line before for", "Inside quotation marks", "After a #"], 0, "Indentation marks the instructions repeated by the loop."],
  ],
  functions: [
    ["functions-parameter", "In def greet(name):, what is name?", ["A parameter", "A return value", "A loop", "A comment"], 0, "name is a parameter that receives a value when the function is called."],
    ["functions-argument", "In greet(\"Ari\"), what is \"Ari\"?", ["The function definition", "An argument", "A keyword", "The return statement"], 1, "An argument is a value supplied to a function call."],
    ["functions-call-parens", "How do you run a function named wave?", ["wave", "call wave", "wave()", "def wave"], 2, "Write the function name with parentheses to call it."],
    ["functions-print-return", "Which statement sends a result back to the caller?", ["print", "return", "def", "input"], 1, "return passes a value back; print() only displays a value."],
    ["functions-reuse", "Why put repeated steps in a function?", ["To reuse the steps without copying them", "To make Python ignore them", "To turn them into a list", "To stop all input"], 0, "One function definition can be called from several parts of a program."],
    ["functions-no-call", "Does defining def wave(): print(\"Hi\") display Hi immediately?", ["Yes, every definition runs at once", "No, call wave() to run it", "Only if the function has a parameter", "Only in a loop"], 1, "A definition creates the function; calling it runs the body."],
    ["functions-indent", "Where does a function body go?", ["Indented under the def line", "Before the def line", "After a #", "Inside the function name"], 0, "Indentation groups the statements that belong to the function."],
  ],
};

Object.entries(additionalQuestions).forEach(([topicId, questions]) => {
  questionSets[topicId].push(
    ...questions.map(([id, prompt, options, answer, explain]) => ({
      id,
      prompt,
      options,
      answer,
      explain,
      improve: `Review this ${topics.find((topic) => topic.id === topicId).name.toLowerCase()} idea and try the matching example in Code Lab.`,
    })),
  );
});

const badges = [
  {
    id: "first-step",
    name: "First step",
    detail: "Answer your first question",
    icon: "footprints",
  },
  {
    id: "sharp-mind",
    name: "Sharp mind",
    detail: "Get 5 answers right",
    icon: "brain",
  },
  {
    id: "daily-practice",
    name: "In rhythm",
    detail: "Practice 3 days in a row",
    icon: "flame",
  },
  {
    id: "syntax-scout",
    name: "Syntax scout",
    detail: "Get one right in each topic",
    icon: "sparkles",
  },
];

const state = {
  progress: {
    answered: 0,
    correct: 0,
    accuracy: 0,
    streak: 0,
    activeDays: 0,
    badges: [],
    topics: {},
    completedTopics: [],
    coursePhase: "plan",
    topicPhases: {},
    missed: [],
  },
  selectedTopic: "syntax",
  selectedTopics: ["syntax"],
  activeTopics: ["syntax"],
  lessonIndex: 0,
  lessonTopicId: "syntax",
  user: null,
  questions: [],
  questionIndex: 0,
  session: { correct: 0, wrong: 0, missed: [], persistenceFailed: false },
  answeredCurrent: false,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const selectedTopic = () =>
  topics.find((topic) => topic.id === state.selectedTopic);

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function toast(message, isError = false) {
  const notice = document.createElement("div");
  notice.className = `toast${isError ? " is-error" : ""}`;
  notice.textContent = message;
  $("#toast-region").append(notice);
  window.setTimeout(() => notice.remove(), 3400);
}

function navigate(viewName) {
  const existingView = $(`#view-${viewName}`);
  if (!existingView) return;
  $$(".app-view").forEach((view) =>
    view.classList.toggle("is-visible", view === existingView),
  );
  const activeNav =
    viewName === "practice" || viewName === "lesson" ? "course" : viewName;
  $$(".primary-nav .nav-link").forEach((button) => {
    const isActive = button.dataset.view === activeNav;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  closeMobileNavigation();
  const breadcrumb = {
    dashboard: "Home",
    course: "COURSE MAP",
    lesson: "LESSON",
    lab: "CODE LAB",
    progress: "MY PROGRESS",
    practice: "PRACTICE",
    profile: "PROFILE",
  };
  $("#breadcrumb-current").textContent = breadcrumb[viewName] || "Home";
  if (viewName === "progress") renderProgress();
  if (viewName === "course") renderCourse();
  window.scrollTo({ top: 0, behavior: "smooth" });
  refreshIcons();
}

function selectTopic(topicId) {
  if (!topics.some((topic) => topic.id === topicId)) return;
  state.selectedTopic = topicId;
  state.selectedTopics = [topicId];
  renderTopicNavigation();
  renderDashboard();
  renderCourse();
}

function togglePlannedTopic(topicId) {
  if (!topics.some((topic) => topic.id === topicId)) return;
  state.selectedTopic = topicId;
  state.selectedTopics = state.selectedTopics.includes(topicId)
    ? state.selectedTopics.filter((id) => id !== topicId)
    : [...state.selectedTopics, topicId];
  state.progress.coursePhase = "plan";
  saveCoursePhase("plan", []);
  renderTopicNavigation();
  renderDashboard();
  renderCourse();
}

function setActivityPhase(topicIds, phase) {
  state.progress.coursePhase = phase;
  state.progress.topicPhases ||= {};
  topicIds.forEach((topicId) => {
    state.progress.topicPhases[topicId] = phase;
  });
  return saveCoursePhase(phase, topicIds);
}

function currentCoursePhase() {
  return state.progress.coursePhase || "plan";
}

async function saveCoursePhase(phase, topicIds) {
  try {
    const response = await fetch("/api/phase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase, topics: topicIds }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not save learning phase");
    state.progress = result;
    renderCourse();
    if ($("#view-progress").classList.contains("is-visible")) renderProgress();
  } catch (error) {
    toast(`Learning phase could not be saved: ${error.message}`, true);
  }
}

function renderSrlSteps(container, currentPhase) {
  const steps = [
    ["plan", "01", "PLAN", "Choose what to learn"],
    ["perform", "02", "PERFORM", "Learn and practice"],
    ["reflect", "03", "REFLECT", "Review and adjust"],
  ];
  container.innerHTML = steps
    .map(([id, number, label, description], index) => {
      const currentIndex = steps.findIndex(([stepId]) => stepId === currentPhase);
      const complete = index < currentIndex;
      return `<div class="srl-course-step${currentPhase === id ? " is-current" : ""}${complete ? " is-complete" : ""}"${currentPhase === id ? ' aria-current="step"' : ""}><span>${number}</span><strong>${label}</strong><small>${description}</small></div>`;
    })
    .join("");
}

function renderTopicNavigation() {
  $("#topic-nav").innerHTML = topics
    .map((topic, index) => {
      const topicProgress = state.progress.topics[topic.id] || {
        answered: 0,
        correct: 0,
      };
      const complete = (state.progress.completedTopics || []).includes(topic.id);
      return `<button class="topic-link${topic.id === state.selectedTopic ? " is-selected" : ""}" data-topic="${topic.id}" type="button" aria-label="Topic ${index + 1}: ${escapeHtml(topic.name)}${complete ? ", practiced" : ""}"${topic.id === state.selectedTopic ? ' aria-current="true"' : ""}><span class="topic-index">${index + 1}</span><span class="topic-link-name">${escapeHtml(topic.short)}</span>${complete ? '<i class="topic-check" data-lucide="circle-check"></i>' : ""}</button>`;
    })
    .join("");
  $("#topic-nav")
    .querySelectorAll("[data-topic]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        selectTopic(button.dataset.topic);
        navigate("course");
      }),
    );
  refreshIcons();
}

function renderDashboard() {
  const topic = selectedTopic();
  const topicProgress = state.progress.topics[topic.id] || {
    answered: 0,
    correct: 0,
  };
  $("#header-streak").textContent = state.progress.streak;
  $("#stat-answered").textContent = state.progress.answered;
  $("#stat-accuracy").innerHTML = `${state.progress.accuracy}<span>%</span>`;
  $("#stat-streak").innerHTML =
    `${state.progress.streak} <small>${state.progress.streak === 1 ? "day" : "days"}</small>`;
  $("#stat-focus").textContent = topic.name;
  $("#stat-focus-note").textContent = topicProgress.answered
    ? `${topicProgress.correct} right of ${topicProgress.answered} tried`
    : "Ready for a first look";
  $("#practice-topic-kicker").textContent =
    `TOPIC ${topics.indexOf(topic) + 1}`;
  $("#practice-topic-title").textContent = topic.name;
  $("#practice-topic-description").textContent = topic.description;
  $("#practice-topic-icon").innerHTML = `<i data-lucide="${topic.icon}"></i>`;
  $("#practice-question-count").textContent =
    `${questionSets[topic.id].length} questions`;
  $("#badge-row").innerHTML = badges
    .slice(0, 3)
    .map((badge) => {
      const earned = state.progress.badges.includes(badge.id);
      return `<div class="badge-mini${earned ? " earned" : ""}" title="${escapeHtml(badge.detail)}"><span class="badge-medallion"><i data-lucide="${badge.icon}"></i></span><span>${escapeHtml(badge.name)}</span></div>`;
    })
    .join("");
  const earnedCount = state.progress.badges.length;
  $("#badge-caption").textContent = earnedCount
    ? `${earnedCount} of ${badges.length} milestones earned. Keep your rhythm going.`
    : "Your first badge is one question away.";
  $("#mini-outline").innerHTML = topics
    .map(
      (item) =>
        `<button class="mini-topic" data-topic="${item.id}" type="button"><span><i data-lucide="${item.icon}"></i></span><span>${escapeHtml(item.name)}</span></button>`,
    )
    .join("");
  $("#mini-outline")
    .querySelectorAll("[data-topic]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        selectTopic(button.dataset.topic);
        navigate("course");
      }),
    );
  refreshIcons();
}

function renderCourse() {
  const selected = new Set(state.selectedTopics);
  $("#course-grid").innerHTML = topics
    .map((item, index) => {
      const result = state.progress.topics[item.id] || {
        answered: 0,
        correct: 0,
      };
      const accuracy = result.answered
        ? Math.round((result.correct / result.answered) * 100)
        : 0;
      const isSelected = selected.has(item.id);
      const phase = state.progress.topicPhases?.[item.id] || "plan";
      const phaseLabel = phase === "reflect" ? "Reflect" : phase === "perform" ? "Perform" : "Plan";
      return `<article class="course-card${isSelected ? " is-selected" : ""}" data-topic="${item.id}" tabindex="0" aria-label="Topic ${index + 1}: ${escapeHtml(item.name)}. ${isSelected ? "Selected" : "Not selected"}. Double-click to open the lesson."><div class="course-card-icon"><i data-lucide="${item.icon}"></i></div><div class="course-card-copy"><span class="topic-kicker">TOPIC ${index + 1}</span><h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(item.description)}</p></div><span class="course-card-stage is-${phase.toLowerCase()}">${phaseLabel}</span><div class="course-card-progress"><span class="progress-track"><span style="width:${accuracy}%"></span></span><span>${result.answered ? `${accuracy}% · ${result.answered} tried` : "Not started"}</span></div><div class="course-card-actions"><button class="topic-select-button" data-select-topic="${item.id}" type="button" aria-pressed="${isSelected}"><i data-lucide="${isSelected ? "circle-check" : "circle"}"></i>${isSelected ? "Selected" : "Select topic"}</button><button class="button button-outline topic-open-button" data-open-topic="${item.id}" type="button">Open lesson <i data-lucide="arrow-up-right"></i></button></div></article>`;
    })
    .join("");
  $("#course-grid")
    .querySelectorAll(".course-card")
    .forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest("button")) return;
        togglePlannedTopic(card.dataset.topic);
      });
      card.addEventListener("dblclick", () => openLesson([card.dataset.topic]));
      card.addEventListener("keydown", (event) => {
        if (event.target !== card || !["Enter", " "].includes(event.key)) return;
        event.preventDefault();
        togglePlannedTopic(card.dataset.topic);
      });
    });
  $("#course-grid")
    .querySelectorAll("[data-select-topic]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        togglePlannedTopic(button.dataset.selectTopic),
      ),
    );
  $("#course-grid")
    .querySelectorAll("[data-open-topic]")
    .forEach((button) =>
      button.addEventListener("click", () => openLesson([button.dataset.openTopic])),
    );
  const completed = new Set(state.progress.completedTopics || []);
  const completedCount = topics.filter((item) => completed.has(item.id)).length;
  const completionPercent = Math.round((completedCount / topics.length) * 100);
  $("#course-completion").textContent = `${completionPercent}%`;
  $(".course-progress-ring").style.setProperty(
    "--completion",
    `${completionPercent * 3.6}deg`,
  );
  $(".course-progress-ring").setAttribute(
    "aria-label",
    `${completedCount} of ${topics.length} topics completed`,
  );
  $("#course-selection-title").textContent = state.selectedTopics.length
    ? `${state.selectedTopics.length} topic${state.selectedTopics.length === 1 ? "" : "s"} selected`
    : "Select topics to plan your path";
  $("#course-selection-subtitle").textContent = state.selectedTopics.length
    ? "Your selected lessons will lead into one combined quiz."
    : "Choose one or more topics, then start with the lesson.";
  $("#course-start").disabled = !state.selectedTopics.length;
  const phase = currentCoursePhase();
  renderSrlSteps($("#course-srl-path"), phase);
  refreshIcons();
}

function openLesson(topicIds) {
  const validTopics = topicIds.filter((topicId) =>
    topics.some((topic) => topic.id === topicId),
  );
  if (!validTopics.length) return;
  state.activeTopics = [...new Set(validTopics)];
  state.selectedTopics = [...state.activeTopics];
  state.selectedTopic = state.activeTopics[0];
  state.lessonIndex = 0;
  setActivityPhase(state.activeTopics, "perform");
  renderTopicNavigation();
  renderCourse();
  renderLesson();
  navigate("lesson");
}

function renderLesson() {
  const topicId = state.activeTopics[state.lessonIndex];
  const topic = topics.find((item) => item.id === topicId);
  const lesson = lessons[topicId];
  if (!topic || !lesson) return;
  state.lessonTopicId = topicId;
  const index = topics.indexOf(topic);
  $("#lesson-kicker").textContent = `TOPIC ${index + 1} · LESSON ${state.lessonIndex + 1} OF ${state.activeTopics.length}`;
  $("#lesson-title").textContent = topic.name;
  $("#lesson-intro").textContent = lesson.intro;
  $("#lesson-beginner-guide").textContent = lesson.beginner;
  $("#lesson-key-ideas").innerHTML = lesson.keyIdeas
    .map((idea) => `<li>${escapeHtml(idea)}</li>`)
    .join("");
  $("#lesson-watch-out").innerHTML =
    `<strong>Beginner tip:</strong> ${escapeHtml(lesson.watchOut)}`;
  renderSrlSteps($("#lesson-srl-path"), currentCoursePhase());
  $("#lesson-code").textContent = lesson.example;
  $("#lesson-reveal").setAttribute("aria-expanded", "false");
  $("#lesson-reveal").innerHTML =
    '<i data-lucide="eye"></i> Reveal what this code does';
  $("#lesson-reveal-answer").hidden = true;
  $("#lesson-reveal-answer").textContent = lesson.reveal;
  $("#lesson-challenge-feedback").textContent = "";
  $("#lesson-path-label").textContent =
    state.activeTopics.length > 1
      ? `Lesson ${state.lessonIndex + 1} of ${state.activeTopics.length}`
      : "Ready for a quick check?";
  $("#lesson-path-topics").textContent = state.activeTopics
    .map((id) => topics.find((item) => item.id === id)?.name)
    .filter(Boolean)
    .join(" → ");
  $("#lesson-continue").innerHTML =
    state.lessonIndex < state.activeTopics.length - 1
      ? 'Next lesson <i data-lucide="arrow-right"></i>'
      : 'Start quiz <i data-lucide="arrow-right"></i>';
  const missedNotes = (state.progress.missed || [])
    .filter((item) => item.topic === topicId)
    .map((item) => {
      const question = questionSets[topicId].find(
        (candidate) => candidate.id === item.questionId,
      );
      return question ? question.improve : "";
    })
    .filter(Boolean);
  const notesElement = $("#lesson-review-notes");
  notesElement.hidden = !missedNotes.length;
  notesElement.innerHTML = missedNotes.length
    ? `<strong>Notes to revisit from earlier quizzes</strong><ul>${[...new Set(missedNotes)].map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>`
    : "";
  const items = [...lesson.challenge]
    .map((text, order) => ({ text, order }))
    .reverse();
  $("#lesson-sort-list").innerHTML = items
    .map(
      (item) =>
        `<li class="lesson-sort-item" draggable="true" data-order="${item.order}"><code>${escapeHtml(item.text)}</code><span class="sort-controls"><button type="button" data-move="-1" aria-label="Move code line up"><i data-lucide="arrow-up"></i></button><button type="button" data-move="1" aria-label="Move code line down"><i data-lucide="arrow-down"></i></button></span></li>`,
    )
    .join("");
  const list = $("#lesson-sort-list");
  let draggedItem = null;
  list.querySelectorAll(".lesson-sort-item").forEach((item) => {
    item.addEventListener("dragstart", () => {
      draggedItem = item;
      item.classList.add("is-dragging");
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("is-dragging");
      draggedItem = null;
    });
    item.addEventListener("dragover", (event) => event.preventDefault());
    item.addEventListener("drop", (event) => {
      event.preventDefault();
      if (!draggedItem || draggedItem === item) return;
      const rect = item.getBoundingClientRect();
      list.insertBefore(
        draggedItem,
        event.clientY < rect.top + rect.height / 2 ? item : item.nextSibling,
      );
    });
    item.querySelectorAll("[data-move]").forEach((button) =>
      button.addEventListener("click", () => {
        const sibling =
          Number(button.dataset.move) < 0
            ? item.previousElementSibling
            : item.nextElementSibling;
        if (!sibling) return;
        if (Number(button.dataset.move) < 0) list.insertBefore(item, sibling);
        else list.insertBefore(sibling, item);
      }),
    );
  });
  refreshIcons();
}

function startPractice() {
  const topicIds = [...state.activeTopics];
  if (!topicIds.length) return;
  setActivityPhase(topicIds, "perform");
  renderCourse();
  const questionsPerTopic = topicIds.length === 1 ? 10 : 5;
  state.questions = topicIds.flatMap((topicId) =>
    shuffle([...questionSets[topicId]])
      .slice(0, questionsPerTopic)
      .map((question) => ({ ...question, topicId })),
  );
  state.questionIndex = 0;
  state.session = {
    correct: 0,
    wrong: 0,
    missed: [],
    persistenceFailed: false,
  };
  renderSrlSteps($("#practice-srl-path"), currentCoursePhase());
  state.answeredCurrent = false;
  $("#quiz-topic-kicker").textContent =
    topicIds.length === 1
      ? `TOPIC ${topics.findIndex((topic) => topic.id === topicIds[0]) + 1} · ${topics.find((topic) => topic.id === topicIds[0]).name.toUpperCase()}`
      : `${topicIds.length} TOPICS · MIXED PRACTICE`;
  $("#practice-page-title").textContent =
    topicIds.length === 1
      ? `${topics.find((topic) => topic.id === topicIds[0]).name} practice`
      : "Your combined practice";
  const sourceTopic = topics.find((topic) => topic.id === topicIds[0]);
  $("#quiz-source-link").href = sourceTopic.source;
  $("#quiz-source-link").innerHTML =
    `Open the Python tutorial <i data-lucide="arrow-up-right"></i>`;
  navigate("practice");
  renderQuestion();
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function renderQuestion() {
  const question = state.questions[state.questionIndex];
  const total = state.questions.length;
  state.answeredCurrent = false;
  $("#question-counter").textContent =
    `${String(state.questionIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  $("#quiz-progress-fill").style.width =
    `${(state.questionIndex / total) * 100}%`;
  const code = question.code
    ? `<pre class="question-code"><code>${escapeHtml(question.code)}</code></pre>`
    : "";
  $("#question-card").innerHTML =
    `<div class="question-type"><i data-lucide="circle-help"></i> QUICK CHECK · QUESTION ${String(state.questionIndex + 1).padStart(2, "0")}</div><h2>${escapeHtml(question.prompt)}</h2>${code}<div class="option-list" role="group" aria-label="Answer choices">${question.options.map((option, index) => `<button class="answer-option" data-option="${index}" type="button"><span class="option-key">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span></button>`).join("")}</div>`;
  $("#question-card")
    .querySelectorAll("[data-option]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        answerQuestion(Number(button.dataset.option)),
      ),
    );
  $("#quiz-progress-fill").style.width =
    `${(state.questionIndex / total) * 100}%`;
  refreshIcons();
}

async function answerQuestion(choice) {
  if (state.answeredCurrent) return;
  state.answeredCurrent = true;
  const question = state.questions[state.questionIndex];
  const isCorrect = choice === question.answer;
  const options = $$("#question-card .answer-option");
  options.forEach((option, index) => {
    option.disabled = true;
    if (index === question.answer) option.classList.add("is-correct");
    if (index === choice && !isCorrect) option.classList.add("is-wrong");
  });
  if (isCorrect) state.session.correct += 1;
  else {
    state.session.wrong += 1;
    state.session.missed.push({
      topicId: question.topicId,
      topic: topics.find((topic) => topic.id === question.topicId).name,
      prompt: question.prompt,
      improve: question.improve,
    });
  }
  const nextLabel =
    state.questionIndex === state.questions.length - 1
      ? "See my reflection"
      : "Next question";
  const feedbackClass = isCorrect ? "" : " is-wrong";
  $("#question-card").insertAdjacentHTML(
    "beforeend",
    `<div class="answer-feedback${feedbackClass}" role="status"><span class="feedback-icon"><i data-lucide="${isCorrect ? "circle-check" : "heart-pulse"}"></i></span><div class="feedback-copy"><strong>${isCorrect ? "That's it. Nice noticing." : "A useful clue for next time."}</strong><p>${escapeHtml(question.explain)}${isCorrect ? "" : ` ${escapeHtml(question.improve)}`}</p></div></div><div class="feedback-actions"><button class="next-question" id="next-question" type="button">${nextLabel} <i data-lucide="arrow-right"></i></button></div>`,
  );
  refreshIcons();
  try {
    const response = await fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: question.topicId,
        questionId: question.id,
        correct: isCorrect,
      }),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Could not save this answer");
    const previousBadges = new Set(state.progress.badges);
    state.progress = result;
    renderTopicNavigation();
    renderDashboard();
    renderCourse();
    if ($("#view-progress").classList.contains("is-visible")) renderProgress();
    const newBadge = badges.find(
      (badge) =>
        result.badges.includes(badge.id) && !previousBadges.has(badge.id),
    );
    if (newBadge) toast(`Badge earned: ${newBadge.name}`);
  } catch (error) {
    state.session.persistenceFailed = true;
    toast(`Progress could not be saved: ${error.message}`, true);
  }
  $("#next-question").addEventListener("click", () => {
    if (state.questionIndex < state.questions.length - 1) {
      state.questionIndex += 1;
      renderQuestion();
    } else renderResults();
  });
}

async function renderResults() {
  const total = state.questions.length;
  const percentage = Math.round((state.session.correct / total) * 100);
  await setActivityPhase(state.activeTopics, "reflect");
  renderSrlSteps($("#practice-srl-path"), "reflect");
  state.progress.completedTopics = [
    ...new Set([
      ...(state.progress.completedTopics || []),
      ...state.activeTopics,
    ]),
  ];
  renderCourse();
  try {
    const response = await fetch("/api/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topics: state.activeTopics }),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Could not save completed topics");
    state.progress = result;
    renderTopicNavigation();
    renderDashboard();
    renderCourse();
  } catch (error) {
    toast(`Topic completion could not be saved: ${error.message}`, true);
  }
  $("#quiz-progress-fill").style.width = "100%";
  $("#question-counter").textContent = "REFLECTION";
  const uniqueSuggestions = [
    ...new Set(state.session.missed.map((item) => item.improve)),
  ];
  let heading = "A solid first pass.";
  let message =
    "You made time to notice what you know. That matters more than a perfect score.";
  let analysis =
    "You answered each question correctly. Try another topic or explain one idea in your own words to make it stick.";
  if (percentage === 100) heading = "You found your rhythm.";
  if (percentage < 100 && percentage >= 67) {
    heading = "You're building the picture.";
    analysis = uniqueSuggestions[0] || analysis;
  }
  if (percentage < 67) {
    heading = "A good place to begin again.";
    analysis = uniqueSuggestions.slice(0, 2).join(" ") || analysis;
  }
  if (state.session.wrong && uniqueSuggestions.length > 1)
    analysis = uniqueSuggestions.slice(0, 2).join(" ");
  const missedNotes = state.session.missed.length
    ? `<div class="missed-notes"><strong>What to revisit</strong><ul>${state.session.missed.map((item) => `<li><span>${escapeHtml(item.topic)}:</span> ${escapeHtml(item.improve)}</li>`).join("")}</ul><small>${state.session.persistenceFailed ? "Progress could not be saved, so these notes may not carry to future lessons. Keep a copy before leaving." : "These notes are saved with your progress and will appear in future lessons."}</small></div>`
    : "";
  $("#question-card").innerHTML =
    `<div class="result-card"><span class="result-spark"><i data-lucide="${percentage === 100 ? "sparkles" : "compass"}"></i></span><div class="eyebrow" style="justify-content:center">STEP 3 · REFLECT · YOUR PRACTICE NOTES</div><h2>${heading}</h2><p>${message}</p><div class="result-score"><div><strong>${state.session.correct}/${total}</strong><span>answers right</span></div><div><strong>${percentage}%</strong><span>this practice set</span></div><div><strong>${state.session.wrong}</strong><span>to revisit</span></div></div><div class="result-analysis"><strong>${state.session.wrong ? "A helpful next step" : "Keep the idea moving"}</strong><p>${escapeHtml(analysis)}</p></div>${missedNotes}<div class="result-buttons"><button class="button button-gold" id="retry-practice" type="button"><i data-lucide="rotate-ccw"></i> Try this set again</button><button class="button button-outline" id="choose-next-topic" type="button">Choose another topic <i data-lucide="arrow-right"></i></button></div></div>`;
  $("#retry-practice").addEventListener("click", startPractice);
  $("#choose-next-topic").addEventListener("click", () => navigate("course"));
  refreshIcons();
}

function renderProgress() {
  const progress = state.progress;
  renderSrlSteps($("#progress-srl-path"), "reflect");
  const accuracy = progress.accuracy;
  const priorityTopic = topics
    .map((topic) => ({
      topic,
      data: progress.topics[topic.id] || { answered: 0, correct: 0 },
    }))
    .filter((item) => item.data.answered)
    .sort(
      (a, b) =>
        a.data.correct / a.data.answered - b.data.correct / b.data.answered,
    )[0];
  let reflection =
    "Start with any topic. Your first attempt gives us something useful to reflect on.";
  if (priorityTopic && priorityTopic.data.correct < priorityTopic.data.answered)
    reflection = `Your answers suggest another look at ${priorityTopic.topic.name.toLowerCase()} could help. Try that practice set again and notice what changes.`;
  else if (progress.answered)
    reflection =
      "Your tried topics are looking steady. Choose a new outline section and build on what you can already do.";
  $("#progress-summary").innerHTML =
    `<div class="progress-metric"><span>QUESTIONS TRIED</span><strong>${progress.answered}</strong><small>All attempts add insight</small></div><div class="progress-metric"><span>OVERALL ACCURACY</span><strong>${accuracy}%</strong><small>Correct answers so far</small></div><div class="progress-metric"><span>ACTIVE DAYS</span><strong>${progress.activeDays}</strong><small>${progress.streak} day current streak</small></div><div class="progress-metric"><span>TOPICS COMPLETED</span><strong>${(progress.completedTopics || []).length}<small> / 8</small></strong><small>Finish a quiz to complete a topic</small></div>`;
  $("#topic-progress-list").innerHTML = topics
    .map((topic) => {
      const data = progress.topics[topic.id] || { answered: 0, correct: 0 };
      const rate = data.answered
        ? Math.round((data.correct / data.answered) * 100)
        : 0;
      return `<div class="topic-progress-item"><span class="topic-progress-name"><i data-lucide="${topic.icon}"></i><span>${escapeHtml(topic.name)}</span></span><span class="progress-track"><span style="width:${rate}%"></span></span><span class="topic-progress-value">${data.answered ? `${rate}%` : "—"}</span></div>`;
    })
    .join("");
  $("#achievement-list").innerHTML = badges
    .map((badge) => {
      const earned = progress.badges.includes(badge.id);
      return `<div class="achievement-item${earned ? " is-earned" : ""}"><span><i data-lucide="${badge.icon}"></i></span><div><strong>${escapeHtml(badge.name)}</strong><small>${escapeHtml(earned ? badge.detail : badge.detail)}</small></div>${earned ? '<i class="earned-mark" data-lucide="circle-check"></i>' : ""}</div>`;
    })
    .join("");
  $(".srl-reflect p").innerHTML =
    `<strong>One question to sit with</strong>${escapeHtml(reflection)}`;
  refreshIcons();
}

function loadProgress() {
  return fetch("/api/state")
    .then((response) => {
      if (!response.ok) throw new Error("Progress service unavailable");
      return response.json();
    })
    .then((data) => {
      state.progress = data;
      renderTopicNavigation();
      renderDashboard();
      renderCourse();
    })
    .catch((error) => {
      console.error("Progress could not be loaded.", error);
      toast(`Progress could not be loaded: ${error.message}`, true);
    });
}

let activeWorker = null;
let runTimeout = null;
function setRuntimeStatus(text, status = "") {
  const element = $("#runtime-status");
  element.className = `runtime-status${status ? ` is-${status}` : ""}`;
  element.innerHTML = `<span class="status-dot"></span>${escapeHtml(text)}`;
}

function runCode() {
  const button = $("#run-code");
  const output = $("#console-output");
  const startedAt = performance.now();
  if (activeWorker) activeWorker.terminate();
  activeWorker = new Worker("pyodide-worker.js");
  button.disabled = true;
  button.innerHTML = '<i data-lucide="loader-circle"></i> Running';
  output.classList.remove("is-error");
  output.textContent = "Starting Python runtime...";
  $("#run-time").textContent = "LOADING RUNTIME";
  setRuntimeStatus("Loading Python runtime", "loading");
  refreshIcons();
  runTimeout = window.setTimeout(() => {
    if (!activeWorker) return;
    activeWorker.terminate();
    activeWorker = null;
    finishRun(
      "The run took too long and was stopped. Check for a loop that never ends.",
      true,
      startedAt,
    );
    setRuntimeStatus("Run stopped · try again", "error");
  }, 20000);
  activeWorker.onmessage = (event) => {
    if (event.data.type === "status") {
      setRuntimeStatus("Preparing Python runtime", "loading");
      output.textContent = "Downloading the Python runtime on first use...";
      return;
    }
    if (event.data.type !== "result") return;
    window.clearTimeout(runTimeout);
    activeWorker.terminate();
    activeWorker = null;
    finishRun(
      event.data.output ||
        (event.data.error ? "" : "Program finished with no output."),
      Boolean(event.data.error),
      startedAt,
    );
    if (event.data.error) {
      output.textContent = event.data.output || event.data.error;
      output.classList.add("is-error");
      setRuntimeStatus("Code needs a closer look", "error");
    } else setRuntimeStatus("Python is ready", "ready");
  };
  activeWorker.onerror = (event) => {
    window.clearTimeout(runTimeout);
    if (activeWorker) activeWorker.terminate();
    activeWorker = null;
    finishRun(
      event.message ||
        "Could not start the Python runtime. Check your internet connection.",
      true,
      startedAt,
    );
    setRuntimeStatus("Runtime unavailable", "error");
  };
  activeWorker.postMessage({
    code: $("#code-editor").value,
    input: $("#stdin-input").value,
  });
}

function finishRun(text, hasError, startedAt) {
  $("#console-output").textContent = text;
  $("#console-output").classList.toggle("is-error", hasError);
  $("#run-time").textContent =
    `FINISHED IN ${Math.max(1, Math.round(performance.now() - startedAt))} MS`;
  const button = $("#run-code");
  button.disabled = false;
  button.innerHTML = '<i data-lucide="play"></i> Run code';
  refreshIcons();
}

function closeMobileNavigation() {
  $(".sidebar").classList.remove("is-open");
  const button = $("#mobile-menu");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Expand navigation");
  button.innerHTML = '<i data-lucide="menu"></i>';
  refreshIcons();
}

let applicationInitialized = false;

function showAuthMessage(message, isError = false) {
  const element = $("#auth-message");
  element.textContent = message;
  element.classList.toggle("is-error", isError);
}

function showConfirmationStep() {
  $("#login-form").hidden = true;
  $("#register-form").hidden = true;
  $("#confirmation-form").hidden = false;
  $("#resend-confirmation").hidden = false;
  $("#confirmation-code").focus();
}

function showAuthentication(user) {
  state.user = user;
  $("#auth-screen").hidden = true;
  $("#app-shell").hidden = false;
  const initial = user.name.trim().charAt(0).toUpperCase() || "Y";
  $$(".avatar, .top-avatar").forEach((element) => {
    element.textContent = initial;
    element.setAttribute("aria-label", `Learner ${user.name}`);
  });
  $("#profile-name").textContent = user.name;
  $("#profile-email").textContent = user.email;
  $("#profile-verified").textContent = user.emailVerified
    ? "Email confirmed"
    : "Email not confirmed";
  $("#profile-avatar").textContent = initial;
  $(".profile-copy strong").textContent = user.name;
  $(".profile-copy small").textContent = user.email;
  if (!applicationInitialized) initializeApplication();
}

async function postAuth(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Could not complete sign-in.");
  return result;
}

function initializeAuthControls() {
  $("#login-tab").addEventListener("click", () => {
    $("#login-tab").classList.add("is-active");
    $("#register-tab").classList.remove("is-active");
    $("#login-tab").setAttribute("aria-selected", "true");
    $("#register-tab").setAttribute("aria-selected", "false");
    $("#login-form").hidden = false;
    $("#register-form").hidden = true;
    $("#confirmation-form").hidden = true;
    $("#resend-confirmation").hidden = true;
    showAuthMessage("");
  });
  $("#register-tab").addEventListener("click", () => {
    $("#register-tab").classList.add("is-active");
    $("#login-tab").classList.remove("is-active");
    $("#register-tab").setAttribute("aria-selected", "true");
    $("#login-tab").setAttribute("aria-selected", "false");
    $("#register-form").hidden = false;
    $("#login-form").hidden = true;
    $("#confirmation-form").hidden = true;
    $("#resend-confirmation").hidden = true;
    showAuthMessage("");
  });
  $("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const result = await postAuth("/api/auth/login", {
        email: form.get("email"),
        password: form.get("password"),
      });
      showAuthentication(result.user);
    } catch (error) {
      showAuthMessage(error.message, true);
      $("#resend-confirmation").hidden = !error.message.includes("confirm your email");
    }
  });
  $("#register-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const result = await postAuth("/api/auth/register", {
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      });
      $("#login-email").value = form.get("email");
      $("#register-form").reset();
      showConfirmationStep();
      showAuthMessage(result.message);
    } catch (error) {
      showAuthMessage(error.message, true);
      if (error.message.includes("pending account")) {
        $("#login-email").value = form.get("email");
        $("#resend-confirmation").hidden = false;
      }
    }
  });
  $("#confirmation-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const result = await postAuth("/api/auth/confirm", {
        code: form.get("code"),
      });
      $("#confirmation-form").reset();
      $("#login-tab").click();
      showAuthMessage(result.message);
    } catch (error) {
      showAuthMessage(error.message, true);
    }
  });
  $("#resend-confirmation").addEventListener("click", async () => {
    try {
      const result = await postAuth("/api/auth/resend", {
        email: $("#login-email").value,
      });
      $("#register-tab").click();
      showConfirmationStep();
      showAuthMessage(result.message);
    } catch (error) {
      showAuthMessage(error.message, true);
    }
  });
  $("#logout-button").addEventListener("click", async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Could not log out.");
      state.user = null;
      $("#app-shell").hidden = true;
      $("#auth-screen").hidden = false;
      showAuthMessage("You have logged out.");
    } catch (error) {
      toast(error.message, true);
    }
  });
}

async function initializeAuthentication() {
  initializeAuthControls();
  refreshIcons();
  const query = new URLSearchParams(window.location.search);
  const confirmationToken = query.get("confirm");
  if (confirmationToken) {
    try {
      const response = await fetch(
        `/api/auth/confirm?token=${encodeURIComponent(confirmationToken)}`,
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not confirm email.");
      showAuthMessage(result.message);
      $("#login-tab").click();
    } catch (error) {
      showAuthMessage(error.message, true);
    } finally {
      window.history.replaceState({}, "", window.location.pathname);
    }
  } else if (query.has("auth_error")) {
    showAuthMessage(query.get("message") || "Google sign-in could not be completed.", true);
    window.history.replaceState({}, "", window.location.pathname);
  }
  try {
    const registrationResponse = await fetch("/api/auth/registration-status");
    if (!registrationResponse.ok) {
      throw new Error("Could not check email confirmation status.");
    }
    const registration = await registrationResponse.json();
    const response = await fetch("/api/auth/session");
    if (!response.ok) throw new Error("Could not check your sign-in session.");
    const result = await response.json();
    if (result.user) {
      showAuthentication(result.user);
      if (query.get("auth") === "google") toast("Signed in with Google.");
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }
    $("#auth-screen").hidden = false;
    if (registration.pending) {
      $("#register-tab").click();
      showConfirmationStep();
      showAuthMessage("Enter the 6-digit code sent to your email.");
    }
  } catch (error) {
    console.error("Sign-in session could not be checked.", error);
    $("#auth-screen").hidden = false;
    showAuthMessage("Could not connect to the sign-in service. Please try again.", true);
  }
}

function initializeApplication() {
  if (applicationInitialized) return;
  applicationInitialized = true;
  $$("[data-view]").forEach((button) =>
    button.addEventListener("click", (event) => {
      if (button.tagName === "A") event.preventDefault();
      navigate(button.dataset.view);
    }),
  );
  $("#profile-shortcut").addEventListener("click", () => navigate("profile"));
  $("#mobile-menu").addEventListener("click", () => {
    const isOpen = $(".sidebar").classList.toggle("is-open");
    $("#mobile-menu").setAttribute("aria-expanded", String(isOpen));
    $("#mobile-menu").setAttribute(
      "aria-label",
      isOpen ? "Collapse navigation" : "Expand navigation",
    );
    $("#mobile-menu").innerHTML =
      `<i data-lucide="${isOpen ? "x" : "menu"}"></i>`;
    refreshIcons();
  });
  $("#continue-button").addEventListener("click", () => navigate("course"));
  $("#practice-start").addEventListener("click", () =>
    openLesson([state.selectedTopic]),
  );
  $("#course-start").addEventListener("click", () =>
    openLesson(state.selectedTopics),
  );
  $("#lesson-back").addEventListener("click", () => navigate("course"));
  $("#lesson-continue").addEventListener("click", () => {
    if (state.lessonIndex < state.activeTopics.length - 1) {
      state.lessonIndex += 1;
      renderLesson();
      return;
    }
    startPractice();
  });
  $("#lesson-reveal").addEventListener("click", (event) => {
    const answer = $("#lesson-reveal-answer");
    const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
    event.currentTarget.setAttribute("aria-expanded", String(!expanded));
    answer.hidden = expanded;
    event.currentTarget.innerHTML = expanded
      ? '<i data-lucide="eye"></i> Reveal what this code does'
      : '<i data-lucide="eye-off"></i> Hide explanation';
    refreshIcons();
  });
  $("#lesson-run-example").addEventListener("click", () => {
    $("#code-editor").value = lessons[state.lessonTopicId].example;
    navigate("lab");
    $("#code-editor").focus();
  });
  $("#lesson-check-order").addEventListener("click", () => {
    const expected = lessons[state.lessonTopicId].challenge;
    const arranged = [...$("#lesson-sort-list").children].map((item) =>
      Number(item.dataset.order),
    );
    const correct = arranged.every((order, index) => order === index);
    $("#lesson-challenge-feedback").textContent = correct
      ? "That’s right — the code is in a useful order."
      : `Not quite yet. ${expected.length} line${expected.length === 1 ? "" : "s"} to arrange. Try moving a line with the arrows or dragging it.`;
    $("#lesson-challenge-feedback").classList.toggle("is-correct", correct);
    $("#lesson-challenge-feedback").classList.toggle("is-wrong", !correct);
  });
  $("#run-code").addEventListener("click", runCode);
  $("#clear-output").addEventListener("click", () => {
    $("#console-output").textContent = "Your output will appear here.";
    $("#console-output").classList.remove("is-error");
    $("#run-time").textContent = "READY WHEN YOU ARE";
  });
  $("#code-editor").addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const editor = event.currentTarget;
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.setRangeText("    ", start, end, "end");
    }
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      runCode();
    }
  });
  selectTopic("syntax");
  loadProgress();
  refreshIcons();
}

document.addEventListener("DOMContentLoaded", initializeAuthentication, {
  once: true,
});
