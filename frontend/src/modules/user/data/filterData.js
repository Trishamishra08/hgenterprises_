export const FILTER_CATEGORIES = {
    PRICE: {
        label: 'Price',
        options: [
            { label: '₹ 0 - ₹ 10,000', min: 0, max: 10000 },
            { label: '₹ 10,000 - ₹ 20,000', min: 10000, max: 20000 },
            { label: '₹ 20,000 - ₹ 30,000', min: 20000, max: 30000 },
            { label: '₹ 30,000 - ₹ 40,000', min: 30000, max: 40000 },
            { label: '₹ 40,000 - ₹ 50,000', min: 40000, max: 50000 },
            { label: '₹ 50,000 and Above', min: 50000, max: 5000000 }
        ]
    },
    TYPE: {
        label: 'Type',
        options: [
            'Earrings', 'Rings', 'Pendants', 'Necklaces', 'Bangles', 'Bracelets', 
            'Mangalsutra', 'Chains', 'Nose Pins', 'Watch Accessory', 'Adjustable Bracelets', 
            'Charms', 'Nose Screws', 'Kids Bangles', 'Kids Rings', 'Kids Bracelets', 
            'Nose Rings', 'Anklets', 'Adjustable Rings', 'Mangalsutra Chains', 
            'Thumb Rings', 'Cufflinks', 'Brooch', 'Midi Rings', 'Hair Pins', 
            'Tie Pin', 'Maang Tikka'
        ]
    },
    METAL: {
        label: 'Metal',
        options: [
            'Rose Gold', 'White Gold', 'Platinum', 'Yellow gold', 'Silver', 
            'Plain Gold/Platinum', 'Gold'
        ]
    },
    GENDER: {
        label: 'Gender',
        options: ['Women', 'Men', 'Kids', 'Unisex']
    },
    OFFERS: {
        label: 'Offers',
        options: ['0% Making Charge', 'Offers']
    },
    GOLD_PURITY: {
        label: 'Gold Purity',
        options: ['18k', '14k', '22k', 'S925 k', '10k']
    },
    STONES: {
        label: 'Stones',
        options: [
            'Diamond', 'Diamond And Gemstone', 'Gemstone', 'Pearl', 'Ruby', 
            'Sapphire', 'Preset Solitaires', 'Emerald', 'Topaz', 'Amethyst', 
            'Citrine', 'Navaratna', 'Quartz', 'Tanzanite', 'Peridot', 'Evil Eye', 
            'Preset Solitaire Earrings', 'Morganite', 'Tourmaline', 'Rhodolite', 
            'Garnet', 'Rose Quartz', 'Aquamarine', 'Crystal', 'Iolite', 
            'Tsavorite', 'Carnelian'
        ]
    },
    OCCASION: {
        label: 'Occasion',
        options: [
            'Akshaya Tritiya', 'Weekend', 'Romance', 'Everyday Wear', 'Workwear', 
            'Vacation', 'Officewear', 'Festive', 'Special Occasion', 'Gifting', 
            'Anniversary', 'Gift', 'Wedding', 'Gift For Her', 'Everyday', 
            'Romantic Occasion', 'Valentines Day', 'Gifts For Her', 'Family Gifting', 
            'Spouse Gifting', 'For Girlfriend', 'Romantic Gifting', 'Love', 
            'Romantic', 'Engagement', 'For Father', 'For Husband', 'Gifts For Him', 
            'For Wife', 'For Sister', 'Women\'s Day', 'For Mother', 'For Brother', 
            'Traditional', 'Festival Gifting', 'Mother\'s Day', 'Raksha Bandhan', 
            'Guru Nanak Jayanti', 'Ram Navami'
        ]
    },
    NUM_OF_STONES: {
        label: '# Of Stones',
        options: ['Multistone', 'Single Stone', 'Solitaire', 'Three Stone', 'Five Stone']
    },
    DESIGN: {
        label: 'Design',
        options: [
            'Classic', 'Fashion', 'Fusion', 'Valentine Designers Pick', 'Enamel', 
            'Modern', 'Floral', 'Wedding Gifts For Bride', 'Hearts', 'Cocktail Nights', 
            'Religious', 'Cluster', 'Colorful Affair', 'Eternity', 'Two Tone', 
            'Composite', 'Statement', 'Foliage Collection', 'Alphabet', 'Station', 
            'Initial', 'Butterfly', 'Adams Collection', 'Cross', 'Tennis', 
            'Charm', 'Gold Showstoppers', 'Sattva Collection', 'Amiraa Collection', 
            'Floral Mischief', 'Zodiac', 'Eternal Gold Collection', 'Journey Collection', 
            'Mayura Collection', 'Rare Label', 'Evermore Collection', 'Oblici Collection', 
            'Sacred Elements Collection', 'Fashionista Collection', 'Swarna Collection', 
            'Celtic Collection', 'Light On You Collection', 'Long', 'Saundarya Collection', 
            'Arm Candy Collection', 'Boardroom Glam 2', 'Love Knot', 'Afrah Collection', 
            'Promise', 'Token Of Love Collection', 'Vintage', 'Bouquet Of Love Collection', 
            'Essentially Light Collection', 'Fearlessly Femme', 'Sound Of Love', 
            'The Coinage Collection', 'Birthstone Jewellery', 'Brunch Ese'
        ]
    },
    STONE_COLOR: {
        label: 'Stone Color',
        options: ['White', 'Red', 'Blue', 'Green', 'Pink', 'Yellow', 'Purple', 'Black', 'Brown', 'Off White']
    },
    ZODIAC: {
        label: 'Zodiac',
        options: ['Gemini', 'Scorpio', 'Libra', 'Virgo', 'Aquarius', 'Cancer', 'Capricorn', 'Leo', 'Pisces', 'Sagittarius', 'Taurus']
    },
    STONE_SHAPE: {
        label: 'Stone Shape',
        options: [
            'Round', 'Pear', 'Marquise', 'Princess', 'Baguette', 'Oval', 
            'Cabochon', 'Heart', 'Button', 'Emerald Cut', 'Drop Plain', 
            'Cushion', 'Trillion', 'Fancy', 'Octagon', 'Beads', 
            'Drop Faceted', 'Hexagon'
        ]
    },
    COLLECTIONS: {
        label: 'Collections',
        options: [
            'A La Mode Collection', 'Aadya Collection', 'Ain Collection', 'Amour Collection', 
            'Ani Collection', 'Antra Collection', 'Araya Collection', 'Arles Collection', 
            'Art Collection', 'Ashta Collection', 'Aurora Collection', 'Ayeneh Collection', 
            'B Iconic Collection', 'Barbie', 'Beatrice Collection', 'Bedazzle Bracelets Collection', 
            'Bluestone Man Collection', 'Boardroom Glam Collection', 'Bold Gold Collection', 
            'Cadenza Collection', 'Carnation Collection', 'Cascade Collection', 'Celestial Collection', 
            'Checkmate Collection', 'Chevron Rings Collection', 'Clay Whispers Collection', 
            'Colour Me Pop Collection', 'Convertible Collection', 'Dainty Dreams Collection', 
            'Dear Daisy Collection', 'Diva-ine Diamonds Collection', 'Due Amore Collection', 
            'Elitia Collection', 'Emilie Collection', 'Endless Brilliance Collection', 'Ever Us Collection', 
            'Evil Eye Collection', 'Fem Delar Collection', 'Fen Collection', 'Flame Of The Forest Collection', 
            'Florence Collection', 'Floret Collection', 'Fluo Collection', 'Gemitsy Collection', 
            'Glam Collection', 'Greece Collection', 'Hannah Collection', 'Heart So Full Collection', 
            'Hello Kitty And Friends', 'Illuminati Collection', 'Impression Collection', 'Its A Match Collection', 
            'Ivoire Collection', 'Jodhpur Collection', 'Kika Collection', 'Kingdom Of Links Officewear Collection', 
            'Kingdom Of Links Party Collection', 'Knit Knot Collection', 'Knots Collection', 'Konark Collection', 
            'Lattice Rebound Collection', 'Liviana Collection', 'Love Bands Collection', 'Lumina Collection', 
            'Mangalam Collection', 'Marine Tales Collection', 'Men In Bold Collection', 'Meraki Collection', 
            'Missy Collection', 'Moda Beads Collection', 'Morning Glory Collection', 'Mystics Collection', 
            'Neo Mint Collection', 'Neovintage Collection', 'Noir Blanc Collection', 'Noir Collection', 
            'Nova Collection', 'Onella Collection', 'Paisley Collection', 'Panache Collection', 
            'Pashmina Collection', 'Pearl Blossom Collection', 'Plique A Jour Collection', 'Pochette Collection', 
            'Pokémon', 'Pruna Flores Collection', 'Pure Love Collection', 'Queen Of Gems Collection', 
            'Rainforest Collection', 'Rajwada Collection', 'Rakhi Collection', 'Raw Reverie Collection', 
            'Regalia Collection', 'Ren Lake Collection', 'Romanisia Collection', 'Roop Collection', 
            'Sabbia Collection', 'Saugat Collection', 'Shalimar Collection', 'Shards Collection', 
            'Sheer Collection', 'Sheer Style Collection', 'Slider Rings Collection', 'Soulmist Collection', 
            'Spectrum Collection', 'Starlight Collection', 'Sway Collection', 'Tarsie Collection', 
            'Teori Collection', 'The Greece Collection', 'The Rainforest Collection', 'The Uphaaar Collection', 
            'The Y Necklaces Collection', 'Thumb Rings Collection', 'Toi Et Moi Collection', 'Tropica Collection', 
            'Tucked Collection', 'Uphaar Collection', 'Vanya Collection', 'Venezia Collection', 
            'Viva Pride Collection', 'Wired Collection', 'You And Me Collection', 'Elysian Collection', 
            'Grazia Collection', 'Precious Promise Collection', 'Pride Collection', 'Runway Collection', 
            'Silene Collection'
        ]
    },
    TANMANIYA: {
        label: 'Tanmaniya',
        options: ['Mangalsutra Pendant']
    },
    CHARACTERISTICS: {
        label: 'Characteristics',
        options: ['Textured', 'Panda', 'Tulip']
    }
};

