const things = ["aback", "abaft", "abandoned", "abashed", "aberrant", "abhorrent", "abiding", "abject", "ablaze", "able", "abnormal", "aboard", "aboriginal", "abortive", "abounding", "abrasive", "abrupt", "absent", "absorbed", "absorbing", "abstracted", "absurd", "abundant", "abusive", "accept", "acceptable", "accessible", "accidental", "account", "accurate", "achiever", "acid", "acidic", "acoustic", "acoustics", "acrid", "act", "action", "activity", "actor", "actually", "ad hoc", "adamant", "adaptable", "add", "addicted", "addition", "adhesive", "adjoining", "adjustment", "admire", "admit", "adorable", "adventurous", "advertisement", "advice", "advise", "afford", "afraid", "aftermath", "afternoon", "afterthought", "aggressive", "agonizing", "agree", "agreeable", "agreement", "ahead", "air", "airplane", "airport", "ajar", "alarm", "alcoholic", "alert", "alike", "alive", "alleged", "allow", "alluring", "aloof", "amazing", "ambiguous", "ambitious", "amount", "amuck", "amuse", "amused", "amusement", "amusing", "analyze", "ancient", "anger", "angle", "angry", "animal", "animated", "announce", "annoy", "annoyed", "annoying", "answer", "ants", "anxious", "apathetic", "apologise", "apparatus", "apparel", "appear", "applaud", "appliance", "appreciate", "approval", "approve", "aquatic", "arch", "argue", "argument", "arithmetic", "arm", "army", "aromatic", "arrange", "arrest", "arrive", "arrogant", "art", "ashamed", "ask", "aspiring", "assorted", "astonishing", "attach", "attack", "attempt", "attend", "attract", "attraction", "attractive", "aunt", "auspicious", "authority", "automatic", "available", "average", "avoid", "awake", "aware", "awesome", "awful", "axiomatic", "babies", "baby", "back", "bad", "badge", "bag", "bait", "bake", "balance", "ball", "ban", "bang", "barbarous", "bare", "base", "baseball", "bashful", "basin", "basket", "basketball", "bat", "bath", "bathe", "battle", "bawdy", "bead", "beam", "bear", "beautiful", "bed", "bedroom", "beds", "bee", "beef", "befitting", "beg", "beginner", "behave", "behavior", "belief", "believe", "bell", "belligerent", "bells", "belong", "beneficial", "bent", "berry", "berserk", "best", "better", "bewildered", "big", "bike", "bikes", "billowy", "bird", "birds", "birth", "birthday", "bit", "bite", "bite-sized", "bitter", "bizarre", "black", "black-and-white", "blade", "bleach", "bless", "blind", "blink", "blood", "bloody", "blot", "blow", "blue", "blue-eyed", "blush", "blushing", "board", "boast", "boat", "boil", "boiling", "bolt", "bomb", "bone", "book", "books", "boorish", "boot", "border", "bore", "bored", "boring", "borrow", "bottle", "bounce", "bouncy", "boundary", "boundless", "bow", "box", "boy", "brainy", "brake", "branch", "brash", "brass", "brave", "brawny", "breakable", "breath", "breathe", "breezy", "brick", "bridge", "brief", "bright", "broad", "broken", "brother", "brown", "bruise", "brush", "bubble", "bucket", "building", "bulb", "bump", "bumpy", "burly", "burn", "burst", "bury", "bushes", "business", "bustling", "busy", "butter", "button", "buzz", "cabbage", "cable", "cactus", "cagey", "cake", "cakes", "calculate", "calculating", "calculator", "calendar", "call", "callous", "calm", "camera", "camp", "can", "cannon", "canvas", "cap", "capable", "capricious", "caption", "car", "card", "care", "careful", "careless", "caring", "carpenter", "carriage", "carry", "cars", "cart", "carve", "cast", "cat", "cats", "cattle", "cause", "cautious", "cave", "ceaseless", "celery", "cellar", "cemetery", "cent", "certain", "chalk", "challenge", "chance", "change", "changeable", "channel", "charge", "charming", "chase", "cheap", "cheat", "check", "cheer", "cheerful", "cheese", "chemical", "cherries", "cherry", "chess", "chew", "chicken", "chickens", "chief", "childlike", "children", "chilly", "chin", "chivalrous", "choke", "chop", "chubby", "chunky", "church", "circle", "claim", "clam", "clammy", "clap", "class", "classy", "clean", "clear", "clever", "clip", "cloistered", "close", "closed", "cloth", "cloudy", "clover", "club", "clumsy", "cluttered", "coach", "coal", "coast", "coat", "cobweb", "coherent", "coil", "cold", "collar", "collect", "color", "colorful", "colossal", "colour", "comb", "combative", "comfortable", "command", "committee", "common", "communicate", "company", "compare", "comparison", "compete", "competition", "complain", "complete", "complex", "concentrate", "concern", "concerned", "condemned", "condition", "confess", "confuse", "confused", "connect", "connection", "conscious", "consider", "consist", "contain", "continue", "control", "cooing", "cook", "cool", "cooperative", "coordinated", "copper", "copy", "corn", "correct", "cough", "count", "country", "courageous", "cover", "cow", "cowardly", "cows", "crabby", "crack", "cracker", "crash", "crate", "craven", "crawl", "crayon", "crazy", "cream", "creator", "creature", "credit", "creepy", "crib", "crime", "crook", "crooked", "cross", "crow", "crowd", "crowded", "crown", "cruel", "crush", "cry", "cub", "cuddly", "cultured", "cumbersome", "cup", "cure", "curious", "curl", "curly", "current", "curtain", "curve", "curved", "curvy", "cushion", "cut", "cute", "cycle", "cynical", "dad", "daffy", "daily", "dam", "damage", "damaged", "damaging", "damp", "dance", "dangerous", "dapper", "dare", "dark", "dashing", "daughter", "day", "dazzling", "dead", "deadpan", "deafening", "dear", "death", "debonair", "debt", "decay", "deceive", "decide", "decision", "decisive", "decorate", "decorous", "deep", "deeply", "deer", "defeated", "defective", "defiant", "degree", "delay", "delicate", "delicious", "delight", "delightful", "delirious", "deliver", "demonic", "depend", "dependent", "depressed", "deranged", "describe", "descriptive", "desert", "deserted", "deserve", "design", "desire", "desk", "destroy", "destruction", "detail", "detailed", "detect", "determined", "develop", "development", "devilish", "didactic", "different", "difficult", "digestion", "diligent", "dime", "dinner", "dinosaurs", "direction", "direful", "dirt", "dirty", "disagree", "disagreeable", "disappear", "disapprove", "disarm", "disastrous", "discover", "discovery", "discreet", "discussion", "disgusted", "disgusting", "disillusioned", "dislike", "dispensable", "distance", "distinct", "distribution", "disturbed", "divergent", "divide", "division", "dizzy", "dock", "doctor", "dog", "dogs", "doll", "dolls", "domineering", "donkey", "door", "double", "doubt", "doubtful", "downtown", "drab", "draconian", "drag", "drain", "dramatic", "drawer", "dream", "dreary", "dress", "drink", "drip", "driving", "drop", "drown", "drum", "drunk", "dry", "duck", "ducks", "dull", "dust", "dusty", "dynamic", "dysfunctional", "eager", "ear", "early", "earn", "earsplitting", "earth", "earthquake", "earthy", "easy", "eatable", "economic", "edge", "educate", "educated", "education", "effect", "efficacious", "efficient", "egg", "eggnog", "eggs", "eight", "elastic", "elated", "elbow", "elderly", "electric", "elegant", "elfin", "elite", "embarrass", "embarrassed", "eminent", "employ", "empty", "enchanted", "enchanting", "encourage", "encouraging", "end", "endurable", "energetic", "engine", "enjoy", "enormous", "enter", "entertain", "entertaining", "enthusiastic", "envious", "equable", "equal", "erect", "erratic", "error", "escape", "ethereal", "evanescent", "evasive", "even", "event", "examine", "example", "excellent", "exchange", "excite", "excited", "exciting", "exclusive", "excuse", "exercise", "exist", "existence", "exotic", "expand", "expansion", "expect", "expensive", "experience", "expert", "explain", "explode", "extend", "extra-large", "extra-small", "exuberant", "exultant", "eye", "eyes", "fabulous", "face", "fact", "fade", "faded", "fail", "faint", "fair", "fairies", "faithful", "fall", "fallacious", "false", "familiar", "famous", "fanatical", "fancy", "fang", "fantastic", "far", "far-flung", "farm", "fascinated", "fast", "fasten", "fat", "faulty", "fax", "fear", "fearful", "fearless", "feeble", "feeling", "feigned", "female", "fence", "fertile", "festive", "fetch", "few", "field", "fierce", "file", "fill", "film", "filthy", "fine", "finger", "finicky", "fire", "fireman", "first", "fish", "fit", "five", "fix", "fixed", "flag", "flagrant", "flaky", "flame", "flap", "flash", "flashy", "flat", "flavor", "flawless", "flesh", "flight", "flimsy", "flippant", "float", "flock", "flood", "floor", "flow", "flower", "flowers", "flowery", "fluffy", "fluttering", "fly", "foamy", "fog", "fold", "follow", "food", "fool", "foolish", "foot", "force", "foregoing", "forgetful", "fork", "form", "fortunate", "found", "four", "fowl", "fragile", "frail", "frame", "frantic", "free", "freezing", "frequent", "fresh", "fretful", "friction", "friend", "friendly", "friends", "frighten", "frightened", "frightening", "frog", "frogs", "front", "fruit", "fry", "fuel", "full", "fumbling", "functional", "funny", "furniture", "furry", "furtive", "future", "futuristic", "fuzzy", "gabby", "gainful", "gamy", "gaping", "garrulous", "gate", "gather", "gaudy", "gaze", "geese", "general", "gentle", "ghost", "giant", "giants", "giddy", "gifted", "gigantic", "giraffe", "girl", "girls", "glamorous", "glass", "gleaming", "glib", "glistening", "glorious", "glossy", "glove", "glow", "glue", "godly", "gold", "good", "goofy", "gorgeous", "government", "governor", "grab", "graceful", "grade", "grain", "grandfather", "grandiose", "grandmother", "grape", "grass", "grate", "grateful", "gratis", "gray", "grease", "greasy", "great", "greedy", "green", "greet", "grey", "grieving", "grin", "grip", "groan", "groovy", "grotesque", "grouchy", "ground", "group", "growth", "grubby", "gruesome", "grumpy", "guarantee", "guard", "guarded", "guess", "guide", "guiltless", "guitar", "gullible", "gun", "gusty", "guttural", "habitual", "hair", "haircut", "half", "hall", "hallowed", "halting", "hammer", "hand", "handle", "hands", "handsome", "handsomely", "handy", "hang", "hanging", "hapless", "happen", "happy", "harass", "harbor", "hard", "hard-to-find", "harm", "harmonious", "harmony", "harsh", "hat", "hate", "hateful", "haunt", "head", "heady", "heal", "health", "healthy", "heap", "heartbreaking", "heat", "heavenly", "heavy", "hellish", "help", "helpful", "helpless", "hesitant", "hideous", "high", "high-pitched", "highfalutin", "hilarious", "hill", "hissing", "historical", "history", "hobbies", "hole", "holiday", "holistic", "hollow", "home", "homeless", "homely", "honey", "honorable", "hook", "hop", "hope", "horn", "horrible", "horse", "horses", "hose", "hospitable", "hospital", "hot", "hour", "house", "houses", "hover", "hug", "huge", "hulking", "hum", "humdrum", "humor", "humorous", "hungry", "hunt", "hurried", "hurry", "hurt", "hushed", "husky", "hydrant", "hypnotic", "hysterical", "ice", "icicle", "icky", "icy", "idea", "identify", "idiotic", "ignorant", "ignore", "ill", "ill-fated", "ill-informed", "illegal", "illustrious", "imaginary", "imagine", "immense", "imminent", "impartial", "imperfect", "impolite", "important", "imported", "impossible", "impress", "improve", "impulse", "incandescent", "include", "income", "incompetent", "inconclusive", "increase", "incredible", "industrious", "industry", "inexpensive", "infamous", "influence", "inform", "inject", "injure", "ink", "innate", "innocent", "inquisitive", "insect", "insidious", "instinctive", "instruct", "instrument", "insurance", "intelligent", "intend", "interest", "interesting", "interfere", "internal", "interrupt", "introduce", "invent", "invention", "invincible", "invite", "irate", "iron", "irritate", "irritating", "island", "itch", "itchy", "jaded", "jagged", "jail", "jam", "jar", "jazzy", "jealous", "jeans", "jelly", "jellyfish", "jewel", "jittery", "jobless", "jog", "join", "joke", "jolly", "joyous", "judge", "judicious", "juggle", "juice", "juicy", "jumbled", "jump", "jumpy", "juvenile", "kaput", "keen", "kettle", "key", "kick", "kill", "kind", "kindhearted", "kindly", "kiss", "kittens", "kitty", "knee", "kneel", "knife", "knit", "knock", "knot", "knotty", "knowing", "knowledge", "knowledgeable", "known", "label", "labored", "laborer", "lace", "lackadaisical", "lacking", "ladybug", "lake", "lame", "lamentable", "lamp", "land", "language", "languid", "large", "last", "late", "laugh", "laughable", "launch", "lavish", "lazy", "lean", "learn", "learned", "leather", "left", "leg", "legal", "legs", "lethal", "letter", "letters", "lettuce", "level", "lewd", "library", "license", "lick", "lie", "light", "lighten", "like", "likeable", "limit", "limping", "line", "linen", "lip", "liquid", "list", "listen", "literate", "little", "live", "lively", "living", "load", "loaf", "lock", "locket", "lonely", "long", "long-term", "longing", "look", "loose", "lopsided", "loss", "loud", "loutish", "love", "lovely", "loving", "low", "lowly", "lucky", "ludicrous", "lumber", "lumpy", "lunch", "lunchroom", "lush", "luxuriant", "lying", "lyrical", "macabre", "machine", "macho", "maddening", "madly", "magenta", "magic", "magical", "magnificent", "maid", "mailbox", "majestic", "makeshift", "male", "malicious", "mammoth", "man", "manage", "maniacal", "many", "marble", "march", "mark", "marked", "market", "married", "marry", "marvelous", "mask", "mass", "massive", "match", "mate", "material", "materialistic", "matter", "mature", "meal", "mean", "measly", "measure", "meat", "meaty", "meddle", "medical", "meek", "meeting", "mellow", "melodic", "melt", "melted", "memorize", "memory", "men", "mend", "merciful", "mere", "mess up", "messy", "metal", "mice", "middle", "mighty", "military", "milk", "milky", "mind", "mindless", "mine", "miniature", "minister", "minor", "mint", "minute", "miscreant", "miss", "mist", "misty", "mitten", "mix", "mixed", "moan", "moaning", "modern", "moldy", "mom", "momentous", "money", "monkey", "month", "moon", "moor", "morning", "mother", "motion", "motionless", "mountain", "mountainous", "mourn", "mouth", "move", "muddle", "muddled", "mug", "multiply", "mundane", "murder", "murky", "muscle", "mushy", "mute", "mysterious", "nail", "naive", "name", "nappy", "narrow", "nasty", "nation", "natural", "naughty", "nauseating", "near", "neat", "nebulous", "necessary", "neck", "need", "needle", "needless", "needy", "neighborly", "nerve", "nervous", "nest", "new", "next", "nice", "nifty", "night", "nimble", "nine", "nippy", "nod", "noise", "noiseless", "noisy", "nonchalant", "nondescript", "nonstop", "normal", "north", "nose", "nostalgic", "nosy", "note", "notebook", "notice", "noxious", "null", "number", "numberless", "numerous", "nut", "nutritious", "nutty", "oafish", "oatmeal", "obedient", "obeisant", "obese", "obey", "object", "obnoxious", "obscene", "obsequious", "observant", "observation", "observe", "obsolete", "obtain", "obtainable", "occur", "ocean", "oceanic", "odd", "offbeat", "offend", "offer", "office", "oil", "old", "old-fashioned", "omniscient", "one", "onerous", "open", "opposite", "optimal", "orange", "oranges", "order", "ordinary", "organic", "ossified", "outgoing", "outrageous", "outstanding", "oval", "oven", "overconfident", "overflow", "overjoyed", "overrated", "overt", "overwrought", "owe", "own", "pack", "paddle", "page", "pail", "painful", "painstaking", "paint", "pale", "paltry", "pan", "pancake", "panicky", "panoramic", "paper", "parallel", "parcel", "parched", "park", "parsimonious", "part", "partner", "party", "pass", "passenger", "past", "paste", "pastoral", "pat", "pathetic", "pause", "payment", "peace", "peaceful", "pear", "peck", "pedal", "peel", "peep", "pen", "pencil", "penitent", "perfect", "perform", "periodic", "permissible", "permit", "perpetual", "person", "pest", "pet", "petite", "pets", "phobic", "phone", "physical", "picayune", "pick", "pickle", "picture", "pie", "pies", "pig", "pigs", "pin", "pinch", "pine", "pink", "pipe", "piquant", "pizzas", "place", "placid", "plain", "plan", "plane", "planes", "plant", "plantation", "plants", "plastic", "plate", "plausible", "play", "playground", "pleasant", "please", "pleasure", "plot", "plough", "plucky", "plug", "pocket", "point", "pointless", "poised", "poison", "poke", "polish", "polite", "political", "pollution", "poor", "pop", "popcorn", "porter", "position", "possess", "possessive", "possible", "post", "pot", "potato", "pour", "powder", "power", "powerful", "practice", "pray", "preach", "precede", "precious", "prefer", "premium", "prepare", "present", "preserve", "press", "pretend", "pretty", "prevent", "previous", "price", "pricey", "prick", "prickly", "print", "private", "probable", "produce", "productive", "profit", "profuse", "program", "promise", "property", "prose", "protect", "protective", "protest", "proud", "provide", "psychedelic", "psychotic", "public", "puffy", "pull", "pump", "pumped", "punch", "puncture", "punish", "punishment", "puny", "purple", "purpose", "purring", "push", "pushy", "puzzled", "puzzling", "quack", "quaint", "quarrelsome", "quarter", "quartz", "queen", "question", "questionable", "queue", "quick", "quickest", "quicksand", "quiet", "quill", "quilt", "quince", "quirky", "quiver", "quixotic", "quizzical", "rabbit", "rabbits", "rabid", "race", "racial", "radiate", "ragged", "rail", "railway", "rain", "rainstorm", "rainy", "raise", "rake", "rambunctious", "rampant", "range", "rapid", "rare", "raspy", "rat", "rate", "ratty", "ray", "reach", "reaction", "reading", "ready", "real", "realize", "reason", "rebel", "receipt", "receive", "receptive", "recess", "recognise", "recondite", "record", "red", "reduce", "redundant", "reflect", "reflective", "refuse", "regret", "regular", "reign", "reject", "rejoice", "relation", "relax", "release", "relieved", "religion", "rely", "remain", "remarkable", "remember", "remind", "reminiscent", "remove", "repair", "repeat", "replace", "reply", "report", "representative", "reproduce", "repulsive", "request", "rescue", "resolute", "resonant", "respect", "responsible", "rest", "retire", "return", "reward", "rhetorical", "rhyme", "rhythm", "rice", "rich", "riddle", "rifle", "right", "righteous", "rightful", "rigid", "ring", "rings", "rinse", "ripe", "risk", "ritzy", "river", "road", "roasted", "rob", "robin", "robust", "rock", "rod", "roll", "romantic", "roof", "room", "roomy", "root", "rose", "rot", "rotten", "rough", "round", "route", "royal", "rub", "ruddy", "rude", "ruin", "rule", "run", "rural", "rush", "rustic", "ruthless", "sable", "sack", "sad", "safe", "sail", "salt", "salty", "same", "sand", "sassy", "satisfy", "satisfying", "save", "savory", "saw", "scale", "scandalous", "scarce", "scare", "scarecrow", "scared", "scarf", "scary", "scatter", "scattered", "scene", "scent", "school", "science", "scientific", "scintillating", "scissors", "scold", "scorch", "scrape", "scratch", "scrawny", "scream", "screeching", "screw", "scribble", "scrub", "sea", "seal", "search", "seashore", "seat", "second", "second-hand", "secret", "secretary", "secretive", "sedate", "seed", "seemly", "selection", "selective", "self", "selfish", "sense", "separate", "serious", "servant", "serve", "settle", "shade", "shaggy", "shake", "shaky", "shallow", "shame", "shape", "share", "sharp", "shave", "sheep", "sheet", "shelf", "shelter", "shiny", "ship", "shirt", "shiver", "shivering", "shock", "shocking", "shoe", "shoes", "shop", "short", "show", "shrill", "shrug", "shut", "shy", "sick", "side", "sidewalk", "sigh", "sign", "signal", "silent", "silk", "silky", "silly", "silver", "simple", "simplistic", "sin", "sincere", "sink", "sip", "sister", "sisters", "six", "size", "skate", "ski", "skillful", "skin", "skinny", "skip", "skirt", "sky", "slap", "slave", "sleep", "sleepy", "sleet", "slim", "slimy", "slip", "slippery", "slope", "sloppy", "slow", "small", "smart", "smash", "smell", "smelly", "smile", "smiling", "smoggy", "smoke", "smooth", "snail", "snails", "snake", "snakes", "snatch", "sneaky", "sneeze", "sniff", "snobbish", "snore", "snotty", "snow", "soak", "soap", "society", "sock", "soda", "sofa", "soft", "soggy", "solid", "somber", "son", "song", "songs", "soothe", "sophisticated", "sordid", "sore", "sort", "sound", "soup", "sour", "space", "spade", "spare", "spark", "sparkle", "sparkling", "special", "spectacular", "spell", "spicy", "spiders", "spiffy", "spiky", "spill", "spiritual", "spiteful", "splendid", "spoil", "sponge", "spooky", "spoon", "spot", "spotless", "spotted", "spotty", "spray", "spring", "sprout", "spurious", "spy", "squalid", "square", "squash", "squeak", "squeal", "squealing", "squeamish", "squeeze", "squirrel", "stage", "stain", "staking", "stale", "stamp", "standing", "star", "stare", "start", "statement", "station", "statuesque", "stay", "steadfast", "steady", "steam", "steel", "steep", "steer", "stem", "step", "stereotyped", "stew", "stick", "sticks", "sticky", "stiff", "stimulating", "stingy", "stir", "stitch", "stocking", "stomach", "stone", "stop", "store", "stormy", "story", "stove", "straight", "strange", "stranger", "strap", "straw", "stream", "street", "strengthen", "stretch", "string", "strip", "striped", "stroke", "strong", "structure", "stuff", "stupendous", "stupid", "sturdy", "subdued", "subsequent", "substance", "substantial", "subtract", "succeed", "successful", "succinct", "suck", "sudden", "suffer", "sugar", "suggest", "suggestion", "suit", "sulky", "summer", "sun", "super", "superb", "superficial", "supply", "support", "suppose", "supreme", "surprise", "surround", "suspect", "suspend", "swanky", "sweater", "sweet", "sweltering", "swift", "swim", "swing", "switch", "symptomatic", "synonymous", "system", "table", "taboo", "tacit", "tacky", "tail", "talented", "talk", "tall", "tame", "tan", "tangible", "tangy", "tank", "tap", "tart", "taste", "tasteful", "tasteless", "tasty", "tawdry", "tax", "teaching", "team", "tearful", "tease", "tedious", "teeny", "teeny-tiny", "teeth", "telephone", "telling", "temper", "temporary", "tempt", "ten", "tendency", "tender", "tense", "tent", "tenuous", "terrible", "terrific", "terrify", "territory", "test", "tested", "testy", "texture", "thank", "thankful", "thaw", "theory", "therapeutic", "thick", "thin", "thing", "things", "thinkable", "third", "thirsty", "thought", "thoughtful", "thoughtless", "thread", "threatening", "three", "thrill", "throat", "throne", "thumb", "thunder", "thundering", "tick", "ticket", "tickle", "tidy", "tie", "tiger", "tight", "tightfisted", "time", "tin", "tiny", "tip", "tire", "tired", "tiresome", "title", "toad", "toe", "toes", "tomatoes", "tongue", "tooth", "toothbrush", "toothpaste", "toothsome", "top", "torpid", "touch", "tough", "tour", "tow", "towering", "town", "toy", "toys", "trace", "trade", "trail", "train", "trains", "tramp", "tranquil", "transport", "trap", "trashy", "travel", "tray", "treat", "treatment", "tree", "trees", "tremble", "tremendous", "trick", "tricky", "trip", "trite", "trot", "trouble", "troubled", "trousers", "truck", "trucks", "truculent", "true", "trust", "truthful", "try", "tub", "tug", "tumble", "turkey", "turn", "twig", "twist", "two", "type", "typical", "ubiquitous", "ugliest", "ugly", "ultra", "umbrella", "unable", "unaccountable", "unadvised", "unarmed", "unbecoming", "unbiased", "uncle", "uncovered", "understood", "underwear", "undesirable", "undress", "unequal", "unequaled", "uneven", "unfasten", "unhealthy", "uninterested", "unique", "unit", "unite", "unkempt", "unknown", "unlock", "unnatural", "unpack", "unruly", "unsightly", "unsuitable", "untidy", "unused", "unusual", "unwieldy", "unwritten", "upbeat", "uppity", "upset", "uptight", "use", "used", "useful", "useless", "utopian", "utter", "uttermost", "vacation", "vacuous", "vagabond", "vague", "valuable", "value", "van", "vanish", "various", "vase", "vast", "vegetable", "veil", "vein", "vengeful", "venomous", "verdant", "verse", "versed", "vessel", "vest", "victorious", "view", "vigorous", "violent", "violet", "visit", "visitor", "vivacious", "voice", "voiceless", "volatile", "volcano", "volleyball", "voracious", "voyage", "vulgar", "wacky", "waggish", "wail", "wait", "waiting", "wakeful", "walk", "wall", "wander", "wandering", "want", "wanting", "war", "warlike", "warm", "warn", "wary", "wash", "waste", "wasteful", "watch", "water", "watery", "wave", "waves", "wax", "way", "weak", "wealth", "wealthy", "weary", "weather", "week", "weigh", "weight", "welcome", "well-groomed", "well-made", "well-off", "well-to-do", "wet", "wheel", "whimsical", "whine", "whip", "whirl", "whisper", "whispering", "whistle", "white", "whole", "wholesale", "wicked", "wide", "wide-eyed", "wiggly", "wild", "wilderness", "willing", "wind", "window", "windy", "wine", "wing", "wink", "winter", "wipe", "wire", "wiry", "wise", "wish", "wistful", "witty", "wobble", "woebegone", "woman", "womanly", "women", "wonder", "wonderful", "wood", "wooden", "wool", "woozy", "word", "work", "workable", "worm", "worried", "worry", "worthless", "wound", "wrap", "wrathful", "wreck", "wren", "wrench", "wrestle", "wretched", "wriggle", "wrist", "writer", "writing", "wrong", "wry", "x-ray", "yak", "yam", "yard", "yarn", "yawn", "year", "yell", "yellow", "yielding", "yoke", "young", "youthful", "yummy", "zany", "zealous", "zebra", "zephyr", "zesty", "zinc", "zip", "zipper", "zippy", "zonked", "zoo", "zoom"]

