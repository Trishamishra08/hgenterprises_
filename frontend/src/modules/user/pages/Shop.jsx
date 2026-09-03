import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useShop } from '../../../context/ShopContext';
import {
    UserCircle, ChevronRight, Search, X, SlidersHorizontal, Check,
    Image as ImageLucide, MapPin
} from 'lucide-react';
import {
    getCityFromPincode,
    isProductAvailableInPincode,
    getStoreAreaLabel,
    isValidPincodeInput,
} from '../data/storeLocatorData';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FILTER_CATEGORIES, MACHINE_FILTERS, TOOL_FILTERS } from '../data/filterData';
import PopularSearchTags from '../components/PopularSearchTags';
import { getProductDepartment, resolveDepartmentFromCategory, getDepartmentLabel } from '../data/popularSearchData';

// Premium banner asset
import proposalBanner from '../assets/proposal_banner.png';
import catRings from '../assets/cat_rings.png';
import catRingsCustom from '../assets/cat_rings_custom.png';
import catRingsRuby from '../assets/cat_rings_ruby.jpg';
import diamondSolitaire from '../assets/diamond_solitaire.png';
import catRingWine from '../assets/cat_ring_wine.png';
import catPendant from '../assets/cat_pendant.png';
import catEarrings from '../assets/cat_earrings.png';
import catBracelets from '../assets/cat_bracelets.png';