export const MACHINE_FILTERS = {
    MACHINE_TYPE: {
        label: 'Machine Type',
        options: [
            'Design', 'CAD', 'CAM / 3D Printing', 'Rubber Mould', 'Wax Injection', 
            'Tree Making', 'Investment', 'Burnout', 'Casting', 'Cutting', 
            'Filing', 'Assembly / Soldering', 'Pre-Polish', 'Stone Setting', 
            'Laser Welding', 'Final Polishing', 'Ultrasonic Cleaning', 'Plating', 
            'Quality Check (QC)', 'Hallmark', 'Packing', 'Dispatch', 
            'Inventory & Store', 'Refinery', 'Metal Forming', 'Chain', 
            'Findings', 'Component', 'Stamping / Die Press', 'CNC', 
            'Hollow', 'Rolling Mill', 'Laser Cutting', 'Assembly', 
            'Quality Control (QC)', 'Certification', 'Forming Section', 
            'Testing & Quality'
        ]
    },
    CONDITION: {
        label: 'Condition',
        options: ['New', 'Used Machine']
    },
    COUNTRY: {
        label: 'Country',
        options: ['India', 'China', 'Italy', 'Germany', 'Turkey', 'Thailand', 'United States', 'Japan', 'South Korea']
    },
    OPERATION: {
        label: 'Operation',
        options: ['Automatic', 'Manual']
    },
    HORSEPOWER: {
        label: 'Horsepower',
        options: ['3HP']
    },
    PHASE: {
        label: 'Phase',
        options: ['Single phase (220)']
    },
    PRICE: {
        label: 'Price',
        options: [
            { label: '₹ 0 - ₹ 50,000', min: 0, max: 50000 },
            { label: '₹ 50,000 - ₹ 2,00,000', min: 50000, max: 200000 },
            { label: '₹ 2,00,000 - ₹ 5,00,000', min: 200000, max: 500000 },
            { label: '₹ 5,00,000 - ₹ 10,00,000', min: 500000, max: 1000000 },
            { label: '₹ 10,00,000 and Above', min: 1000000, max: 50000000 }
        ]
    }
};

