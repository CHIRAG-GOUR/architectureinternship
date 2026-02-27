// Chapter data structure — add new chapters by adding entries to this array
// Each chapter contains: title, subtitle, intro videos, concept sections, table, golden rule, activities

const chaptersData = [
  {
    id: "1.1",
    tabLabel: "1.1 Language of Form",
    heroSubtitle: "Foundations in classical form • heritage • spatial thinking",
    heroImage: "/assets/Chittorgarh_Fort.jpg",
    moduleTitle: "Module 1: Design Theory & Spatial Literacy",
    moduleSubtitle: "Foundations of how we perceive and organize space.",
    chapterTitle: "Chapter 1: The Language of Form",
    chapterSubtitle: "Understanding mass, volume, and void.",
    introVideos: [
      {
        title: "What is Architecture?",
        url: "https://youtu.be/tfN5sgQjSiI",
      },
      {
        title: "Architecture 101: The Basics in 10 Minutes",
        url: "https://youtu.be/rPveNM9IqYk",
      },
    ],
    chapterVideos: [
      {
        title: "Essential Art Terms Episode 7: Space, Mass, and Volume",
        url: "https://youtu.be/KLJp2OS-F4o",
      },
      {
        title: "Understanding Form in Architecture",
        url: "https://youtu.be/aZx4rk1AkCw",
      },
    ],
    chapterImage: "https://login.skillizee.io/s/articles/699ed2adf10a3d50038d674a/images/1.1_1.png",
    introText:
      "Welcome to the foundation of three-dimensional design. Whether you're an aspiring architect, a sculptor, or just someone trying to figure out why a certain room feels \"off,\" understanding these three pillars is essential.",
    concepts: [
      {
        number: "01",
        title: "Mass: The Solid Presence",
        description:
          'Mass refers to the physical bulk of a solid body. It represents the "positive" space — the material itself. When you look at a heavy marble statue or a solid brick wall, you are experiencing mass.',
        bullets: [
          {
            term: "Visual Weight",
            text: 'Mass often dictates how "heavy" an object looks, regardless of its actual weight.',
          },
          {
            term: "Density",
            text: "High-mass objects feel permanent, grounded, and impenetrable.",
          },
          {
            term: "Function",
            text: "In design, mass is used to provide stability and a sense of protection.",
          },
        ],
        accent: "warm-clay",
      },
      {
        number: "02",
        title: "Volume: The Contained Space",
        description:
          "Volume is the amount of space that an object occupies or encloses. While mass is about the material, volume is about the boundary. A balloon has a large volume but very little mass.",
        bullets: [
          {
            term: 'The "Envelope"',
            text: 'In architecture, the "volume" of a building is the total space defined by its walls, floor, and roof.',
          },
          {
            term: "Interiority",
            text: "Volume is what we experience when we step inside a room. We are standing within the volume created by the structure's mass.",
          },
        ],
        accent: "sage-green",
      },
      {
        number: "03",
        title: "Void: The Power of Nothing",
        description:
          'Void is the "negative" space. It is the hole, the gap, or the deliberate absence of material within or around a mass. Don\'t let the name fool you — in design, a void is just as active and important as the solid parts.',
        bullets: [
          {
            term: "Contrast",
            text: "A void makes mass look lighter and more dynamic.",
          },
          {
            term: "Movement",
            text: "Voids act as pathways for light, air, and people.",
          },
          {
            term: 'The "Carved" Effect',
            text: "Think of a courtyard in the middle of a building; that is a strategic void carved out of a larger volume.",
          },
        ],
        accent: "gold-glow",
      },
    ],
    comparisonTable: {
      headers: ["Concept", "Primary Focus", "Sensory Experience"],
      rows: [
        ["Mass", "Solid material", "Heaviness, strength, opacity"],
        ["Volume", "Defined boundaries", "Spaciousness, containment"],
        ["Void", "Empty space", "Lightness, flow, openness"],
      ],
    },
    goldenRule:
      "Great design isn't just about what you build (Mass); it's about the space you create (Volume) and the parts you leave empty (Void).",
    endingQuote: {
      quote: "Architecture is the learned game, correct and magnificent, of forms assembled in the light.",
      author: "Le Corbusier",
      image: "/assets/le_corbusier.png",
    },
    activities: {
      quiz: {
        title: "Knowledge Check",
        questions: [
          {
            question:
              'In architecture, what does "Mass" primarily refer to?',
            options: [
              "The empty space within a structure",
              "The physical bulk of a solid body",
              "The boundary defined by walls",
              "The decorative elements on a facade",
            ],
            correctIndex: 1,
            explanation:
              'Mass refers to the physical bulk of a solid body — the "positive" space, the material itself.',
          },
          {
            question:
              "A courtyard carved out of the center of a building is an example of:",
            options: ["Mass", "Volume", "Void", "Density"],
            correctIndex: 2,
            explanation:
              "A courtyard is a strategic void — a deliberate absence of material carved out of a larger volume.",
          },
          {
            question:
              'What distinguishes "Volume" from "Mass" in architectural terms?',
            options: [
              "Volume is always heavier than mass",
              "Volume is about the boundary and enclosed space, while mass is about the material",
              "Volume only exists outdoors",
              "There is no difference",
            ],
            correctIndex: 1,
            explanation:
              "Volume is about the total space defined by boundaries (walls, floor, roof), while mass is about the solid material itself.",
          },
        ],
      },
      matching: {
        title: "Match the Concept",
        pairs: [
          {
            concept: "Mass",
            description: "Heaviness, strength, opacity",
          },
          {
            concept: "Volume",
            description: "Spaciousness, containment",
          },
          {
            concept: "Void",
            description: "Lightness, flow, openness",
          },
        ],
      },
      spotTheVoid: {
        title: "Identify the Concepts",
        instruction:
          "For each architectural element below, decide whether it represents Mass, Volume, or Void.",
        items: [
          {
            element: "A thick stone wall of a cathedral",
            answer: "Mass",
          },
          {
            element: "The domed interior space of the Pantheon",
            answer: "Volume",
          },
          {
            element: "An open archway connecting two halls",
            answer: "Void",
          },
          {
            element: "A solid marble column",
            answer: "Mass",
          },
          {
            element: "A window opening in a brick wall",
            answer: "Void",
          },
          {
            element: "The room inside a glass skyscraper floor",
            answer: "Volume",
          },
        ],
      },
    },
  },
  {
    id: "1.2",
    tabLabel: "1.2 Spatial Organization",
    heroSubtitle: "How spaces connect • organize • flow",
    heroImage: "/assets/hawa_mahal.png",
    moduleTitle: "Module 1: Design Theory & Spatial Literacy",
    moduleSubtitle: "Foundations of how we perceive and organize space.",
    chapterTitle: "Chapter 2: Spatial Organization",
    chapterSubtitle: "Linear, radial, and clustered organizations of space.",
    introVideos: [
      {
        title: "Spatial Terminology in Architecture",
        url: "https://youtu.be/K7ZVoeSE0G0",
      },
      {
        title: "Why Linear Cities Don't Work (5 Reasons)",
        url: "https://youtu.be/yHRMcwQHicI",
      },
    ],
    chapterVideos: [
      {
        title: "Spatial Transformations in Architecture",
        url: "https://youtu.be/bKZLyjWjN08",
      },
      {
        title: "Exploring Linear Design in Architecture",
        url: "https://youtu.be/hqABAPxv4_0",
      },
    ],
    chapterImage: "https://login.skillizee.io/s/articles/699ed2adf10a3d50038d674a/images/image-20260226132810-1.png",
    introText:
      "In architecture and design, Spatial Organization is the logic used to connect different rooms or areas. Understanding these three fundamental patterns — linear, radial, and clustered — will change how you see every building you walk into.",
    concepts: [
      {
        number: "01",
        title: "Linear Organization",
        description:
          "A Linear organization consists of a series of spaces arranged in a row. These spaces can be identical or vary in size, but they are always linked by a common line or path.",
        bullets: [
          {
            term: "The Experience",
            text: "It feels like a journey. It has a clear beginning, middle, and end.",
          },
          {
            term: "Directionality",
            text: 'It\'s great for directing movement and creating a sense of "progression."',
          },
          {
            term: "Examples",
            text: "A long hallway in a school, a traditional art gallery, or a row of shops on a street.",
          },
        ],
        accent: "warm-clay",
      },
      {
        number: "02",
        title: "Radial Organization",
        description:
          'A Radial organization consists of a central, dominant space from which a number of linear organizations extend like "arms" or spokes of a wheel.',
        bullets: [
          {
            term: "The Experience",
            text: 'It feels like a hub. Everything revolves around a "heart" or a central focus point.',
          },
          {
            term: "Hierarchy",
            text: "The center is the most important part; the arms provide access to more private or specific areas.",
          },
          {
            term: "Examples",
            text: 'A prison (the "Panopticon" style), a large airport terminal where gates branch off a central lobby, or a starfish-shaped house.',
          },
        ],
        accent: "sage-green",
      },
      {
        number: "03",
        title: "Clustered Organization",
        description:
          "A Clustered organization relies on physical proximity to relate its spaces to one another. It doesn't follow a strict geometry like a line or a circle; instead, spaces are grouped by function, size, or shape.",
        bullets: [
          {
            term: "The Experience",
            text: "It feels organic, like a village. It's flexible and can grow in any direction.",
          },
          {
            term: "Connectivity",
            text: 'Spaces are often linked by a "common" area or simply by touching one another.',
          },
          {
            term: "Examples",
            text: "A typical suburban neighborhood, an ancient stone village, or a collection of different buildings on a college campus.",
          },
        ],
        accent: "gold-glow",
      },
    ],
    comparisonTable: {
      headers: ["Organization", "Best For...", "Main Vibe"],
      rows: [
        ["Linear", "Movement & Sequence", "The Journey"],
        ["Radial", "Central Focus & Control", "The Hub"],
        ["Clustered", "Flexibility & Growth", "The Village"],
      ],
    },
    goldenRule:
      "Next time you visit a building, ask: Is it a long series of rooms (Linear)? Does it have a main lobby with wings branching off (Radial)? Or is it a collection of different rooms tucked into corners (Clustered)?",
    endingQuote: {
      quote: "A room is not a room without natural light.",
      author: "Louis Kahn",
      image: "/assets/louis_kahn.png",
    },
    activities: {
      quiz: {
        title: "Knowledge Check",
        questions: [
          {
            question: "Which spatial organization type feels like a journey with a clear beginning, middle, and end?",
            options: ["Radial", "Linear", "Clustered", "Grid"],
            correctIndex: 1,
            explanation: "Linear organization arranges spaces in a row, creating a sense of progression and journey.",
          },
          {
            question: 'What is the defining feature of a Radial organization?',
            options: [
              "Spaces arranged in a straight line",
              "Spaces grouped by proximity",
              "A central dominant space with arms extending outward",
              "Spaces stacked vertically",
            ],
            correctIndex: 2,
            explanation: 'Radial organization revolves around a central "hub" with linear arms extending outward like spokes.',
          },
          {
            question: "Which organization type best describes an ancient stone village?",
            options: ["Linear", "Radial", "Clustered", "Circular"],
            correctIndex: 2,
            explanation: "Villages grow organically with spaces grouped by proximity — a classic clustered organization.",
          },
        ],
      },
    },
  },
  {
    id: "1.3",
    tabLabel: "1.3 Human Scale",
    heroSubtitle: "How your body shapes every building you enter",
    heroImage: "/assets/human_scale_hero.png",
    moduleTitle: "Module 1: Design Theory & Spatial Literacy",
    moduleSubtitle: "Foundations of how we perceive and organize space.",
    chapterTitle: "Chapter 3: Human Scale & Ergonomics",
    chapterSubtitle: "Designing for the body; the \"Vitruvian\" standard vs. modern inclusivity.",
    introVideos: [
      {
        title: "Why We Need Universal Design | TEDxBoulder",
        url: "https://youtu.be/bVdPNWMGyZY",
      },
      {
        title: "In Search of the Human Scale | Jan Gehl | TEDxKEA",
        url: "https://youtu.be/Cgw9oHDfJ4k",
      },
    ],
    chapterVideos: [
      {
        title: "The Vitruvian Man Explained",
        url: "https://youtu.be/3jZfaCICtnU",
      },
      {
        title: "Vitruvian Proportions in Architecture",
        url: "https://youtu.be/kH8WwdAwNpM",
      },
      {
        title: "Ergonomics in Modern Design",
        url: "https://youtu.be/A88E4DH2asQ",
      },
    ],
    chapterImage: "https://login.skillizee.io/s/articles/69a0154c2d84c655281cf3e2/images/image-20260226151134-1.png",
    introText:
      "Architecture is not just about big ideas; it's about the height of a step, the width of a doorway, and the reach of an arm. This chapter explores how the human body has shaped — and should shape — every building we enter.",
    concepts: [
      {
        number: "01",
        title: "Human Scale: The Measuring Stick",
        description:
          "Human Scale refers to the size of an object or space relative to the dimensions of a human being.",
        bullets: [
          {
            term: "Intimate Scale",
            text: "A small, low-ceilinged reading nook that makes you feel \"hugged.\"",
          },
          {
            term: "Monumental Scale",
            text: "A massive cathedral or a skyscraper lobby that makes you feel small and awestruck.",
          },
          {
            term: "The \"Goldilocks\" Zone",
            text: "Designing spaces that aren't so big they feel cold, nor so small they feel cramped.",
          },
        ],
        accent: "warm-clay",
      },
      {
        number: "02",
        title: "The \"Vitruvian\" Standard: The Idealized Man",
        description:
          "For centuries, design was based on the Vitruvian Man (made famous by Leonardo da Vinci). This theory, proposed by the Roman architect Vitruvius, suggests that the human body is the ultimate model of symmetry and proportion.",
        bullets: [
          {
            term: "Proportion is Perfection",
            text: "The human body is the ultimate model of symmetry and proportion.",
          },
          {
            term: "The \"Standard\" Body",
            text: "Buildings were designed for a \"perfect,\" able-bodied, athletic male figure.",
          },
          {
            term: "The Modulor",
            text: "Le Corbusier created \"The Modulor,\" a scale of proportions based on a man with his arm raised (usually 183 cm or 6 feet tall).",
          },
        ],
        accent: "sage-green",
      },
      {
        number: "03",
        title: "Modern Ergonomics & Inclusivity: Design for Everyone",
        description:
          "Today, the \"Vitruvian\" standard is seen as a limited starting point. Modern Ergonomics is the science of designing environments to fit the actual users, not just an \"ideal\" one.",
        bullets: [
          {
            term: "The \"Average\" is a Myth",
            text: "Humans come in all shapes, sizes, and abilities. Designing for the \"average\" person often means designing for no one perfectly.",
          },
          {
            term: "Universal Design",
            text: "Creating spaces usable by everyone — children, the elderly, wheelchair users, and people with sensory sensitivities — without adaptation.",
          },
          {
            term: "Ergonomic \"Reach\"",
            text: "An inclusive kitchen ensures the reach to a shelf or handle is accessible to someone sitting as well as someone standing.",
          },
        ],
        accent: "gold-glow",
      },
    ],
    comparisonTable: {
      headers: ["The Old Standard (Vitruvian)", "The Modern Standard (Inclusive)"],
      rows: [
        ["Symmetry: Beauty is found in mathematical balance.", "Functionality: Beauty is found in ease of use."],
        ["The \"Ideal\" Body: Designed for a 6ft tall, fit male.", "The \"Diverse\" Body: Designed for the 5th to 95th percentile of all humans."],
        ["Exclusionary: Stairs are the primary focus.", "Accessible: Ramps and elevators are integrated into the core design."],
      ],
    },
    goldenRule:
      "Next time you sit at a desk, reach for a shelf, or walk through a doorway — ask: was this designed for someone like me? What about someone in a wheelchair? A child? That question is the heart of inclusive design.",
    endingQuote: {
      quote: "There are 360 degrees, so why stick to one?",
      author: "Zaha Hadid",
      image: "/assets/zaha_hadid.png",
    },
    activities: {
      quiz: {
        title: "Knowledge Check",
        questions: [
          {
            question: "What does 'Human Scale' refer to in architecture?",
            options: [
              "The total square footage of a building",
              "The size of a space relative to a human body",
              "The number of floors in a building",
              "The weight of building materials",
            ],
            correctIndex: 1,
            explanation: "Human Scale measures how a space relates to the human body — intimate spaces feel cozy, monumental ones feel awe-inspiring.",
          },
          {
            question: "What is the main limitation of the Vitruvian standard?",
            options: [
              "It uses metric measurements",
              "It was designed for an idealized male body only",
              "It only works for modern buildings",
              "It ignores structural engineering",
            ],
            correctIndex: 1,
            explanation: "The Vitruvian standard was based on a 'perfect' male body — excluding women, children, elderly, and people with disabilities.",
          },
          {
            question: "What is Universal Design?",
            options: [
              "Using the same floor plan for all buildings",
              "Making spaces usable by everyone without adaptation",
              "Building only square rooms",
              "Using universal measurements like meters",
            ],
            correctIndex: 1,
            explanation: "Universal Design means creating spaces accessible to ALL people — regardless of age, size, or ability.",
          },
        ],
      },
    },
  },
  {
    id: "1.4",
    tabLabel: "1.4 Site Analysis",
    heroSubtitle: "How climate, topography, and culture shape architecture",
    heroImage: "/assets/site_analysis_hero.png",
    moduleTitle: "Module 1: Design Theory & Spatial Literacy",
    moduleSubtitle: "Foundations of how we perceive and organize space.",
    chapterTitle: "Chapter 4: Site Analysis & Context",
    chapterSubtitle: "How climate, topography, and culture dictate a building's \"DNA.\"",
    introVideos: [],
    chapterVideos: [],
    chapterImage: "https://login.skillizee.io/s/articles/69a01f248b8d2e5aec219fef/images/image-20260226155335-1.png",
    introText:
      "A building does not exist in a vacuum; it is rooted in a specific place. Site Analysis is the process of studying the unique \"personality\" of a location to ensure the architecture belongs there. Chapter 4 is about its environment.",
    concepts: [
      {
        number: "01",
        title: "Climate: The Invisible Architect",
        description:
          "Climate is the most powerful force in determining a building's shape. Design should work with nature, not against it.",
        bullets: [
          {
            term: "Sun Path",
            text: "Architects map the sun's movement to decide where to place windows. In cold climates, you want \"passive solar gain\" (big south-facing windows); in hot climates, you need deep overhangs to provide shade.",
          },
          {
            term: "Wind Patterns",
            text: "Designing for cross-ventilation can reduce the need for air conditioning.",
          },
          {
            term: "Precipitation",
            text: "High rainfall often leads to pitched (sloped) roofs, while arid climates often feature flat roofs and thick walls to keep heat out.",
          },
        ],
        accent: "warm-clay",
      },
      {
        number: "02",
        title: "Topography: The Shape of the Land",
        description:
          "Topography refers to the physical features of the land, specifically its \"slope\" and elevation.",
        bullets: [
          {
            term: "\"Touch the Earth Lightly\"",
            text: "Some architects use stilts or piers to leave the land undisturbed.",
          },
          {
            term: "Earth-Sheltering",
            text: "Building into a hill can provide natural insulation.",
          },
          {
            term: "Contour Lines",
            text: "Understanding the \"rise and run\" of the land prevents flooding and determines where the entrance should be.",
          },
        ],
        accent: "sage-green",
      },
      {
        number: "03",
        title: "Culture & Context: The Social DNA",
        description:
          "Context isn't just physical; it's historical and social. A building should \"speak the language\" of its neighborhood.",
        bullets: [
          {
            term: "Vernacular Architecture",
            text: "\"Architecture without architects\" — buildings made by local people using local materials (like mud bricks in the desert or wood in the forest).",
          },
          {
            term: "Materiality",
            text: "Using local stone or timber makes a building feel like it grew out of the ground.",
          },
          {
            term: "Zoning & History",
            text: "The height, color, and style are often dictated by the \"character\" of the surrounding area to ensure the new building doesn't feel like an alien invader.",
          },
        ],
        accent: "gold-glow",
      },
    ],
    comparisonTable: {
      headers: ["Factor", "Design Response"],
      rows: [
        ["Hot/Arid Climate", "Small windows, thick walls (thermal mass), courtyards."],
        ["Steep Slope", "Terraced levels, balconies, or \"stilt\" foundations."],
        ["Urban Context", "Vertical growth, soundproofing, high density."],
        ["Rural Context", "Horizontal growth, connection to views, local materials."],
      ],
    },
    goldenRule:
      "Case Study — Fallingwater by Frank Lloyd Wright: Instead of building near the waterfall, Wright built the house over it. The house mimics natural rock ledges, uses stone quarried from the property, and the terraces let residents hear the water constantly — making the site part of the interior experience.",
    endingQuote: {
      quote: "Study nature, love nature, stay close to nature. It will never fail you.",
      author: "Frank Lloyd Wright",
      image: "/assets/frank_lloyd_wright.png",
    },
    activities: {
      quiz: {
        title: "Knowledge Check",
        questions: [
          {
            question: "Why do architects map the sun's path across a site?",
            options: [
              "To decide the building's color",
              "To determine optimal window placement for solar gain or shading",
              "To calculate construction time",
              "To estimate material costs",
            ],
            correctIndex: 1,
            explanation: "Sun path analysis determines where to place windows — south-facing for warmth in cold climates, shaded overhangs in hot ones.",
          },
          {
            question: "What is 'vernacular architecture'?",
            options: [
              "Buildings designed by famous architects",
              "Buildings made by local people using local materials",
              "Buildings that use only glass and steel",
              "Any building over 100 years old",
            ],
            correctIndex: 1,
            explanation: "Vernacular architecture is 'architecture without architects' — built by locals using materials native to the region.",
          },
          {
            question: "What makes Fallingwater a masterpiece of site analysis?",
            options: [
              "It was the tallest building of its time",
              "It was built directly over a waterfall, integrating with the natural landscape",
              "It used only imported materials",
              "It ignored the terrain completely",
            ],
            correctIndex: 1,
            explanation: "Wright built Fallingwater over the waterfall, mimicking rock ledges with local stone — the ultimate response to site.",
          },
        ],
      },
    },
  },
  {
    id: "1.5",
    tabLabel: "Precedent Studies",
    heroSubtitle: "Reverse-engineering the masterpieces of architecture",
    heroImage: "/assets/precedent_studies_hero.png",
    moduleTitle: "Module 1: Design Theory & Spatial Literacy",
    moduleSubtitle: "Foundations of how we perceive and organize space.",
    chapterTitle: "Chapter 5: Precedent Studies",
    chapterSubtitle: "Learning the \"greats\" — analyzing iconic buildings to understand their logic.",
    introVideos: [
      {
        title: "Villa Savoye — Le Corbusier's Five Points",
        url: "https://youtu.be/JrORZbp_cG4",
      },
      {
        title: "Barcelona Pavilion — Less is More",
        url: "https://youtu.be/-gBql_ihoBQ",
      },
    ],
    chapterVideos: [
      {
        title: "Salk Institute — The Power of Void",
        url: "https://youtu.be/mQyi0NAaBls",
      },
    ],
    introText:
      "A Precedent Study isn't about looking at pretty pictures of famous buildings — it's about \"reverse-engineering\" them. We analyze the greats to understand the underlying logic, the structural solutions, and the spatial poetry they achieved. Think of it as a post-mortem for architecture: by studying why a building works, you gain a toolkit for your own designs.",
    concepts: [
      {
        number: "01",
        title: "The Why vs. The What",
        description:
          "When analyzing a precedent, we move past the surface level. The What says \"the building is made of glass and steel.\" The Why explains \"the glass dissolves the boundary between interior and forest, creating a sense of infinite volume.\"",
        bullets: [
          {
            term: "Surface vs. Deep",
            text: "Surface-level observation tells you materials; deep analysis reveals intent.",
          },
          {
            term: "Intentional Design",
            text: "Every design decision — from window size to wall thickness — has a reason.",
          },
          {
            term: "Problem Solving",
            text: "Architects don't just choose what looks good, they solve problems through form.",
          },
        ],
      },
      {
        number: "02",
        title: "The Concept (The \"Big Idea\")",
        description:
          "What was the architect trying to say? Is the building a \"machine for living,\" or is it meant to mimic a natural rock formation? In the Guggenheim Museum, Frank Lloyd Wright's concept was a continuous spiral ramp — an \"uninterrupted flow\" of art and movement.",
        bullets: [
          {
            term: "Singular Vision",
            text: "Every great building has a single, clear concept that drives all decisions.",
          },
          {
            term: "One Sentence",
            text: "The concept should be explainable in one sentence.",
          },
          {
            term: "Concept Over Fashion",
            text: "Form follows concept, not fashion.",
          },
        ],
      },
      {
        number: "03",
        title: "Circulation & Program",
        description:
          "How do people move through it? Where is the \"mass\" (solid rooms) versus the \"void\" (hallways, lobbies, atriums)? The relationship between served spaces and servant spaces defines spatial hierarchy.",
        bullets: [
          {
            term: "Choreography",
            text: "Circulation is the choreography of architecture — it scripts human movement.",
          },
          {
            term: "Spatial DNA",
            text: "Mass vs. void analysis reveals the building's spatial DNA.",
          },
          {
            term: "Entry Sequence",
            text: "Entry sequences shape the entire experience of a building.",
          },
        ],
      },
      {
        number: "04",
        title: "Structure & Materiality",
        description:
          "How does it stand up, and what does it feel like? Is the structure hidden inside walls, or is it expressed as part of the beauty? In the Pompidou Center, the 'guts' of the building — pipes, stairs, and ducts — are on the outside, leaving the interior completely open.",
        bullets: [
          {
            term: "Hidden vs. Expressed",
            text: "Structure can be hidden (conventional) or celebrated (expressed).",
          },
          {
            term: "Material Language",
            text: "Material choice communicates — concrete feels heavy, glass feels weightless.",
          },
          {
            term: "Unity",
            text: "The best buildings make structure and beauty inseparable.",
          },
        ],
      },
    ],
    comparisonTable: {
      headers: ["Building", "Architect", "Key Lesson"],
      rows: [
        [
          "Villa Savoye",
          "Le Corbusier",
          "The \"Five Points of Architecture\" — Pilotis, Roof Garden, Free Plan, Horizontal Windows, Free Facade.",
        ],
        [
          "Barcelona Pavilion",
          "Mies van der Rohe",
          "\"Less is More.\" How thin planes and precious materials can define space without enclosing it.",
        ],
        [
          "Salk Institute",
          "Louis Kahn",
          "The power of symmetry and the use of \"void\" — the central courtyard framing the horizon.",
        ],
      ],
    },
    goldenRule:
      "How to Conduct Your Own Precedent Study: (1) Sketch the Plan — drawing forces your brain to notice wall thickness and door logic. (2) Sectional Analysis — a 'slice' of the building shows volume heights and how light enters. (3) Diagramming — use arrows for movement and circles for activity hubs. Remember: the space within became the reality of the building.",
    endingQuote: {
      quote: "Less is more.",
      author: "Mies van der Rohe",
      image: "/assets/mies_van_der_rohe.png",
    },
    activities: {
      quiz: {
        title: "Knowledge Check",
        questions: [
          {
            question:
              "What is the difference between 'The What' and 'The Why' in precedent analysis?",
            options: [
              "The What describes the color; The Why describes the cost",
              "The What describes materials; The Why explains the design intent behind those choices",
              "The What is about structure; The Why is about decoration",
              "There is no difference",
            ],
            correctIndex: 1,
            explanation:
              "Surface-level observation (The What) tells you facts. Deep analysis (The Why) reveals the architect's intent and reasoning.",
          },
          {
            question:
              "Why did the Pompidou Center place its structure and services on the outside?",
            options: [
              "To save money on construction",
              "Because the architect made a mistake",
              "To leave the interior volume completely open and flexible for exhibitions",
              "Because there was no room inside",
            ],
            correctIndex: 2,
            explanation:
              "By externalizing structure and services, Rogers and Piano created the largest possible uninterrupted interior floor plates.",
          },
          {
            question:
              "What is the first step in conducting your own precedent study?",
            options: [
              "Take photographs",
              "Sketch the plan — drawing forces you to notice wall thickness and door logic",
              "Read the Wikipedia article",
              "Visit the building in person",
            ],
            correctIndex: 1,
            explanation:
              "Sketching by hand forces engagement with spatial relationships that passive viewing misses.",
          },
        ],
      },
    },
  },
  {
    id: "2.1",
    tabLabel: "2.1 Orthographic",
    locked: false,
    moduleTitle: "Module 2: Technical Foundations",
    moduleSubtitle: "The Language of Builders",
    chapterTitle: "Chapter 1: Orthographic Projection",
    chapterSubtitle: "Mastering plans, sections, and elevations.",
    heroImage: "/assets/orthographic_hero.png",
    introText:
      "Since you've mastered the conceptual language of form, space, and site, we now move into Technical Foundations. Orthographic Projection is the universal language of builders and designers. It is a way of representing a three-dimensional object in two dimensions by \"flattening\" it onto a series of planes. Imagine a glass box around an object; orthographic projection is what you see when you look perfectly straight at each face of that box.",
    introVideos: [
      {
        title: "What is orthographic, oblique, axonometric or perspective projection? – Teaching of Art",
        url: "https://youtu.be/-J1cSzfl4mk?t=49",
      },
    ],
    chapterVectors: [],
    chapterImage: "https://login.skillizee.io/s/articles/69a1451c5bb20c055a2698b5/images/image-20260227124801-1.png",
    chapterVideos: [
      {
        title: "Understanding Orthographic Drawings",
        url: "https://youtu.be/heIobpUVZqc?si=Pr3kHPnm00ROw98h",
      }
    ],
    concepts: [
      {
        title: "1. The Floor Plan: The Horizontal Cut",
        description:
          "A Floor Plan is a horizontal section cut taken at approximately 4 feet (1.2 meters) above the floor. It looks straight down.",
        bullets: [
          "What it shows: Room layouts, wall thicknesses, door swings, and window locations.",
          "The Logic: Walls that are 'cut' are drawn with thicker lines (often 'hatched' or filled in), while things below the cut line (like furniture or floor patterns) are drawn with thin lines.",
        ],
      },
      {
        title: "2. The Section: The Vertical Slice",
        description:
          "A Section is a vertical cut through the building. Imagine slicing a cake to see the layers inside.",
        bullets: [
          "What it shows: Ceiling heights, the relationship between different floors, and how the 'Mass' of the roof sits on the 'Volume' of the rooms.",
          "The Logic: It reveals the 'thickness' of the floors and the 'voids' of the stairs. It is the best way to understand the scale of a space relative to a person.",
        ],
      },
      {
        title: "3. The Elevation: The External Face",
        description:
          "An Elevation is a view of one side of the building without any cutting. It is a flat, 2D representation of the exterior 'skin.'",
        bullets: [
          "What it shows: Exterior materials (stone, glass, wood), the height of windows, and the overall 'Massing' of the building from the outside.",
          "The Logic: Unlike a photograph, there is no perspective in an elevation. A window at the far end of the wall is drawn the exact same size as a window right in front of you.",
        ],
      },
    ],
    comparisonTable: {
      title: "The Orthographic 'Set'",
      headers: ["View Type", "Direction", "Main Purpose"],
      rows: [
        ["Plan", "Top-Down (Cut)", "Flow, Layout, & Dimensions"],
        ["Section", "Side-View (Cut)", "Height, Structure, & Volume"],
        ["Elevation", "Side-View (Uncut)", "Appearance, Material, & Context"],
      ],
    },
    goldenRule:
      "Pro-Tip: Line Weights. In orthographic drawing, Line Weight is your best friend. Heavy Lines: Used for objects being cut. Medium Lines: Used for the outlines of objects. Light/Dashed Lines: Used for details, textures, or things hidden above the cut line.",
    endingQuote: {
      quote: "To sketch is to plant a seed in the ground. To draft is to build the machine that grows it.",
      author: "Rem Koolhaas",
      image: "/assets/rem_koolhaas.png",
    },
    activities: {
      quiz: {
        title: "Knowledge Check",
        questions: [
          {
            question: "At what approximate height is a floor plan cut taken?",
            options: [
              "Ground level",
              "4 feet (1.2 meters)",
              "Ceiling height",
              "8 feet (2.4 meters)"
            ],
            correctIndex: 1,
            explanation: "Floor plans are cut around 4 feet to clearly show the locations of windows, doors, and walls before reaching the ceiling line.",
          },
          {
            question: "Which drawing type is best for understanding ceiling heights and the relationship between different floors?",
            options: ["Elevation", "Floor Plan", "Section", "Site Plan"],
            correctIndex: 2,
            explanation: "A section slices the building vertically, perfectly revealing heights, floor thicknesses, and stair voids.",
          },
          {
            question: "When drawing an orthographic floor plan, what should be drawn with the heaviest/thickest lines?",
            options: [
              "Furniture and floor tiles",
              "Wall boundaries that are intersected by the cut plane",
              "Windows and doors",
              "Objects located above the cut plane"
            ],
            correctIndex: 1,
            explanation: "Objects that are actively intersected by the cut plane (like walls) use very thick line weights or solid fill ('poche') to emphasize the cut.",
          }
        ],
      },
    },
  },
  {
    id: "2.2",
    tabLabel: "2.2 Perspective",
    locked: false,
    moduleTitle: "Module 2: Technical Foundations",
    moduleSubtitle: "The Language of Builders",
    chapterTitle: "Chapter 2: Perspective & Axonometric",
    chapterSubtitle: "Creating 3D depth on 2D surfaces.",
    heroImage: "/assets/isometric_house_blueprint.png",
    introText:
      "We move from the 'flat' world of orthographic projections into the world of Depth. While plans and sections are for builders, perspective and axonometric drawings are for the human eye—they allow us to see the relationship between mass, volume, and space in 3D.",
    introVideos: [
      {
        title: "Isometric View | How to Construct an Isometric View of an Object",
        url: "https://youtu.be/zKFAbmnUvGU?si=wiHoUj6HW8tSMoUs",
      }
    ],
    chapterVectors: [],
    chapterImage: "https://login.skillizee.io/s/articles/69a15ea9f0f8ad4ade82d457/images/image-20260227143704-1.png",
    chapterVideos: [
      {
        title: "How To Draw A City Using Two Point Perspective",
        url: "https://youtu.be/yNq78n02fMQ",
      }
    ],
    concepts: [
      {
        number: "01",
        title: "1. Axonometric & Isometric: The 'Parallel' 3D",
        description:
          "In these drawings, all vertical and horizontal lines remain parallel. There is no 'vanishing point.' This is the favorite tool of architects because it allows you to measure the drawing accurately.",
        bullets: [
          {
            term: "Isometric",
            text: "All three axes (height, width, depth) are drawn at 120 degrees to each other. It is the most common '3D' technical view.",
          },
          {
            term: "Plan Oblique",
            text: "You take a standard floor plan and simply 'extrude' the walls upward at an angle. It preserves the true shape of the floor plan.",
          },
          {
            term: "The Benefit",
            text: "It shows the interior and exterior simultaneously, like a 'dollhouse' view.",
          },
        ],
        accent: "warm-clay",
      },
      {
        number: "02",
        title: "2. Perspective: The 'Realistic' View",
        description:
          "Perspective mimics how the human eye actually sees. As objects get further away, they appear smaller and eventually disappear into a Vanishing Point.",
        bullets: [
          {
            term: "One-Point Perspective",
            text: "Used when looking directly at a flat surface (like down a long hallway). All lines lead to a single vanishing point. Vibe: Symmetrical, focused, powerful.",
          },
          {
            term: "Two-Point Perspective",
            text: "Used when looking at the corner of a building. Two vanishing points on the horizon line (left and right). Vibe: Most realistic for exterior 'hero' shots.",
          },
          {
            term: "Three-Point Perspective",
            text: "Used for very tall buildings. Two vanishing points on the horizon, one high in sky or deep in ground. Vibe: Dramatic, emphasizes height/depth.",
          },
        ],
        accent: "sage-green",
      },
    ],
    comparisonTable: {
      title: "Axonometric vs Perspective",
      headers: ["Feature", "Axonometric", "Perspective"],
      rows: [
        ["Parallel Lines", "Stay parallel forever", "Converge at a point"],
        ["Measurability", "Can be measured with a scale", "Cannot be measured (distorted)"],
        ["Realism", "Technical / Diagrammatic", "Realistic / Cinematic"],
      ],
    },
    goldenRule:
      "Key Terminology: Horizon Line (eye level), Vanishing Point (where parallel lines meet), Station Point (where you are standing).",
    endingQuote: {
      quote: "To sketch is to plant a seed in the ground. To draft is to build the machine that grows it.",
      author: "Rem Koolhaas",
      image: "/assets/rem_koolhaas.png",
    },
    activities: {
      quiz: {
        title: "Knowledge Check",
        questions: [
          {
            question: "Why do architects often prefer Axonometric/Isometric drawings over Perspectives for technical work?",
            options: [
              "They are faster to sketch",
              "They can be accurately measured with a scale because lines remain parallel",
              "They look more realistic to clients",
              "They use fewer colors"
            ],
            correctIndex: 1,
            explanation: "In axonometric drawings, parallel lines do not converge. This means the drawing is measurable and not distorted by perspective.",
          },
          {
            question: "Which type of drawing uses exactly 120 degrees between all three axes?",
            options: ["Plan Oblique", "One-Point Perspective", "Isometric", "Elevation"],
            correctIndex: 2,
            explanation: "Isometric projection is a specific type of axonometric drawing where the angles between the x, y, and z axes are all exactly 120 degrees.",
          },
          {
            question: "What is the 'Horizon Line' in a perspective drawing?",
            options: [
              "The physical ground the building sits on",
              "The exact center of the page",
              "The eye level of the viewer (Station Point)",
              "The tallest point of the building"
            ],
            correctIndex: 2,
            explanation: "The Horizon Line represents the viewer's exact eye level. Vanishing points typically sit on this line.",
          }
        ],
      },
    },
  },
  {
    id: "2.3",
    tabLabel: "2.3 Digital Modeling",
    locked: false,
    moduleTitle: "Module 2: Technical Foundations",
    moduleSubtitle: "From Board to Screen",
    chapterTitle: "Chapter 1: Digital Modeling (BIM/CAD)",
    chapterSubtitle: "Intro to industry-standard tools like Revit, Rhino, or AutoCAD.",
    heroImage: "/assets/digital_modeling_hero.png",
    introText:
      "We transition from the drafting board to the digital workspace. In the modern industry, we no longer just 'draw' buildings; we build them virtually. This shift is defined by two distinct philosophies: CAD (Computer-Aided Design) and BIM (Building Information Modeling).",
    introVideos: [
      {
        title: "Understand BIM in 1 minute",
        url: "https://youtu.be/omaw1mdk9xg",
      }
    ],
    chapterVectors: [],
    // chapterImage: "", // Omitted since none provided
    chapterVideos: [
      {
        title: "AutoCAD Basic Tutorial for Beginners - Part 1",
        url: "https://youtu.be/cmR9cfWJRUU",
      },
      {
        title: "AutoCAD Basic Tutorial for Beginners - Part 2",
        url: "https://youtu.be/g_jKTv3pLp0",
      },
      {
        title: "AutoCAD Basic Tutorial for Beginners - Part 3",
        url: "https://youtu.be/37S-2wZ2r0Q",
      }
    ],
    concepts: [
      {
        title: "1. AutoCAD: The Digital Pencil",
        description:
          "AutoCAD is the industry standard for 2D drafting. Think of it as an infinite sheet of paper where you use coordinates (x, y) to draw precise lines, circles, and arcs.",
        bullets: [
          "Logic: It is geometry-based. If you draw two lines, the computer doesn't know they are a 'wall'; it just knows they are two parallel lines.",
          "Best For: Detailed construction drawings, electrical layouts, and 2D floor plans where speed and precision are key.",
          {
            term: "Start Learning",
            text: "Watch the introductory video: https://youtu.be/5Zx44MA8gyM"
          }
        ],
      },
      {
        title: "2. Rhino: The Sculptor’s Tool",
        description:
          "Rhino (Rhinoceros 3D) is the go-to software for complex, organic, and 'curvy' geometry. It uses NURBS, which allows for mathematically perfect curves.",
        bullets: [
          "Logic: It is surface-based. It’s perfect for the 'Massing' and 'Form' exercises we did in Chapter 1.",
          "Grasshopper: A plugin for Rhino used for Parametric Design, where you can use 'code' (visual nodes) to create complex patterns impossible to draw by hand.",
          {
            term: "Start Learning",
            text: "Watch 'What is Rhino 3D?': https://youtu.be/XwyJMKLEoCg or 'Pipo Chair Tutorial': https://www.youtube.com/shorts/jizL-7dXTYM. Full Playlist: https://www.youtube.com/playlist?list=PL48k2iKH421iToky9jG7ezc2fYg98dF16"
          }
        ],
      },
      {
        title: "3. Revit: The Virtual Construction Site (BIM)",
        description:
          "Revit is the king of BIM. Unlike CAD, when you 'draw' a line in Revit, you are actually placing a 3D wall that contains data (material, cost, thermal resistance).",
        bullets: [
          "The 'I' in BIM: Every object has Information. If you change a window in a 3D view, it automatically updates in the Floor Plan, Section, and Elevation.",
          "Collaboration: Architects, structural engineers, and plumbers all work on the same 3D model simultaneously.",
          {
            term: "Start Learning",
            text: "Watch 'What Is Revit?': https://youtu.be/_qqT9j0rzuk. Full Playlist: https://www.youtube.com/playlist?list=PL8evaQZnDGAdCKg7XzBVKhFa5kGL7Up5l"
          }
        ],
      },
    ],
    comparisonTable: {
      title: "Digital Tools Comparison",
      headers: ["Tool", "Category", "Strength", "Use Case"],
      rows: [
        ["AutoCAD", "2D CAD", "Precision & Speed", "Construction Details"],
        ["Rhino", "3D Modeling", "Complex Curves/Form", "Conceptual Design"],
        ["Revit", "BIM", "Data & Coordination", "Full Building Project"],
        ["SketchUp", "3D Modeling", "Ease of Use", "Quick Brainstorming"],
      ],
    },
    goldenRule:
      "Key Concept: The 'Single Source of Truth'. The biggest advantage of digital modeling, especially BIM, is that it eliminates errors. In a digital model, the Plan and Section are just different 'cameras' looking at the same 3D object.",
    endingQuote: {
      quote: "Computers are incredibly fast, accurate, and stupid. Human beings are incredibly slow, inaccurate, and brilliant. Together they are powerful beyond imagination.",
      author: "Albert Einstein (attributed)",
      // No image provided
    },
    activities: {
      quiz: {
        title: "Knowledge Check",
        questions: [
          {
            question: "Which of these tools is strictly 'geometry-based' meaning it draws lines but doesn't know what a 'wall' is?",
            options: ["Revit", "AutoCAD", "Grasshopper", "SketchUp"],
            correctIndex: 1,
            explanation: "AutoCAD is geometry-based. It just draws vectors (lines, arcs) based on coordinates.",
          },
          {
            question: "What does the 'I' in BIM stand for?",
            options: ["Illustration", "Information", "Integration", "Iteration"],
            correctIndex: 1,
            explanation: "BIM stands for Building Information Modeling. The data (Information) attached to 3D objects is what makes it powerful.",
          },
        ],
      },
    },
  }
];

export default chaptersData;