const Shop = () => {
    const { products, categories } = useShop();
    const location = useLocation();
    const navigate = useNavigate();
    const { category: pathCategory } = useParams();
    const searchParams = new URLSearchParams(location.search);

    // States
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Jewellery');
    const [openCategory, setOpenCategory] = useState('Jewellery');
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedType, setSelectedType] = useState('All');
    const [selectedGender, setSelectedGender] = useState('All');
    const [selectedMetal, setSelectedMetal] = useState('All');
    const [selectedOffers, setSelectedOffers] = useState('All');
    const [selectedGoldPurity, setSelectedGoldPurity] = useState('All');
    const [selectedStones, setSelectedStones] = useState('All');
    const [selectedOccasion, setSelectedOccasion] = useState('All');
    const [selectedNumOfStones, setSelectedNumOfStones] = useState('All');
    const [selectedDesign, setSelectedDesign] = useState('All');
    const [selectedStoneColor, setSelectedStoneColor] = useState('All');
    const [selectedZodiac, setSelectedZodiac] = useState('All');
    const [selectedStoneShape, setSelectedStoneShape] = useState('All');
    const [selectedCollections, setSelectedCollections] = useState('All');
    const [selectedTanmaniya, setSelectedTanmaniya] = useState('All');
    const [selectedCharacteristics, setSelectedCharacteristics] = useState('All');
    
    // Machine Filter States
    const [selectedMachineType, setSelectedMachineType] = useState('All');
    const [selectedCondition, setSelectedCondition] = useState('All');
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [selectedOperation, setSelectedOperation] = useState('All');
    const [selectedHorsepower, setSelectedHorsepower] = useState('All');
    const [selectedPhase, setSelectedPhase] = useState('All');
    const [selectedBrand, setSelectedBrand] = useState('All');

    // Tool Filter States
    const [selectedToolType, setSelectedToolType] = useState('All');
    const [selectedSubTool, setSelectedSubTool] = useState('All');
    const [selectedToolBrand, setSelectedToolBrand] = useState('All');

    const [sortBy, setSortBy] = useState('POPULAR');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 }); // Dual price slider support
    const [expandedCategory, setExpandedCategory] = useState(null);

    // Designs in Store — pincode filter
    const [productViewMode, setProductViewMode] = useState('all'); // 'all' | 'inStore'
    const [storePincodeInput, setStorePincodeInput] = useState('');
    const [appliedStorePincode, setAppliedStorePincode] = useState('');
    const [pincodeError, setPincodeError] = useState('');
    
    // Customization Box States
    const [showCustomization, setShowCustomization] = useState(true);
    const [custColor, setCustColor] = useState('YELLOW');
    const [custPurity, setCustPurity] = useState('18Kt');
    const [custCarat, setCustCarat] = useState('0.15');
    const [custQuality, setCustQuality] = useState('SI IJ');

    // Sync with URL params & Normalize Category
    useEffect(() => {
        const categoryQuery = searchParams.get('category') || pathCategory;
        const subcategoryQuery = searchParams.get('subcategory');
        const minPriceQuery = searchParams.get('minPrice');
        const maxPriceQuery = searchParams.get('maxPrice');
        const metalQuery = searchParams.get('metal');
        const typeQuery = searchParams.get('type');
        const genderQuery = searchParams.get('gender');

        if (categoryQuery) {
            const normalizedCat = decodeURIComponent(categoryQuery).toLowerCase();
            const catMatch = categories.find(c => (c.name?.toLowerCase() === normalizedCat) || (c.id?.toLowerCase() === normalizedCat));
            
            // Check if the category is actually a department name
            const isDept = ['jewellery', 'machines', 'machine', 'tools', 'tool'].includes(normalizedCat);

            if (catMatch) {
                setSelectedCategory(catMatch.name);
                setOpenCategory(catMatch.name);
                setExpandedCategory(catMatch.name);
            } else if (isDept) {
                const normalizedDept = normalizedCat.startsWith('machine') ? 'Machines' : (normalizedCat.startsWith('tool') ? 'Tools' : 'Jewellery');
                setSelectedCategory(normalizedDept);
                setOpenCategory(normalizedDept);
                setExpandedCategory(null);
            } else {
                setSelectedCategory(categoryQuery);
                setOpenCategory(categoryQuery);
                setExpandedCategory(categoryQuery);
            }
        }

        if (subcategoryQuery) {
            const normalizedSub = decodeURIComponent(subcategoryQuery).toLowerCase();
            setSelectedSubCategory(subcategoryQuery);
            setSelectedType(subcategoryQuery); // Sync subcategory with type
        }

        if (minPriceQuery && maxPriceQuery) {
            setPriceRange({ min: parseInt(minPriceQuery) || 0, max: parseInt(maxPriceQuery) || 500000 });
        } else if (minPriceQuery) {
            setPriceRange(prev => ({ ...prev, min: parseInt(minPriceQuery) || 0 }));
        } else if (maxPriceQuery) {
            setPriceRange(prev => ({ ...prev, max: parseInt(maxPriceQuery) || 500000 }));
        }

        if (metalQuery) {
            setSelectedMetal(metalQuery);
        }

        if (typeQuery) {
            setSelectedType(typeQuery);
        }

        if (genderQuery) {
            setSelectedGender(genderQuery);
        }
    }, [location.search, categories]);

    // Prevent page scroll when scrolling inside sidebar
    useEffect(() => {
        const handleWheel = (e) => {
            const el = e.target.closest('.js-prevent-page-scroll');
            if (!el) return;
            
            const delta = e.deltaY;
            const scrollTop = el.scrollTop;
            const scrollHeight = el.scrollHeight;
            const clientHeight = el.clientHeight;
            
            if (delta > 0 && scrollTop + clientHeight >= scrollHeight) {
                e.preventDefault();
            }
            if (delta < 0 && scrollTop <= 0) {
                e.preventDefault();
            }
        };
        
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, []);

    // Removal of all automatic scroll logic as requested by user
    // User wants to stay in the same place at all times during selection

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // URL Parameter Filters (from Offers Page)
        const showOnlyOffers = searchParams.get('offers') === 'true';
        const tagFilter = searchParams.get('tag');
        const searchQuery = searchParams.get('search');

        if (showOnlyOffers) {
            result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                (p.name && p.name.toLowerCase().includes(q)) ||
                (p.category && p.category.toString().toLowerCase().includes(q)) ||
                ((p.subcategory || p.subCategory) && (p.subcategory || p.subCategory).toString().toLowerCase().includes(q)) ||
                (p.type && p.type.toLowerCase().includes(q)) ||
                (p.tag && p.tag.toLowerCase().includes(q)) ||
                (p.collection && p.collection.toLowerCase().includes(q))
            );
        }

        if (tagFilter) {
            result = result.filter(p =>
                (p.category && p.category.toLowerCase().includes(tagFilter.toLowerCase())) ||
                ((p.subcategory || p.subCategory) && (p.subcategory || p.subCategory).toLowerCase().includes(tagFilter.toLowerCase())) ||
                (p.name && p.name.toLowerCase().includes(tagFilter.toLowerCase())) ||
                (p.tag && p.tag.toLowerCase().includes(tagFilter.toLowerCase()))
            );
        }

        if (selectedCategory && selectedCategory !== 'All') {
            result = result.filter(p => {
                const catMatch = p.category?.toLowerCase() === selectedCategory.toLowerCase();
                
                // Normalize department comparison (machine vs machines)
                const pDept = p.department?.toLowerCase();
                const sCat = selectedCategory.toLowerCase();
                const deptMatch = pDept === sCat || 
                                 (pDept === 'machines' && sCat === 'machine') || 
                                 (pDept === 'machine' && sCat === 'machines') ||
                                 (pDept === 'tools' && sCat === 'tool') ||
                                 (pDept === 'tool' && sCat === 'tools');
                
                return catMatch || deptMatch;
            });

            if (selectedSubCategory) {
                result = result.filter(p =>
                    ((p.subcategory || p.subCategory) && (p.subcategory || p.subCategory).toLowerCase() === selectedSubCategory.toLowerCase()) ||
                    (p.name && p.name.toLowerCase().includes(selectedSubCategory.toLowerCase()))
                );
            }
        }

        if (selectedType && selectedType !== 'All') {
            result = result.filter(p => {
                const isTypeMatch = p.type?.toLowerCase() === selectedType.toLowerCase();
                const isSubMatch = (p.subcategory || p.subCategory)?.toLowerCase() === selectedType.toLowerCase();
                const isNameMatch = p.name?.toLowerCase().includes(selectedType.toLowerCase());
                return isTypeMatch || isSubMatch || isNameMatch;
            });
        }

        if (selectedGender !== 'All') {
            result = result.filter(p => {
                const target = p.targetGroup?.toLowerCase();
                const selected = selectedGender.toLowerCase();
                if (selected === 'women') return target === 'female' || target === 'women';
                if (selected === 'men') return target === 'male' || target === 'men';
                if (selected === 'kids') return target === 'children' || target === 'kids';
                return target === selected;
            });
        }

        if (selectedMetal !== 'All') {
            result = result.filter(p => {
                const isMetalMatch = p.metal?.toLowerCase() === selectedMetal.toLowerCase();
                const isNameMatch = p.name?.toLowerCase().includes(selectedMetal.toLowerCase());
                const isSpecMatch = p.specifications?.some(s => s.value?.toLowerCase().includes(selectedMetal.toLowerCase()) || s.label?.toLowerCase().includes(selectedMetal.toLowerCase()));
                return isMetalMatch || isNameMatch || isSpecMatch;
            });
        }

        if (selectedOffers !== 'All') {
            result = result.filter(p => 
                (p.offers?.toLowerCase() === selectedOffers.toLowerCase()) || 
                (selectedOffers === '0% Making Charge' && (p.makingCharge === 0 || p.makingCharge === '0'))
            );
        }

        if (selectedGoldPurity !== 'All') {
            result = result.filter(p => 
                (p.goldPurity?.toLowerCase() === selectedGoldPurity.toLowerCase()) || 
                (p.purity?.toLowerCase() === selectedGoldPurity.toLowerCase()) ||
                (p.specifications?.some(s => s.label.toLowerCase().includes('purity') && s.value.toLowerCase().includes(selectedGoldPurity.toLowerCase())))
            );
        }

        if (selectedStones !== 'All') {
            result = result.filter(p => 
                (p.stones?.toLowerCase().includes(selectedStones.toLowerCase())) ||
                (p.stoneType?.toLowerCase().includes(selectedStones.toLowerCase())) ||
                (p.specifications?.some(s => s.label.toLowerCase().includes('stone') && s.value.toLowerCase().includes(selectedStones.toLowerCase())))
            );
        }

        if (selectedOccasion !== 'All') {
            result = result.filter(p => 
                (p.occasion?.toLowerCase().includes(selectedOccasion.toLowerCase())) ||
                (p.occasions?.some(o => o.toLowerCase() === selectedOccasion.toLowerCase()))
            );
        }

        if (selectedNumOfStones !== 'All') {
            result = result.filter(p => 
                (p.numOfStones?.toLowerCase() === selectedNumOfStones.toLowerCase()) ||
                (p.stoneCount?.toString() === selectedNumOfStones)
            );
        }

        if (selectedDesign !== 'All') {
            result = result.filter(p => 
                (p.design?.toLowerCase() === selectedDesign.toLowerCase()) ||
                (p.collection?.toLowerCase().includes(selectedDesign.toLowerCase()))
            );
        }

        if (selectedStoneColor !== 'All') {
            result = result.filter(p => 
                (p.stoneColor?.toLowerCase() === selectedStoneColor.toLowerCase()) ||
                (p.specifications?.some(s => s.label.toLowerCase().includes('color') && s.value.toLowerCase().includes(selectedStoneColor.toLowerCase())))
            );
        }

        if (selectedZodiac !== 'All') {
            result = result.filter(p => 
                (p.zodiac?.toLowerCase() === selectedZodiac.toLowerCase())
            );
        }

        if (selectedStoneShape !== 'All') {
            result = result.filter(p => 
                (p.stoneShape?.toLowerCase() === selectedStoneShape.toLowerCase()) ||
                (p.specifications?.some(s => s.label.toLowerCase().includes('shape') && s.value.toLowerCase().includes(selectedStoneShape.toLowerCase())))
            );
        }

        if (selectedCollections !== 'All') {
            result = result.filter(p => 
                (p.collection?.toLowerCase().includes(selectedCollections.toLowerCase()))
            );
        }

        if (selectedTanmaniya !== 'All') {
            result = result.filter(p => 
                (p.tanmaniya?.toLowerCase() === selectedTanmaniya.toLowerCase()) ||
                (p.subCategory?.toLowerCase() === 'tanmaniya')
            );
        }

        if (selectedCharacteristics !== 'All') {
            result = result.filter(p => 
                (p.characteristics?.toLowerCase().includes(selectedCharacteristics.toLowerCase()))
            );
        }

        // Machine Filters
        if (selectedMachineType !== 'All') {
            result = result.filter(p => 
                (p.machineType?.toLowerCase() === selectedMachineType.toLowerCase()) ||
                (p.subcategory?.toLowerCase() === selectedMachineType.toLowerCase())
            );
        }

        if (selectedCondition !== 'All') {
            result = result.filter(p => 
                (p.condition?.toLowerCase() === selectedCondition.toLowerCase())
            );
        }

        if (selectedCountry !== 'All') {
            result = result.filter(p => 
                (p.country?.toLowerCase() === selectedCountry.toLowerCase())
            );
        }

        if (selectedOperation !== 'All') {
            result = result.filter(p => 
                (p.operation?.toLowerCase() === selectedOperation.toLowerCase())
            );
        }

        if (selectedHorsepower !== 'All') {
            result = result.filter(p => 
                (p.horsepower?.toLowerCase() === selectedHorsepower.toLowerCase())
            );
        }

        if (selectedPhase !== 'All') {
            result = result.filter(p => 
                (p.phase?.toLowerCase() === selectedPhase.toLowerCase())
            );
        }

        if (selectedBrand !== 'All') {
            result = result.filter(p => 
                (p.brand?.toLowerCase().includes(selectedBrand.toLowerCase()))
            );
        }

        // Tool Filters
        if (selectedToolType !== 'All') {
            result = result.filter(p => 
                (p.toolType?.toLowerCase() === selectedToolType.toLowerCase()) ||
                (p.subcategory?.toLowerCase() === selectedToolType.toLowerCase()) ||
                (p.category?.toLowerCase() === selectedToolType.toLowerCase())
            );
        }

        if (selectedSubTool !== 'All') {
            result = result.filter(p => 
                (p.subTool?.toLowerCase() === selectedSubTool.toLowerCase()) ||
                (p.name?.toLowerCase().includes(selectedSubTool.toLowerCase()))
            );
        }

        if (selectedToolBrand !== 'All') {
            result = result.filter(p => 
                (p.brand?.toLowerCase() === selectedToolBrand.toLowerCase())
            );
        }

        // Price Filter
        result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

        if (productViewMode === 'inStore' && appliedStorePincode) {
            result = result.filter((p) => isProductAvailableInPincode(p, appliedStorePincode));
        }

        if (sortBy === 'PRICE LOW TO HIGH') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'PRICE HIGH TO LOW') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'POPULAR') result.sort((a, b) => b.rating - a.rating);
        else if (sortBy === 'WHAT\'S NEW') result.sort((a, b) => (b.isNew === a.isNew) ? 0 : b.isNew ? 1 : -1);
        else if (sortBy === 'DISCOUNT') result.sort((a, b) => (b.discount || 0) - (a.discount || 0));

        return result;
    }, [selectedCategory, selectedSubCategory, selectedType, selectedGender, selectedMetal, selectedOffers, selectedGoldPurity, selectedStones, selectedOccasion, selectedNumOfStones, selectedDesign, selectedStoneColor, selectedZodiac, selectedStoneShape, selectedCollections, selectedTanmaniya, selectedCharacteristics, selectedMachineType, selectedCondition, selectedCountry, selectedOperation, selectedHorsepower, selectedPhase, selectedBrand, selectedToolType, selectedSubTool, selectedToolBrand, priceRange, sortBy, location.search, products, productViewMode, appliedStorePincode]);

    const pageTitle = useMemo(() => {
        return selectedSubCategory || selectedCategory || 'Categories Master';
    }, [selectedCategory, selectedSubCategory]);

    const shopDepartment = useMemo(() => {
        const catData = categories.find(
            (c) => c.name?.toLowerCase() === (openCategory || selectedCategory || '').toLowerCase()
        );
        return resolveDepartmentFromCategory(openCategory || selectedCategory || '', catData);
    }, [openCategory, selectedCategory, categories]);

    const activeFilters = useMemo(() => {
        const chips = [];
        const addChip = (label, clear) => {
            if (label && label !== 'All') chips.push({ id: label, label, clear });
        };

        if (selectedSubCategory) {
            addChip(selectedSubCategory, () => {
                setSelectedSubCategory(null);
                setSelectedType('All');
            });
        }
        if (selectedType && selectedType !== 'All' && selectedType !== selectedSubCategory) {
            addChip(selectedType, () => setSelectedType('All'));
        }
        if (selectedMetal !== 'All') addChip(selectedMetal, () => setSelectedMetal('All'));
        if (selectedGender !== 'All') addChip(selectedGender, () => setSelectedGender('All'));
        if (selectedOffers !== 'All') addChip(selectedOffers, () => setSelectedOffers('All'));
        if (selectedGoldPurity !== 'All') addChip(selectedGoldPurity, () => setSelectedGoldPurity('All'));
        if (selectedStones !== 'All') addChip(selectedStones, () => setSelectedStones('All'));
        if (selectedOccasion !== 'All') addChip(selectedOccasion, () => setSelectedOccasion('All'));
        if (selectedNumOfStones !== 'All') addChip(selectedNumOfStones, () => setSelectedNumOfStones('All'));
        if (selectedDesign !== 'All') addChip(selectedDesign, () => setSelectedDesign('All'));
        if (selectedStoneColor !== 'All') addChip(selectedStoneColor, () => setSelectedStoneColor('All'));
        if (selectedZodiac !== 'All') addChip(selectedZodiac, () => setSelectedZodiac('All'));
        if (selectedStoneShape !== 'All') addChip(selectedStoneShape, () => setSelectedStoneShape('All'));
        if (selectedCollections !== 'All') addChip(selectedCollections, () => setSelectedCollections('All'));
        if (selectedTanmaniya !== 'All') addChip(selectedTanmaniya, () => setSelectedTanmaniya('All'));
        if (selectedCharacteristics !== 'All') addChip(selectedCharacteristics, () => setSelectedCharacteristics('All'));
        if (selectedMachineType !== 'All') addChip(selectedMachineType, () => setSelectedMachineType('All'));
        if (selectedCondition !== 'All') addChip(selectedCondition, () => setSelectedCondition('All'));
        if (selectedCountry !== 'All') addChip(selectedCountry, () => setSelectedCountry('All'));
        if (selectedOperation !== 'All') addChip(selectedOperation, () => setSelectedOperation('All'));
        if (selectedHorsepower !== 'All') addChip(selectedHorsepower, () => setSelectedHorsepower('All'));
        if (selectedPhase !== 'All') addChip(selectedPhase, () => setSelectedPhase('All'));
        if (selectedBrand !== 'All') addChip(selectedBrand, () => setSelectedBrand('All'));
        if (selectedToolType !== 'All') addChip(selectedToolType, () => setSelectedToolType('All'));
        if (selectedSubTool !== 'All') addChip(selectedSubTool, () => setSelectedSubTool('All'));
        if (selectedToolBrand !== 'All') addChip(selectedToolBrand, () => setSelectedToolBrand('All'));

        const searchQuery = searchParams.get('search');
        if (searchQuery) {
            chips.push({
                id: `search-${searchQuery}`,
                label: searchQuery,
                clear: () => {
                    const params = new URLSearchParams(location.search);
                    params.delete('search');
                    navigate(`/shop?${params.toString()}`);
                },
            });
        }

        if (priceRange.min > 0 || priceRange.max < 500000) {
            chips.push({
                id: 'price-range',
                label: `₹${priceRange.min.toLocaleString('en-IN')} – ₹${priceRange.max.toLocaleString('en-IN')}`,
                clear: () => setPriceRange({ min: 0, max: 500000 }),
            });
        }

        if (productViewMode === 'inStore' && appliedStorePincode) {
            const areaLabel = getStoreAreaLabel(appliedStorePincode);
            chips.push({
                id: 'store-pincode',
                label: areaLabel ? `In Store: ${areaLabel}` : `Pincode: ${appliedStorePincode}`,
                clear: () => {
                    setAppliedStorePincode('');
                    setStorePincodeInput('');
                    setPincodeError('');
                },
            });
        }

        return chips;
    }, [
        selectedSubCategory, selectedType, selectedMetal, selectedGender, selectedOffers,
        selectedGoldPurity, selectedStones, selectedOccasion, selectedNumOfStones, selectedDesign,
        selectedStoneColor, selectedZodiac, selectedStoneShape, selectedCollections, selectedTanmaniya,
        selectedCharacteristics, selectedMachineType, selectedCondition, selectedCountry,
        selectedOperation, selectedHorsepower, selectedPhase, selectedBrand, selectedToolType,
        selectedSubTool, selectedToolBrand, priceRange, location.search, navigate,
        productViewMode, appliedStorePincode,
    ]);

    const handleApplyStorePincode = () => {
        const trimmed = storePincodeInput.trim();
        if (!trimmed) {
            setPincodeError('Please enter your 6-digit pincode');
            return;
        }
        if (!isValidPincodeInput(trimmed)) {
            setPincodeError('No HG store found in this area. Try Mumbai, Delhi, Pune, etc.');
            return;
        }
        setPincodeError('');
        setAppliedStorePincode(trimmed);
        console.log('[Shop] Designs in Store — showing designs near', getStoreAreaLabel(trimmed));
    };

    const handleSelectAllProducts = () => {
        setProductViewMode('all');
        setAppliedStorePincode('');
        setStorePincodeInput('');
        setPincodeError('');
    };

    const handleSelectDesignsInStore = () => {
        setProductViewMode('inStore');
        setPincodeError('');
    };

    const storeAreaLabel = appliedStorePincode ? getStoreAreaLabel(appliedStorePincode) : null;

    const enhancedCategories = useMemo(() => {
        return categories.map(cat => {
            const catNameLower = cat.name?.toLowerCase();
            if (catNameLower === 'rings' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Engagement', image: catRings },
                        { name: 'Diamond', image: diamondSolitaire },
                        { name: 'Couple Bands', image: catRings },
                        { name: 'Plain Gold', image: catRingWine },
                        { name: 'Office Wear', image: catRingsCustom },
                        { name: 'Gemstone', image: catRingsRuby },
                        { name: 'Stackable', image: catRings },
                        { name: 'Solitaire', image: diamondSolitaire },
                        { name: 'Slider', image: catRings },
                        { name: 'Cocktail', image: catRingsCustom },
                        { name: 'Religious', image: catRings },
                        { name: 'Multi-finger', image: catRingsCustom },
                        { name: 'Platinum Bands', image: catRings },
                        { name: 'Navaratna', image: catRingsRuby },
                        { name: 'For Men', image: catRings },
                        { name: 'Pearl', image: catRingsCustom },
                        { name: 'For Gift', image: catRings }
                    ]
                };
            } else if (catNameLower === 'pendants' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Diamond', image: diamondSolitaire },
                        { name: 'Gold', image: catRingWine },
                        { name: 'Gemstone', image: catRingsRuby },
                        { name: 'Heart', image: catPendant },
                        { name: 'Religious', image: catPendant },
                        { name: 'Alphabet', image: catPendant }
                    ]
                };
            } else if (catNameLower === 'earrings' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Studs', image: catEarrings },
                        { name: 'Jhumkas', image: catEarrings },
                        { name: 'Drops', image: catEarrings },
                        { name: 'Hoops', image: catEarrings },
                        { name: 'Chandbalis', image: catEarrings },
                        { name: 'Sui Dhaga', image: catEarrings }
                    ]
                };
            } else if (catNameLower === 'necklaces' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Choker', image: catEarrings }, // Fallback to earrings if no necklace image
                        { name: 'Chains', image: catRingWine },
                        { name: 'Collar', image: catEarrings },
                        { name: 'Lariat', image: catEarrings },
                        { name: 'Temple', image: catEarrings },
                        { name: 'Pearl', image: catRingsCustom }
                    ]
                };
            } else if (catNameLower === 'bracelets' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Chain', image: catBracelets },
                        { name: 'Bangles', image: catBracelets },
                        { name: 'Kada', image: catBracelets },
                        { name: 'Charm', image: catBracelets },
                        { name: 'Tennis', image: catBracelets }
                    ]
                };
            } else if (catNameLower === 'mangalsutra' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Modern', image: catRings },
                        { name: 'Traditional', image: catRings },
                        { name: 'Gemstone', image: catRingsRuby },
                        { name: 'Diamond', image: diamondSolitaire }
                    ]
                };
            } else if (catNameLower.includes('tool') && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Measurement & Calibration', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop' },
                        { name: 'Precision Cutting & Piercing', image: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=600&auto=format&fit=crop' },
                        { name: 'Polishing & Refinement', image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?q=80&w=600&auto=format&fit=crop' },
                        { name: 'Setting & Forging', image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=600&auto=format&fit=crop' }
                    ]
                };
            } else if (catNameLower.includes('machine') && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Laser Welding Systems', image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?q=80&w=600&auto=format&fit=crop' },
                        { name: 'Fiber Laser Engravers', image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=600&auto=format&fit=crop' },
                        { name: 'Induction Casting Units', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop' },
                        { name: '3D Wax Printing', image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=600&auto=format&fit=crop' }
                    ]
                };
            }
            return cat;
        });
    }, [categories]);

    const handleCategoryToggle = (name) => {
        setOpenCategory(name);
        setSelectedCategory(name);
        setSelectedSubCategory(null);
        setSelectedType('All');
        setSelectedMetal('All');
    };

    const SidebarContent = () => {
        const currentCatData = enhancedCategories.find(c => c.name?.toLowerCase() === openCategory?.toLowerCase());
        
        // Robust department detection — Tools/Machines tabs must not show Jewellery
        let department = resolveDepartmentFromCategory(openCategory || selectedCategory || '', currentCatData);

        const isJewelry = department === 'jewellery';
        const isMachine = department === 'machines';
        const isTool = department === 'tools';

        // Filter categories — when browsing a department (Tools/Machines), show all in that dept
        const departmentCategories = enhancedCategories.filter(cat => {
            const catDept = resolveDepartmentFromCategory(cat.name, cat);
            return catDept === department;
        });

        const sidebarCategoryHeading =
            department === 'machines'
                ? 'Machine Categories'
                : department === 'tools'
                  ? 'Tool Categories'
                  : 'Jewellery Categories';

        const jewelryFilterGroups = [
            { id: 'price', label: 'Price', type: 'price' },
            { id: 'type', label: 'Type', options: FILTER_CATEGORIES.TYPE.options, state: selectedType, setState: setSelectedType },
            { id: 'metal', label: 'Metal', options: FILTER_CATEGORIES.METAL.options, state: selectedMetal, setState: setSelectedMetal },
            { id: 'gender', label: 'Gender', options: FILTER_CATEGORIES.GENDER.options, state: selectedGender, setState: setSelectedGender },
            { id: 'offers', label: 'Offers', options: FILTER_CATEGORIES.OFFERS.options, state: selectedOffers, setState: setSelectedOffers },
            { id: 'gold_purity', label: 'Gold Purity', options: FILTER_CATEGORIES.GOLD_PURITY.options, state: selectedGoldPurity, setState: setSelectedGoldPurity },
            { id: 'stones', label: 'Stones', options: FILTER_CATEGORIES.STONES.options, state: selectedStones, setState: setSelectedStones },
            { id: 'occasion', label: 'Occasion', options: FILTER_CATEGORIES.OCCASION.options, state: selectedOccasion, setState: setSelectedOccasion },
            { id: 'num_of_stones', label: '# Of Stones', options: FILTER_CATEGORIES.NUM_OF_STONES.options, state: selectedNumOfStones, setState: setSelectedNumOfStones },
            { id: 'design', label: 'Design', options: FILTER_CATEGORIES.DESIGN.options, state: selectedDesign, setState: setSelectedDesign },
            { id: 'stone_color', label: 'Stone Color', options: FILTER_CATEGORIES.STONE_COLOR.options, state: selectedStoneColor, setState: setSelectedStoneColor },
            { id: 'zodiac', label: 'Zodiac', options: FILTER_CATEGORIES.ZODIAC.options, state: selectedZodiac, setState: setSelectedZodiac },
            { id: 'stone_shape', label: 'Stone Shape', options: FILTER_CATEGORIES.STONE_SHAPE.options, state: selectedStoneShape, setState: setSelectedStoneShape },
            { id: 'collections', label: 'Collections', options: FILTER_CATEGORIES.COLLECTIONS.options, state: selectedCollections, setState: setSelectedCollections },
            { id: 'tanmaniya', label: 'Tanmaniya', options: FILTER_CATEGORIES.TANMANIYA.options, state: selectedTanmaniya, setState: setSelectedTanmaniya },
            { id: 'characteristics', label: 'Characteristics', options: FILTER_CATEGORIES.CHARACTERISTICS.options, state: selectedCharacteristics, setState: setSelectedCharacteristics },
        ];

        const machineFilterGroups = [
            { id: 'price', label: 'Price', type: 'price' },
            { id: 'machine_type', label: 'Machine Type', options: MACHINE_FILTERS.MACHINE_TYPE.options, state: selectedMachineType, setState: setSelectedMachineType },
            { id: 'condition', label: 'New / Used Machine', options: MACHINE_FILTERS.CONDITION.options, state: selectedCondition, setState: setSelectedCondition },
            { id: 'country', label: 'Country', options: MACHINE_FILTERS.COUNTRY.options, state: selectedCountry, setState: setSelectedCountry },
            { id: 'operation', label: 'Automatic / Manual', options: MACHINE_FILTERS.OPERATION.options, state: selectedOperation, setState: setSelectedOperation },
            { id: 'horsepower', label: 'Horsepower', options: MACHINE_FILTERS.HORSEPOWER.options, state: selectedHorsepower, setState: setSelectedHorsepower },
            { id: 'phase', label: 'Phase', options: MACHINE_FILTERS.PHASE.options, state: selectedPhase, setState: setSelectedPhase },
            { id: 'brand', label: 'Brand', type: 'search', state: selectedBrand, setState: setSelectedBrand },
        ];

        const toolFilterGroups = [
            { id: 'price', label: 'Price', type: 'price' },
            { id: 'tool_type', label: 'Tool Category', options: TOOL_FILTERS.TOOL_TYPE.options, state: selectedToolType, setState: setSelectedToolType },
            { id: 'sub_tool', label: 'Specific Tool', options: TOOL_FILTERS.SUB_TOOLS.options, state: selectedSubTool, setState: setSelectedSubTool },
            { id: 'tool_brand', label: 'Brand', options: TOOL_FILTERS.BRANDS.options, state: selectedToolBrand, setState: setSelectedToolBrand },
            { id: 'country', label: 'Country', options: TOOL_FILTERS.COUNTRY.options, state: selectedCountry, setState: setSelectedCountry },
        ];

        const activeFilterGroups = isTool ? toolFilterGroups : (isMachine ? machineFilterGroups : (isJewelry ? jewelryFilterGroups : []));

        return (
            <div className="flex flex-col h-full bg-white font-sans overflow-hidden relative border-r border-gray-200" style={{ fontFamily: "'Muli', 'Arial', sans-serif" }}>
                {/* Fixed Header */}
                <div className="h-8 flex items-center px-3 bg-black text-white shrink-0 z-[70] shadow-sm">
                    <span className="text-xs font-normal tracking-wider text-white uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>Filters</span>
                </div>

                {/* Scrollable Middle Container */}
                <div className="overflow-y-auto custom-sidebar-scrollbar px-2 pt-2 space-y-4 pb-10 js-prevent-page-scroll border border-gray-200 border-t-0" style={{ overscrollBehavior: 'contain', height: 'calc(100vh - 150px)' }} data-lenis-prevent>
                    
                    {/* Categories (Filtered by Department) */}
                    <div className="border-b border-gray-100 pb-3">
                        <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-tight">
                            {sidebarCategoryHeading}
                        </h4>
                        <div className="flex flex-col gap-0.5">
                            {departmentCategories.map(cat => (
                                <div key={cat.id}>
                                    <button
                                        onClick={() => {
                                            handleCategoryToggle(cat.name);
                                            setExpandedCategory(expandedCategory === cat.name ? null : cat.name);
                                        }}
                                        className={`w-full text-left px-2 py-1 rounded text-xs transition-all flex items-center justify-between ${openCategory?.toLowerCase() === cat.name?.toLowerCase() ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <span className="capitalize">{cat.name.toLowerCase()}</span>
                                        <ChevronRight className={`w-3 h-3 transition-transform ${expandedCategory === cat.name ? 'rotate-90 text-blue-600' : 'text-gray-400'}`} />
                                    </button>

                                    <AnimatePresence>
                                        {expandedCategory === cat.name && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                                <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50 rounded mt-0.5">
                                                    {cat.subcategories?.map(sub => (
                                                        <button
                                                            key={sub.name}
                                                            onClick={() => {
                                                                const newVal = sub.name === selectedSubCategory ? null : sub.name;
                                                                setSelectedSubCategory(newVal);
                                                                setSelectedType(newVal || 'All');
                                                                if (isMachine) setSelectedMachineType(newVal || 'All');
                                                                if (isTool) setSelectedToolType(newVal || 'All');
                                                                const params = new URLSearchParams();
                                                                params.set('category', selectedCategory || getDepartmentLabel(department));
                                                                if (newVal) params.set('subcategory', newVal);
                                                                navigate(`/shop?${params.toString()}`);
                                                            }}
                                                            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-all duration-300 ${selectedSubCategory === sub.name ? 'bg-white shadow-sm ring-1 ring-blue-600' : 'bg-transparent hover:bg-gray-100'}`}
                                                        >
                                                            <div className="w-8 h-8 rounded overflow-hidden bg-gray-200 flex items-center justify-center">
                                                                {sub.image ? (
                                                                    <img src={sub.image} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
                                                                ) : (
                                                                    <ImageLucide className="w-3 h-3 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <span className={`text-[7px] tracking-wider text-center leading-tight mt-0.5 ${selectedSubCategory === sub.name ? 'text-blue-600' : 'text-gray-600'}`}>{sub.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {activeFilterGroups.map((group) => (
                        <div key={group.id} className="border-b border-gray-100 pb-3 last:border-0">
                            <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-tight">{group.label}</h4>
                            
                            {group.type === 'price' ? (
                                <div className="flex flex-col gap-1.5 px-1">
                                    {(isTool ? TOOL_FILTERS.PRICE.options : (isMachine ? MACHINE_FILTERS.PRICE.options : FILTER_CATEGORIES.PRICE.options)).map((range, idx) => {
                                        const isSelected = priceRange.min === range.min && priceRange.max === range.max;
                                        return (
                                            <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => {
                                                        if (isSelected) {
                                                            setPriceRange({ min: 0, max: isMachine ? 50000000 : (isTool ? 1000000 : 5000000) });
                                                        } else {
                                                            setPriceRange({ min: range.min, max: range.max });
                                                        }
                                                    }}
                                                    className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className={`text-[11px] transition-colors ${isSelected ? 'text-blue-600 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{range.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            ) : group.type === 'search' ? (
                                <div className="px-1">
                                    <input 
                                        type="text" 
                                        placeholder={`Search ${group.label}...`}
                                        value={group.state === 'All' ? '' : group.state}
                                        onChange={(e) => group.setState(e.target.value || 'All')}
                                        className="w-full text-[11px] border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-500"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1.5 px-1 max-h-[150px] overflow-y-auto custom-sidebar-scrollbar pr-1">
                                    {group.options.map((opt) => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={group.state === opt}
                                                onChange={() => group.setState(opt === group.state ? 'All' : opt)}
                                                className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className={`text-[11px] transition-colors ${group.state === opt ? 'text-blue-600 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Fixed Footer */}
                <div className="lg:hidden p-2 border-t border-gray-200 bg-white/95 backdrop-blur-md pb-6 shrink-0 z-[70] shadow-sm">
                    <button onClick={() => setIsFilterOpen(false)} className="w-full bg-black text-white py-1.5 rounded tracking-wider text-xs shadow-lg active:scale-95 hover:bg-gray-900 transition-all">Apply Filters</button>
                </div>
            </div>
        );
    };



    return (
        <div className="min-h-screen bg-white font-body selection:bg-[#337ab7] selection:text-white mt-0">
            {/* Top Section - Full Width */}
            <div className="max-w-[1700px] mx-auto px-4 py-2">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.5em] font-bold text-zinc-300 mb-1 px-1">
                    <Link to="/" className="hover:text-[#337ab7] transition-colors">Home</Link>
                    <span className="opacity-20">/</span>
                    <Link to="/shop" className="hover:text-[#337ab7] transition-colors text-zinc-400">Categories</Link>
                    {selectedCategory && selectedCategory !== 'All' && (
                        <React.Fragment>
                            <span className="opacity-20">/</span>
                            {['Tools', 'Machines', 'Jewellery'].includes(selectedCategory) ? (
                                <Link
                                    to={`/shop?category=${encodeURIComponent(selectedCategory)}`}
                                    className="hover:text-[#337ab7] transition-colors text-[#337ab7]/60 tracking-[0.2em]"
                                >
                                    {selectedCategory}
                                </Link>
                            ) : (
                                <React.Fragment>
                                    <Link
                                        to={`/shop?category=${encodeURIComponent(getDepartmentLabel(shopDepartment))}`}
                                        className="hover:text-[#337ab7] transition-colors text-[#337ab7]/60 tracking-[0.2em]"
                                    >
                                        {getDepartmentLabel(shopDepartment)}
                                    </Link>
                                    <span className="opacity-20">/</span>
                                    <Link
                                        to={`/shop?category=${encodeURIComponent(selectedCategory)}`}
                                        className="hover:text-[#337ab7] transition-colors text-[#337ab7]/60 tracking-[0.2em]"
                                    >
                                        {selectedCategory}
                                    </Link>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                    {selectedSubCategory && (
                        <React.Fragment>
                            <span className="opacity-20">/</span>
                            <Link to={`/shop?category=${selectedCategory}&subcategory=${selectedSubCategory}`} className="hover:text-[#337ab7] transition-colors text-[#337ab7] tracking-[0.25em] font-black">{selectedSubCategory}</Link>
                        </React.Fragment>
                    )}
                </div>

                {/* Title and Count */}
                <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline gap-4">
                        <h1 className="text-2xl font-medium uppercase text-[#337ab7]" style={{ fontFamily: 'Arial, sans-serif' }}>{pageTitle}</h1>
                        <span className="text-xs text-gray-500">{filteredProducts.length} Designs</span>
                    </div>
                    {/* Mobile Filter Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="lg:hidden p-2 text-[#337ab7] active:scale-95 transition-all"
                    >
                        <SlidersHorizontal className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Active sidebar filters */}
                {activeFilters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-2 px-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
                            Selected:
                        </span>
                        {activeFilters.map((chip) => (
                        <button 
                                key={chip.id}
                                type="button"
                                onClick={chip.clear}
                                className="inline-flex items-center gap-1.5 bg-[#eef6fc] text-[#337ab7] border border-[#337ab7]/20 px-2.5 py-1 rounded-sm text-[10px] font-medium uppercase tracking-wide hover:bg-[#337ab7] hover:text-white transition-colors"
                            >
                                {chip.label}
                                <X className="w-3 h-3" />
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedSubCategory(null);
                                setSelectedType('All');
                                setSelectedMetal('All');
                                setSelectedGender('All');
                                setSelectedOffers('All');
                                setSelectedGoldPurity('All');
                                setSelectedStones('All');
                                setSelectedOccasion('All');
                                setSelectedNumOfStones('All');
                                setSelectedDesign('All');
                                setSelectedStoneColor('All');
                                setSelectedZodiac('All');
                                setSelectedStoneShape('All');
                                setSelectedCollections('All');
                                setSelectedTanmaniya('All');
                                setSelectedCharacteristics('All');
                                setSelectedMachineType('All');
                                setSelectedCondition('All');
                                setSelectedCountry('All');
                                setSelectedOperation('All');
                                setSelectedHorsepower('All');
                                setSelectedPhase('All');
                                setSelectedBrand('All');
                                setSelectedToolType('All');
                                setSelectedSubTool('All');
                                setSelectedToolBrand('All');
                                setPriceRange({ min: 0, max: 500000 });
                                setProductViewMode('all');
                                setAppliedStorePincode('');
                                setStorePincodeInput('');
                                setPincodeError('');
                            }}
                            className="text-[9px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#337ab7] underline"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* Pink Bar (Options) */}
                <div className="bg-[#fff0f2] p-2 flex flex-col gap-2 mb-2 text-xs">
                    <div className="flex items-center justify-between gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="flex gap-2 shrink-0 items-center">
                            <button
                                type="button"
                                onClick={handleSelectAllProducts}
                                className={`px-3 py-1 rounded-sm uppercase text-[10px] shrink-0 transition-colors ${
                                    productViewMode === 'all'
                                        ? 'bg-[#337ab7] text-white'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-[#337ab7]/40'
                                }`}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                onClick={handleSelectDesignsInStore}
                                className={`px-3 py-1 rounded-sm uppercase text-[10px] shrink-0 transition-colors ${
                                    productViewMode === 'inStore'
                                        ? 'bg-[#337ab7] text-white'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-[#337ab7]/40'
                                }`}
                            >
                                Designs in Store
                            </button>
                        </div>
                        <div className="flex gap-2 items-center shrink-0">
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-sm px-2 py-0.5 shrink-0">
                            <span className="text-[9px] font-bold uppercase text-gray-400 whitespace-nowrap">Sort By:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-bold uppercase text-[#337ab7] focus:ring-0 cursor-pointer p-0 min-w-[75px]"
                            >
                                {["WHAT'S NEW", "POPULAR", "PRICE LOW TO HIGH", "PRICE HIGH TO LOW", "DISCOUNT"].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    </div>

                    {productViewMode === 'inStore' && (
                        <div className="flex flex-wrap items-center gap-2 px-0.5">
                            <div className={`flex items-center bg-white border rounded-sm overflow-hidden h-8 flex-1 min-w-[200px] max-w-md ${
                                pincodeError ? 'border-red-300' : 'border-gray-200'
                            }`}>
                                <MapPin className="w-3.5 h-3.5 text-[#337ab7] ml-2 shrink-0" strokeWidth={2} />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="Enter your pincode"
                                    value={storePincodeInput}
                                    onChange={(e) => {
                                        setStorePincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6));
                                        if (pincodeError) setPincodeError('');
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleApplyStorePincode();
                                    }}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] font-medium px-2 text-zinc-700 placeholder:text-zinc-300 min-w-0"
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyStorePincode}
                                    className="h-full px-3 bg-[#337ab7] text-white text-[9px] font-black uppercase tracking-wider hover:bg-[#2a6496] transition-colors shrink-0"
                                >
                                    Apply
                                </button>
                            </div>
                            {storeAreaLabel && !pincodeError && (
                                <span className="text-[10px] text-[#337ab7] font-medium">
                                    Showing designs in stores near <strong>{storeAreaLabel}</strong>
                                </span>
                            )}
                            {!appliedStorePincode && !pincodeError && (
                                <span className="text-[10px] text-gray-400">
                                    Enter pincode to see designs available in your nearby HG stores
                                </span>
                            )}
                            {pincodeError && (
                                <span className="text-[10px] text-red-500 font-medium w-full">{pincodeError}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section - Split */}
            <div className="flex max-w-[1700px] mx-auto h-[calc(100vh-140px)] overflow-hidden">
                <aside className="hidden lg:block w-[220px] shrink-0 border-r border-zinc-100 h-full flex flex-col bg-white shadow-sm">{SidebarContent()}</aside>
                <main className="flex-grow min-w-0 bg-[#fdf2f8]/5 h-full overflow-y-auto" data-lenis-prevent>
                    <div className="pt-2 pb-4 px-2 md:p-4 lg:px-4 lg:pt-0 lg:pb-6">

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 gap-y-3 md:gap-y-4 pb-40">
                                {filteredProducts.map((product, idx) => (
                                    <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: (idx % 5) * 0.08, ease: "easeOut" }}><ProductCard product={product} /></motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 text-center bg-white rounded-[4rem] border border-zinc-50 mx-2 shadow-sm">
                                <div className="w-24 h-24 bg-[#eef6fc]/50 rounded-full flex items-center justify-center mb-8">
                                    <Search className="w-10 h-10 text-[#337ab7]/30" />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-black mb-5">Choice Not Found</h3>
                                <p className="text-zinc-400 font-serif italic mb-10 max-w-sm mx-auto text-base">
                                    {productViewMode === 'inStore' && appliedStorePincode
                                        ? `No designs are currently available in HG stores near ${getStoreAreaLabel(appliedStorePincode) || appliedStorePincode}. Try another pincode or view all designs.`
                                        : "We couldn't match your discovery parameters."}
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('Jewellery');
                                        setSelectedSubCategory(null);
                                        setSelectedType('All');
                                        setSelectedGender('All');
                                        setSelectedMetal('All');
                                        setSelectedOffers('All');
                                        setSelectedGoldPurity('All');
                                        setSelectedStones('All');
                                        setSelectedOccasion('All');
                                        setSelectedNumOfStones('All');
                                        setSelectedDesign('All');
                                        setSelectedStoneColor('All');
                                        setSelectedZodiac('All');
                                        setSelectedStoneShape('All');
                                        setSelectedCollections('All');
                                        setSelectedTanmaniya('All');
                                        setSelectedCharacteristics('All');
                                        setPriceRange({ min: 0, max: 5000000 });
                                        setSortBy('Newest');
                                        navigate('/shop');
                                    }}
                                    className="bg-[#337ab7] text-white px-10 py-5 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl transition-all"
                                >
                                    Reset All
                                </button>
                            </div>
                        )}

                        <PopularSearchTags
                            department={shopDepartment}
                            subCategory={selectedSubCategory}
                            className="mt-2 md:mt-4"
                        />
                    </div>
                </main>
            </div>

            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[210] backdrop-blur-2xl" onClick={() => setIsFilterOpen(false)} />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 45, stiffness: 600 }} className="fixed top-0 right-0 h-full w-[80%] max-w-[360px] bg-white z-[220] shadow-[0_0_120px_rgba(0,0,0,0.7)] overflow-hidden">{SidebarContent()}<div className="absolute top-6 right-6 z-[70]"><button onClick={() => setIsFilterOpen(false)} className="w-11 h-11 bg-zinc-50 border border-zinc-100 hover:bg-[#337ab7] hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg group"><X className="w-4.5 h-4.5 group-hover:rotate-90 transition-transform" /></button></div></motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
