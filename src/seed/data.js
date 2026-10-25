export const grades = [
  { code: "nursery", name: "Nursery", order: 1, ageRange: "3-4 years" },
  { code: "kg", name: "Kindergarten", order: 2, ageRange: "4-5 years" },
  { code: "class-1", name: "Class 1", order: 3, ageRange: "6-7 years" },
  { code: "class-2", name: "Class 2", order: 4, ageRange: "7-8 years" },
  { code: "class-3", name: "Class 3", order: 5, ageRange: "8-9 years" },
  { code: "class-4", name: "Class 4", order: 6, ageRange: "9-10 years" },
];

export const subjects = [
  { gradeCode: "nursery", code: "english", name: "English", description: "Letters, words and sounds", color: "#42A5F5" },
  { gradeCode: "nursery", code: "maths", name: "Maths", description: "Numbers and shapes", color: "#66BB6A" },
  { gradeCode: "nursery", code: "evs", name: "EVS", description: "Animals, colors and daily life", color: "#FFA726" },
  { gradeCode: "kg", code: "english", name: "English", description: "Words and simple sentences", color: "#42A5F5" },
  { gradeCode: "kg", code: "maths", name: "Maths", description: "Counting and simple addition", color: "#66BB6A" },
  { gradeCode: "kg", code: "evs", name: "EVS", description: "Home, school and nature", color: "#FFA726" },
  { gradeCode: "class-1", code: "english", name: "English", description: "Reading and grammar basics", color: "#42A5F5" },
  { gradeCode: "class-1", code: "maths", name: "Maths", description: "Addition, subtraction and shapes", color: "#66BB6A" },
  { gradeCode: "class-1", code: "evs", name: "EVS", description: "Plants, animals and family", color: "#FFA726" },
  { gradeCode: "class-2", code: "english", name: "English", description: "Grammar and vocabulary", color: "#42A5F5" },
  { gradeCode: "class-2", code: "maths", name: "Maths", description: "Place value and word problems", color: "#66BB6A" },
  { gradeCode: "class-2", code: "evs", name: "EVS", description: "Food, water and community", color: "#FFA726" },
  { gradeCode: "class-3", code: "english", name: "English", description: "Comprehension and grammar", color: "#42A5F5" },
  { gradeCode: "class-3", code: "maths", name: "Maths", description: "Multiplication and division", color: "#66BB6A" },
  { gradeCode: "class-3", code: "evs", name: "EVS", description: "Our earth and living things", color: "#FFA726" },
  { gradeCode: "class-4", code: "english", name: "English", description: "Reading skills and tenses", color: "#42A5F5" },
  { gradeCode: "class-4", code: "maths", name: "Maths", description: "Fractions, perimeter and factors", color: "#66BB6A" },
  { gradeCode: "class-4", code: "evs", name: "EVS", description: "India, maps and environment", color: "#FFA726" },
];

function mcq(gradeCode, subjectCode, topic, questionText, options, correctOptionId, explanation, difficulty = "easy") {
  return {
    gradeCode,
    subjectCode,
    topic,
    questionText,
    options: options.map(([id, text]) => ({ id, text })),
    correctOptionId,
    explanation,
    difficulty,
    marks: 1,
    language: "en",
  };
}