export const TOOL_FILTERS = {
    TOOL_TYPE: {
        label: 'Tool Category',
        options: [
            'Hand Tools', 'Measuring Tools', 'Hammer & Forming Tools', 
            'Cutting & Filing Tools', 'Soldering Tools', 'Stone Setting Tools', 
            'Polishing & Finishing Tools', 'Casting Tools & Machines', 
            'Engraving & Design Tools', 'Electroplating Tools', 
            'Gold Testing Tools', 'Diamond & Gemstone Tools', 'Safety Tools'
        ]
    },
    SUB_TOOLS: {
        label: 'Specific Tool',
        options: [
            'Flat Nose Pliers', 'Round Nose Pliers', 'Chain Nose Pliers', 'Side Cutter', 'Wire Cutter', 'Tweezers', 'Ring Clamp', 'Hand Vice', 'Bench Pin',
            'Ring Sizer', 'Vernier Caliper', 'Gauge', 'Scale / Digital Weighing Machine', 'Divider',
            'Ball Peen Hammer', 'Rawhide Hammer', 'Nylon Hammer', 'Chasing Hammer', 'Mallet', 'Mandrels', 'Ring Mandrel', 'Bracelet Mandrel', 'Dapping Set',
            'Jeweller’s Saw Frame', 'Saw Blades', 'Needle Files', 'Flat File', 'Burrs', 'Gravers',
            'Gas Torch', 'Soldering Board', 'Solder Pick', 'Flux', 'Charcoal Block', 'Third Hand Holder',
            'Bezel Pusher', 'Prong Pusher', 'Stone Setter', 'Burnisher', 'Beading Tool',
            'Buffing Machine', 'Polishing Motor', 'Emery Paper', 'Polishing Compound', 'Ultrasonic Cleaner', 'Magnetic Polisher', 'Steam Cleaner',
            'Wax Injector', 'Vacuum Casting Machine', 'Burnout Furnace', 'Melting Furnace', 'Crucibles', 'Investment Mixer',
            'Engraving Machine', 'Laser Engraver', 'CNC Machine', 'CAD Software', '3D Printer',
            'Electroplating Machine', 'Rectifier', 'Plating Tank',
            'Gold Tester', 'XRF Machine', 'Touch Stone Kit', 'Acid Testing Kit',
            'Diamond Loupe', 'Microscope', 'Gem Tester', 'Stone Tray',
            'Safety Glasses', 'Gloves', 'Exhaust Fan', 'Fire Extinguisher', 'Mask'
        ]
    },
    BRANDS: {
        label: 'Tool Brands',
        options: ['PepeTools', 'Foredom', 'Durston', 'GRS', 'Grobet']
    },
    COUNTRY: {
        label: 'Country',
        options: ['India', 'China', 'Italy', 'Germany', 'Turkey', 'Thailand', 'United States', 'Japan', 'South Korea']
    },
    PRICE: {
        label: 'Price',
        options: [
            { label: '₹ 0 - ₹ 1,000', min: 0, max: 1000 },
            { label: '₹ 1,000 - ₹ 5,000', min: 1000, max: 5000 },
            { label: '₹ 5,000 - ₹ 10,000', min: 5000, max: 10000 },
            { label: '₹ 10,000 - ₹ 25,000', min: 10000, max: 25000 },
            { label: '₹ 25,000 and Above', min: 25000, max: 1000000 }
        ]
    }
};
