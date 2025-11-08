export const PROMPT_CATEGORIES = [
    {name: 'None', description: 'No additional styling will be added to your prompt.', subStyles: []},
    {
        name: 'Anime',
        description: 'Blends Japanese animation with global twists. Sub-styles often mix eras, genres, or crossovers for dynamic outputs.',
        subStyles: [
            {name: 'None', value: 'none', description: 'Use only the main style name as a prefix (e.g., "Anime style, ...").'},
            {
                name: 'Studio Ghibli-Inspired',
                description: 'Whimsical, nature-focused fantasy with soft lines and emotional depth.',
                value: 'Studio Ghibli style, '
            },
            {
                name: 'Cyberpunk Anime',
                description: 'Neon-lit dystopias with high-tech mechs and gritty urban vibes.',
                value: 'Cyberpunk anime style, '
            },
            {
                name: 'Semi-Realistic Anime',
                description: 'Blends lifelike proportions with expressive anime eyes and shading.',
                value: 'Semi-realistic anime style, '
            },
            {name: 'Mecha', description: 'Giant robots and mechanical suits in epic battles.', value: 'Mecha anime style, '},
            {
                name: 'Dynamic Action',
                description: 'High-energy movements with power effects and intense expressions.',
                value: 'Dynamic action anime style, '
            },
            {
                name: 'Soft Romantic',
                description: 'Emotional interactions with gentle colors and sparkling accents.',
                value: 'Soft romantic anime style, '
            },
            {
                name: 'Dark Fantasy Anime',
                description: 'Grim, horror-tinged worlds with demons and shadows.',
                value: 'Dark fantasy anime style, '
            },
            {
                name: 'Retro 80s Anime',
                description: 'Vintage cel-shaded look with bold lines and synth vibes.',
                value: '80s retro anime style, '
            },
            {
                name: 'Portal Fantasy',
                description: 'World-crossing elements with magical adaptations and RPG motifs.',
                value: 'Portal fantasy anime style, '
            },
            {
                name: 'Slice-of-Life',
                description: 'Everyday moments with relatable characters and cozy vibes.',
                value: 'Slice-of-life anime style, '
            },
            {
                name: 'Serialized Narrative',
                description: 'Panel-like compositions for ongoing story flows.',
                value: 'Serialized narrative anime style, '
            },
            {
                name: 'Group Dynamic',
                description: 'Interactions among multiple characters with balanced focus.',
                value: 'Group dynamic anime style, '
            }
        ]
    },
    {
        name: 'Realism/Photorealism',
        description: 'Excels in portraits and scenes mimicking photography, with sub-styles varying by subject or technique.',
        subStyles: [
            {
                name: 'None',
                value: 'none',
                description: 'Use only the main style name as a prefix (e.g., "Realism/Photorealism style, ...").'
            },
            {
                name: 'Hyperrealism',
                description: 'Ultra-detailed, almost tangible textures and lighting.',
                value: 'Hyperrealistic, '
            },
            {
                name: 'Cinematic Realism',
                description: 'Film-like depth with dramatic angles and color grading.',
                value: 'Cinematic realism, '
            },
            {
                name: 'Portrait Photorealism',
                description: 'Human faces with natural skin, eyes, and expressions.',
                value: 'Portrait photorealism, '
            },
            {
                name: 'Architectural Realism',
                description: 'Precise building renders with environmental details.',
                value: 'Architectural realism, '
            },
            {
                name: 'Nature Photorealism',
                description: 'Verdant landscapes with dew and foliage intricacies.',
                value: 'Nature photorealism, '
            },
            {
                name: 'Close-Up Detail',
                description: 'Intimate views highlighting textures and fine elements.',
                value: 'Close-up realistic style, '
            },
            {
                name: 'Historical Realism',
                description: 'Period-accurate clothing and settings with grit.',
                value: 'Historical realism, '
            },
            {name: 'Urban Realism', description: 'Bustling city life with crowds and neon realism.', value: 'Urban realism, '},
            {name: 'Stylized Realism', description: 'Subtle artistic tweaks on photoreal bases.', value: 'Stylized realism, '},
            {
                name: 'Documentary Style',
                description: 'Raw, unpolished scenes like news photography.',
                value: 'Documentary photo style, '
            },
            {
                name: 'Object Focus Realism',
                description: 'Clear, highlighted items with neutral lighting.',
                value: 'Object-focused realism, '
            },
            {
                name: 'Wildlife Realism',
                description: 'Animals in habitats with fur and feather fidelity.',
                value: 'Wildlife realism, '
            },
            {
                name: 'Detailed Portrait',
                description: 'Lifelike faces with expressive features.',
                value: 'Detailed portrait realism, '
            },
            {
                name: 'Environmental Immersion',
                description: 'Rich settings enveloping subjects.',
                value: 'Environmental immersion realism, '
            }
        ]
    },
    {
        name: 'Fantasy',
        description: 'Epic worlds of magic and myth, with sub-styles spanning tones from whimsical to grim.',
        subStyles: [
            {
                name: 'None',
                value: 'none',
                description: 'Use only the main style name as a prefix (e.g., "Fantasy style, ...").'
            },
            {
                name: 'High Fantasy',
                description: 'Medieval realms with elves, dragons, and quests.',
                value: 'High fantasy art, '
            },
            {
                name: 'Dark Fantasy',
                description: 'Grimdark horror with undead and moral ambiguity.',
                value: 'Dark fantasy art, '
            },
            {name: 'Urban Fantasy', description: 'Magic in modern cities, like hidden witches.', value: 'Urban fantasy art, '},
            {
                name: 'Steampunk Fantasy',
                description: 'Victorian tech with gears and airships.',
                value: 'Steampunk fantasy style, '
            },
            {
                name: 'Fairy Tale',
                description: 'Whimsical tales with enchanted woods and creatures.',
                value: 'Fairy tale illustration style, '
            },
            {
                name: 'Heroic Adventure',
                description: 'Bold explorers with raw magic and ancient relics.',
                value: 'Heroic adventure fantasy art, '
            },
            {
                name: 'Creature Emphasis',
                description: 'Fantastical beings in natural or enchanted environments.',
                value: 'Creature-focused fantasy art, '
            },
            {
                name: 'Ethereal Grace',
                description: 'Elegant figures in luminous, forested settings.',
                value: 'Ethereal grace fantasy style, '
            },
            {
                name: 'Rugged Craftsmanship',
                description: 'Stout builders in forged, underground realms.',
                value: 'Rugged craftsmanship fantasy style, '
            },
            {name: 'Gothic Fantasy', description: 'Haunted castles with vampires and storms.', value: 'Gothic fantasy art, '},
            {
                name: 'Beast Majesty',
                description: 'Powerful scaled creatures in dramatic poses.',
                value: 'Majestic beast fantasy art, '
            },
            {
                name: 'Celestial Fantasy',
                description: 'Starry realms with gods and floating islands.',
                value: 'Celestial fantasy art, '
            },
            {
                name: 'Oriental Myth',
                description: 'Asian folklore elements with harmonious nature.',
                value: 'Oriental myth fantasy style, '
            },
            {
                name: 'Treasure Hunt Vibe',
                description: 'Exploratory scenes with hidden wonders.',
                value: 'Treasure hunt fantasy art, '
            }
        ]
    },
    {
        name: 'Sci-Fi',
        description: 'Futuristic visions from gritty cyber worlds to cosmic explorations.',
        subStyles: [
            {name: 'None', value: 'none', description: 'Use only the main style name as a prefix (e.g., "Sci-Fi style, ...").'},
            {name: 'Cyberpunk', description: 'Neon dystopias with hackers and megacorps.', value: 'Cyberpunk style, '},
            {name: 'Retro-Futurism', description: '1950s optimism with ray guns and chrome.', value: 'Retro-futurism, '},
            {name: 'Biopunk', description: 'Organic tech with genetic mutations.', value: 'Biopunk sci-fi style, '},
            {
                name: 'Interstellar Epic',
                description: 'Vast cosmic tales with diverse species and ships.',
                value: 'Interstellar epic sci-fi art, '
            },
            {
                name: 'Mechanical Suit',
                description: 'Armored machines in high-tech conflicts.',
                value: 'Mechanical suit sci-fi style, '
            },
            {name: 'Post-Human', description: 'Cyborgs and AI in evolved societies.', value: 'Post-human sci-fi art, '},
            {
                name: 'Hard Sci-Fi',
                description: 'Physics-based realism with tech schematics.',
                value: 'Hard sci-fi illustration, '
            },
            {name: 'Dieselpunk', description: '1930s grit with riveted machines.', value: 'Dieselpunk style, '},
            {name: 'Astro-Mythology', description: 'Space gods and cosmic myths.', value: 'Astro-mythology art, '},
            {name: 'Eco-Sci-Fi', description: 'Post-apocalypse with bio-domes.', value: 'Eco-sci-fi art, '},
            {
                name: 'Survival Wasteland',
                description: 'Harsh, ruined landscapes with resilient figures.',
                value: 'Survival wasteland sci-fi style, '
            },
            {
                name: 'Cosmic Discovery',
                description: 'Unknown worlds with exploratory tech.',
                value: 'Cosmic discovery sci-fi art, '
            }
        ]
    },
    {
        name: 'Retro/Vintage',
        description: 'Nostalgic aesthetics from bygone eras, revived with AI flair.',
        subStyles: [
            {
                name: 'None',
                value: 'none',
                description: 'Use only the main style name as a prefix (e.g., "Retro/Vintage style, ...").'
            },
            {name: 'Art Deco', description: 'Geometric luxury with gold and symmetry.', value: 'Art Deco style, '},
            {name: 'Art Nouveau', description: 'Flowing organic lines and floral motifs.', value: 'Art Nouveau style, '},
            {name: 'Vintage Poster', description: 'Bold typography and illustrative ads.', value: 'Vintage poster style, '},
            {name: 'Chromolithography', description: 'Vibrant, printed color layers from 1900s.', value: 'Chromolithography, '},
            {name: 'Baroque', description: 'Ornate drama with rich drapery.', value: 'Baroque painting style, '},
            {name: 'Ukiyo-e', description: 'Japanese woodblock prints with flat colors.', value: 'Ukiyo-e style, '},
            {name: '1950s Retro', description: 'Atomic age optimism with pastels.', value: '1950s retro style, '},
            {
                name: 'Playful Figure',
                description: 'Charming, stylized poses with vintage flair.',
                value: 'Playful vintage figure style, '
            },
            {name: 'Edwardian', description: 'Lacy elegance with soft pastels.', value: 'Edwardian era style, '},
            {name: 'Mid-Century Modern', description: 'Clean lines and bold geometrics.', value: 'Mid-century modern style, '},
            {
                name: 'Ink Scroll',
                description: 'Brush-like lines evoking ancient manuscripts.',
                value: 'Ink scroll vintage style, '
            }
        ]
    },
    {
        name: 'Surrealism',
        description: 'Dreamlike distortions challenging reality, inspired by masters.',
        subStyles: [
            {
                name: 'None',
                value: 'none',
                description: 'Use only the main style name as a prefix (e.g., "Surrealism style, ...").'
            },
            {
                name: 'Fluid Distortion',
                description: 'Melting forms and impossible blends.',
                value: 'Fluid distortion surrealism, '
            },
            {
                name: 'Paradoxical Objects',
                description: 'Everyday items in illogical arrangements.',
                value: 'Paradoxical object surrealism, '
            },
            {
                name: 'Ernst Collage Surreal',
                description: 'Layered fragments for uncanny narratives.',
                value: 'Ernst collage surrealism, '
            },
            {
                name: 'Kahlo Autobiographical',
                description: 'Personal symbolism with thorny motifs.',
                value: 'Frida Kahlo style surrealism, '
            },
            {name: 'Biomorphic Surreal', description: 'Organic, creature-like hybrids.', value: 'Biomorphic surrealism, '},
            {
                name: 'Dreamlike Landscapes',
                description: 'Floating islands and inverted gravity.',
                value: 'Dreamlike surreal landscape, '
            },
            {
                name: 'Freudian Symbolic',
                description: 'Subconscious icons like eyes and stairs.',
                value: 'Freudian symbolic surrealism, '
            },
            {
                name: 'Pop Surrealism',
                description: 'Whimsical grotesquery with candy colors.',
                value: 'Pop surrealism, lowbrow art, '
            },
            {name: 'Hyper-Surreal', description: 'Exaggerated distortions in vivid detail.', value: 'Hyper-surrealism, '},
            {name: 'Eco-Surreal', description: 'Nature twisted with human elements.', value: 'Eco-surrealism, '},
            {name: 'Mechanical Surreal', description: 'Machines fused with flesh.', value: 'Mechanical surrealism, '},
            {
                name: 'Inner Vision',
                description: 'Symbolic inner thoughts with blended realities.',
                value: 'Inner vision surrealism, '
            }
        ]
    },
    {
        name: 'Cartoon/Illustration',
        description: 'Exaggerated, narrative-driven visuals for fun and storytelling.',
        subStyles: [
            {
                name: 'None',
                value: 'none',
                description: 'Use only the main style name as a prefix (e.g., "Cartoon/Illustration style, ...").'
            },
            {
                name: 'Pixar 3D',
                description: 'Polished, expressive CG with emotional arcs.',
                value: 'Pixar 3D animation style, '
            },
            {
                name: 'Disney Classic',
                description: 'Hand-drawn whimsy with fluid animation.',
                value: 'Classic Disney animation style, '
            },
            {name: 'DreamWorks', description: 'Edgy humor with detailed backgrounds.', value: 'DreamWorks animation style, '},
            {
                name: 'Adventure Time',
                description: 'Surreal candy lands with bold shapes.',
                value: 'Adventure Time cartoon style, '
            },
            {
                name: 'Simpsons',
                description: 'Yellow-skinned satire with clean outlines.',
                value: 'The Simpsons cartoon style, '
            },
            {
                name: 'Rick and Morty',
                description: 'Sci-fi absurdity with warped perspectives.',
                value: 'Rick and Morty cartoon style, '
            },
            {
                name: 'Narrative Panel',
                description: 'Sequential art with shaded storytelling.',
                value: 'Narrative panel illustration style, '
            },
            {
                name: 'Whimsical Illustration',
                description: 'Gentle, colorful drawings for light-hearted scenes.',
                value: 'Whimsical illustration style, '
            },
            {name: 'Webtoon', description: 'Vertical scroll with vibrant digital ink.', value: 'Webtoon style, '},
            {
                name: 'Manhua Flow',
                description: 'Dynamic lines and vibrant digital shading.',
                value: 'Manhua flow illustration style, '
            },
            {
                name: 'Cover Art Focus',
                description: 'Striking compositions for thematic highlights.',
                value: 'Cover art illustration, '
            }
        ]
    },
    {
        name: 'Traditional Painting',
        description: 'Emulates historical mediums like oils and watercolors for timeless appeal.',
        subStyles: [
            {
                name: 'None',
                value: 'none',
                description: 'Use only the main style name as a prefix (e.g., "Traditional Painting style, ...").'
            },
            {
                name: 'Impressionism',
                description: 'Loose brushstrokes capturing light moments.',
                value: 'Impressionist painting, '
            },
            {
                name: 'Renaissance',
                description: 'Balanced compositions with chiaroscuro.',
                value: 'Renaissance painting style, '
            },
            {name: 'Oil Painting', description: 'Rich, layered textures with glazing.', value: 'Oil painting, '},
            {name: 'Watercolor', description: 'Translucent washes for ethereal softness.', value: 'Watercolor painting, '},
            {name: 'Baroque', description: 'Dramatic tenebrism and opulent details.', value: 'Baroque painting, '},
            {name: 'Romanticism', description: 'Emotional storms and heroic figures.', value: 'Romanticism painting, '},
            {name: 'Pointillism', description: 'Dot-based color mixing for vibrancy.', value: 'Pointillism style, '},
            {name: 'Fresco', description: 'Mural-like with aged plaster effects.', value: 'Fresco painting style, '},
            {name: 'Encaustic', description: 'Waxy, heated layers for luminous depth.', value: 'Encaustic painting, '},
            {name: 'Acrylic', description: 'Bold, matte finishes with quick drying.', value: 'Acrylic painting, '},
            {name: 'Gouache', description: 'Opaque vibrancy like matte poster paint.', value: 'Gouache painting, '},
            {name: 'Sumi-e', description: 'Minimalist ink washes for Zen simplicity.', value: 'Sumi-e ink wash painting, '},
            {
                name: 'Oriental Brushwork',
                description: 'Minimalist inks for balanced compositions.',
                value: 'Oriental brushwork style, '
            },
            {name: 'Era Line Art', description: 'Detailed etchings for historical depth.', value: 'Era line art traditional, '}
        ]
    },
    {
        name: 'Digital Art',
        description: 'Modern, tech-infused creations from pixels to vectors.',
        subStyles: [
            {
                name: 'None',
                value: 'none',
                description: 'Use only the main style name as a prefix (e.g., "Digital Art style, ...").'
            },
            {
                name: 'Vector Illustration',
                description: 'Scalable, flat colors with clean paths.',
                value: 'Vector illustration, '
            },
            {
                name: 'Blended Landscape',
                description: 'Layered digital environments for immersive backdrops.',
                value: 'Blended digital landscape, '
            },
            {name: 'Neon Glow', description: 'Vibrant outlines with electric luminescence.', value: 'Neon glow digital art, '},
            {name: 'Holographic', description: 'Shimmering, 3D projections with refractions.', value: 'Holographic style, '},
            {
                name: 'World-Building Sketch',
                description: 'Conceptual layers for expansive scenes.',
                value: 'World-building digital sketch, '
            },
            {
                name: 'Community Render',
                description: 'Polished digital interpretations of characters.',
                value: 'Community render digital style, '
            }
        ]
    },
    {
        name: 'Wuxia/Xianxia',
        description: 'Eastern-inspired martial and spiritual themes with energy flows, ancient motifs, and harmonious or intense atmospheres.',
        subStyles: [
            {
                name: 'None',
                value: 'none',
                description: 'Use only the main style name as a prefix (e.g., "Wuxia/Xianxia style, ...").'
            },
            {
                name: 'Qi Energy Flow',
                description: 'Subtle auras and internal power visualizations.',
                value: 'Qi energy flow style, '
            },
            {name: 'Martial Grace', description: 'Fluid poses and disciplined movements.', value: 'Martial grace style, '},
            {
                name: 'Spiritual Realm',
                description: 'Misty, elevated worlds with ethereal elements.',
                value: 'Spiritual realm style, '
            },
            {
                name: 'Ancient Sect Aesthetic',
                description: 'Traditional architecture and robed figures.',
                value: 'Ancient sect aesthetic, '
            },
            {
                name: 'Demonic Shadow',
                description: 'Darkened energies and mysterious silhouettes.',
                value: 'Demonic shadow style, '
            },
            {
                name: 'Dynasty Elegance',
                description: 'Silk textures and jade accents in historical tones.',
                value: 'Dynasty elegance style, '
            }
        ]
    },
    {
        name: 'Romance',
        description: 'Tender or passionate human connections with soft lighting, expressions, and atmospheric details.',
        subStyles: [
            {
                name: 'None',
                value: 'none',
                description: 'Use only the main style name as a prefix (e.g., "Romance style, ...").'
            },
            {
                name: 'Gentle Intimacy',
                description: 'Close, affectionate moments with warm hues.',
                value: 'Gentle intimacy romance style, '
            },
            {
                name: 'Urban Affection',
                description: 'Modern settings with subtle romantic gestures.',
                value: 'Urban affection style, '
            },
            {
                name: 'Enchanted Bond',
                description: 'Magical elements enhancing emotional ties.',
                value: 'Enchanted bond romance style, '
            },
            {
                name: 'Tension Build',
                description: 'Subtle conflicts leading to connection.',
                value: 'Tension build romance style, '
            },
            {
                name: 'Blushing Softness',
                description: 'Delicate emotions with pastel accents.',
                value: 'Blushing softness style, '
            },
            {
                name: 'Melancholic Yearning',
                description: 'Poignant separations with evocative moods.',
                value: 'Melancholic yearning romance art, '
            }
        ]
    }
];