export const questions = [
  mcq("nursery", "english", "alphabet", "Which letter comes after A?", [["a", "B"], ["b", "D"], ["c", "Z"], ["d", "M"]], "a", "A, B, C is the order of the alphabet."),
  mcq("nursery", "english", "alphabet", "Which word starts with the letter B?", [["a", "Apple"], ["b", "Ball"], ["c", "Cat"], ["d", "Dog"]], "b", "Ball starts with B."),
  mcq("nursery", "maths", "numbers", "How many apples are there? 🍎🍎🍎", [["a", "2"], ["b", "3"], ["c", "4"], ["d", "5"]], "b", "There are 3 apples."),
  mcq("nursery", "maths", "shapes", "A round ball looks like which shape?", [["a", "Square"], ["b", "Triangle"], ["c", "Circle"], ["d", "Star"]], "c", "A ball is round like a circle."),
  mcq("nursery", "evs", "animals", "Which animal says 'meow'?", [["a", "Dog"], ["b", "Cat"], ["c", "Cow"], ["d", "Lion"]], "b", "A cat says meow."),
  mcq("nursery", "evs", "colors", "What color is the sun usually drawn as?", [["a", "Blue"], ["b", "Green"], ["c", "Yellow"], ["d", "Black"]], "c", "The sun is usually yellow."),

  mcq("kg", "english", "words", "Choose the correct spelling.", [["a", "Cta"], ["b", "Cat"], ["c", "Act"], ["d", "Tac"]], "b", "The correct spelling is Cat."),
  mcq("kg", "english", "vowels", "Which of these is a vowel?", [["a", "B"], ["b", "C"], ["c", "A"], ["d", "D"]], "c", "A, E, I, O and U are vowels."),
  mcq("kg", "maths", "counting", "What is 2 + 1?", [["a", "2"], ["b", "3"], ["c", "4"], ["d", "1"]], "b", "2 plus 1 equals 3."),
  mcq("kg", "maths", "comparison", "Which number is bigger?", [["a", "4"], ["b", "7"], ["c", "2"], ["d", "5"]], "b", "7 is the biggest number."),
  mcq("kg", "evs", "body", "We see with our _____.", [["a", "Ears"], ["b", "Nose"], ["c", "Eyes"], ["d", "Hands"]], "c", "We see with our eyes."),
  mcq("kg", "evs", "plants", "A plant needs _____ to grow.", [["a", "Toys"], ["b", "Water"], ["c", "Books"], ["d", "Shoes"]], "b", "Plants need water, sunlight and air."),

  mcq("class-1", "english", "grammar", "The opposite of 'hot' is:", [["a", "Warm"], ["b", "Cold"], ["c", "Big"], ["d", "Fast"]], "b", "Hot and cold are opposites."),
  mcq("class-1", "english", "articles", "Choose the correct article: ___ apple.", [["a", "A"], ["b", "An"], ["c", "The a"], ["d", "Some a"]], "b", "We use 'an' before a vowel sound."),
  mcq("class-1", "maths", "addition", "What is 15 + 4?", [["a", "18"], ["b", "19"], ["c", "21"], ["d", "11"]], "b", "15 plus 4 equals 19."),
  mcq("class-1", "maths", "subtraction", "What is 10 - 6?", [["a", "2"], ["b", "3"], ["c", "4"], ["d", "5"]], "c", "10 minus 6 equals 4."),
  mcq("class-1", "evs", "family", "Your mother's mother is your:", [["a", "Aunt"], ["b", "Sister"], ["c", "Grandmother"], ["d", "Cousin"]], "c", "Mother's mother is grandmother."),
  mcq("class-1", "evs", "animals", "A cow gives us:", [["a", "Wool"], ["b", "Milk"], ["c", "Honey"], ["d", "Silk"]], "b", "Cows give us milk."),

  mcq("class-2", "english", "nouns", "Which word is a noun?", [["a", "Run"], ["b", "Happy"], ["c", "School"], ["d", "Quickly"]], "c", "School is a naming word (noun)."),
  mcq("class-2", "english", "verbs", "Which word is a verb?", [["a", "Jump"], ["b", "Red"], ["c", "Table"], ["d", "Sweet"]], "a", "Jump is an action word (verb)."),
  mcq("class-2", "maths", "place-value", "In 47, the digit 4 is in the _____ place.", [["a", "Ones"], ["b", "Tens"], ["c", "Hundreds"], ["d", "Thousands"]], "b", "47 has 4 tens and 7 ones."),
  mcq("class-2", "maths", "addition", "What is 25 + 13?", [["a", "37"], ["b", "38"], ["c", "28"], ["d", "35"]], "b", "25 plus 13 equals 38."),
  mcq("class-2", "evs", "food", "Which of these is a healthy food?", [["a", "Chips"], ["b", "Candy"], ["c", "Apple"], ["d", "Soda"]], "c", "Fruits like apple are healthy."),
  mcq("class-2", "evs", "water", "We should _____ water.", [["a", "Waste"], ["b", "Save"], ["c", "Pollute"], ["d", "Throw"]], "b", "Water is precious, so we should save it."),

  mcq("class-3", "english", "tenses", "She _____ to school every day.", [["a", "go"], ["b", "goes"], ["c", "going"], ["d", "gone"]], "b", "With 'she', we use goes."),
  mcq("class-3", "english", "punctuation", "Which sentence is correct?", [["a", "where is my bag"], ["b", "Where is my bag?"], ["c", "Where is my bag"], ["d", "where is my bag."]], "b", "Questions start with a capital and end with ?"),
  mcq("class-3", "maths", "multiplication", "What is 7 × 6?", [["a", "36"], ["b", "42"], ["c", "48"], ["d", "40"]], "b", "7 times 6 is 42."),
  mcq("class-3", "maths", "division", "What is 36 ÷ 4?", [["a", "8"], ["b", "9"], ["c", "6"], ["d", "12"]], "b", "4 × 9 = 36, so 36 ÷ 4 = 9."),
  mcq("class-3", "evs", "earth", "The Earth is a:", [["a", "Star"], ["b", "Planet"], ["c", "Moon"], ["d", "Comet"]], "b", "Earth is a planet in the solar system."),
  mcq("class-3", "evs", "plants", "Plants make food using:", [["a", "Photosynthesis"], ["b", "Cooking"], ["c", "Sleeping"], ["d", "Walking"]], "a", "Plants use sunlight to make food by photosynthesis."),

  mcq("class-4", "english", "tenses", "They _____ cricket yesterday.", [["a", "play"], ["b", "plays"], ["c", "played"], ["d", "playing"]], "c", "Yesterday needs the past tense: played."),
  mcq("class-4", "english", "synonyms", "A synonym of 'happy' is:", [["a", "Sad"], ["b", "Angry"], ["c", "Joyful"], ["d", "Tired"]], "c", "Joyful means the same as happy."),
  mcq("class-4", "maths", "fractions", "Which fraction is equal to 1/2?", [["a", "1/4"], ["b", "2/4"], ["c", "3/4"], ["d", "1/3"]], "b", "2/4 simplifies to 1/2."),
  mcq("class-4", "maths", "perimeter", "Perimeter of a square of side 5 cm is:", [["a", "10 cm"], ["b", "15 cm"], ["c", "20 cm"], ["d", "25 cm"]], "c", "Perimeter of a square is 4 × side = 20 cm."),
  mcq("class-4", "evs", "india", "The capital of India is:", [["a", "Mumbai"], ["b", "Kolkata"], ["c", "New Delhi"], ["d", "Chennai"]], "c", "New Delhi is the capital of India."),
  mcq("class-4", "evs", "maps", "A compass is used to find:", [["a", "Time"], ["b", "Direction"], ["c", "Weight"], ["d", "Temperature"]], "b", "A compass shows directions like North and South."),
];