const baseData = {
    "id": "2ihneCwliFo",
    "created_at": "2020-02-17T02:03:30-05:00",
    "updated_at": "2021-12-12T03:10:24-05:00",
    "promoted_at": null,
    "width": 3500,
    "height": 2333,
    "color": "#f3f3f3",
    "blur_hash": "L@N0;rbbIVoe00WURkofR:aes.kC",
    "description": "Vintage oldtimer classic car – stereotype decoration 70s items wobble dog toy and crocheted toilet paper hat",
    "alt_description": "white and black dog lying on green and blue textile",
    "urls": {
        "raw": "https://images.unsplash.com/photo-1581922730118-2c9bcc450def?ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA&ixlib=rb-1.2.1",
        "full": "https://images.unsplash.com/photo-1581922730118-2c9bcc450def?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA&ixlib=rb-1.2.1&q=85",
        "regular": "https://images.unsplash.com/photo-1581922730118-2c9bcc450def?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA&ixlib=rb-1.2.1&q=80&w=1080",
        "small": "https://images.unsplash.com/photo-1581922730118-2c9bcc450def?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA&ixlib=rb-1.2.1&q=80&w=400",
        "thumb": "https://images.unsplash.com/photo-1581922730118-2c9bcc450def?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA&ixlib=rb-1.2.1&q=80&w=200"
    },
    "links": {
        "self": "https://api.unsplash.com/photos/2ihneCwliFo",
        "html": "https://unsplash.com/photos/2ihneCwliFo",
        "download": "https://unsplash.com/photos/2ihneCwliFo/download?ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA",
        "download_location": "https://api.unsplash.com/photos/2ihneCwliFo/download?ixid=MnwyODE0NDJ8MHwxfHNlYXJjaHwyfHx3b2JibGV8ZW58MHwwfHx8MTYzOTI5ODI3MA"
    },
    "categories": [],
    "likes": 7,
    "liked_by_user": false,
    "current_user_collections": [],
    "sponsorship": null,
    "topic_submissions": {},
    "user": {
        "id": "A7mKxgipFc8",
        "updated_at": "2021-12-12T03:07:53-05:00",
        "username": "markusspiske",
        "name": "Markus Spiske",
        "first_name": "Markus",
        "last_name": "Spiske",
        "twitter_username": null,
        "portfolio_url": "https://freeforcommercialuse.net",
        "bio": "Petty & everyday imagery – digital (5d IV) & analog (Leica R7). NO flights. NO overtourism instagram travel hotspots. NO social media. Thanks for your donation. 🙏 ",
        "location": "Upper Franconia, Bavaria, Germany",
        "links": {
            "self": "https://api.unsplash.com/users/markusspiske",
            "html": "https://unsplash.com/@markusspiske",
            "photos": "https://api.unsplash.com/users/markusspiske/photos",
            "likes": "https://api.unsplash.com/users/markusspiske/likes",
            "portfolio": "https://api.unsplash.com/users/markusspiske/portfolio",
            "following": "https://api.unsplash.com/users/markusspiske/following",
            "followers": "https://api.unsplash.com/users/markusspiske/followers"
        },
        "profile_image": {
            "small": "https://images.unsplash.com/profile-1468003870880-1d44bae203c5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32",
            "medium": "https://images.unsplash.com/profile-1468003870880-1d44bae203c5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64",
            "large": "https://images.unsplash.com/profile-1468003870880-1d44bae203c5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"
        },
        "instagram_username": null,
        "total_collections": 22,
        "total_likes": 5613,
        "total_photos": 3740,
        "accepted_tos": true,
        "for_hire": true,
        "social": {
            "instagram_username": null,
            "portfolio_url": "https://freeforcommercialuse.net",
            "twitter_username": null,
            "paypal_email": null
        }
    },
    "tags": [{
            "type": "search",
            "title": "nürnberg"
        },
        {
            "type": "search",
            "title": "deutschland"
        },
        {
            "type": "search",
            "title": "hat"
        }
    ]
}
class Card {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.r = 16;
        this.objs = [];
        this.shuffle(this.r)
        this.color = this.makeHexString(6)
        this._indexx = 0
        this._indexy = 0
        this.imgs = []
        this.locationsX = []
        this.locationsY = []
        this.data = []
    }

    shuffle(size) {
        for (let index = 0; index < size; index++) {
            let rn = (Math.floor(Math.random() * (things.length)))
            const element = things[rn];
            this.objs[index] = element;
        }
        this.color = this.makeHexString(6)
    }

    initCards(p) {
        for (let index = 0; index < 6; index++) {
            if (this.imgs.length > 5) {
                this.imgs = []
                this.data = []
            }
            p.loadImage(baseData.urls.thumb, _img => {
                this.imgs.push(_img)
                this.data.push(baseData)
                this.locationsX[index] = _img.width / 2 + p.width / 8 + ((p.width / 4) * (index % 3)) + this.x;
                if (index < 3) {
                    this.locationsY[index] = (_img.height / 2) + ((p.height / 4) * (0)) + this.y;
                } else {
                    this.locationsY[index] = (_img.height / 2) + ((p.height / 4) * (1)) + this.y;
                }
            })
        }
    }

    initCardsLocations(p) {
        for (let index = 0; index < 6; index++) {
            this.locationsX[index] = this.imgs[index].width / 2 + p.width / 8 + ((p.width / 4) * (index % 3)) + this.x;
                if (index < 3) {
                    this.locationsY[index] = (this.imgs[index].height / 2) + ((p.height / 4) * (0)) + this.y;
                } else {
                    this.locationsY[index] = (this.imgs[index].height / 2) + ((p.height / 4) * (1)) + this.y;
                }
        }
    }

    checkPressed(p, index) {
        if (p.mouseX > this.locationsX[index] - this.imgs[index].width / 2 && p.mouseX < this.locationsX[index] + this.imgs[index].width / 2) {
            if (p.mouseY > this.locationsY[index] - this.imgs[index].height / 2 && p.mouseY < this.locationsY[index] + this.imgs[index].height / 2) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    checkOver(p, imgDragged, card, index) {
        if (this.locationsX[imgDragged] > card.locationsX[index] - card.imgs[index].width / 2 && this.locationsX[imgDragged] < card.locationsX[index] + card.imgs[index].width) {
            if (this.locationsY[imgDragged] > card.locationsY[index] - card.imgs[index].height / 2 && this.locationsY[imgDragged] < card.locationsY[index] + card.imgs[index].height) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    makeHexString = (length = 6) => {
        let result = ''
        let characters = 'ABCDEF0123456789'
        let charactersLength = characters.length
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }

    show(p) {
        for (let index = 0; index < 6; index++) {
            if (this.imgs[index] == undefined) return
            p.image(this.imgs[index], this.locationsX[index], this.locationsY[index])
        }
    }
}