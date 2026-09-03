import jewRing from '../assets/jew_ring_white.png';
import jewEarrings from '../assets/jew_earrings_white.png';
import jewPendant from '../assets/jew_pendant_white.png';
import jewBracelet from '../assets/jew_bracelet_white.png';
import jewNecklace from '../assets/jew_necklace_white.png';
import jewAnklet from '../assets/jew_anklet_white.png';
import toolMeasurement from '../assets/tool_measurement_white.png';
import toolCutting from '../assets/tool_cutting_white.png';
import toolPolishing from '../assets/tool_polishing_white.png';
import toolOptics from '../assets/tool_optics_white.png';
import toolSetting from '../assets/tool_setting_white.png';
import machineLaser from '../assets/machine_laser_white.png';
import machineCasting from '../assets/machine_casting_white.png';
import machinePrinter from '../assets/machine_printer_white.png';
import machineCleaning from '../assets/machine_cleaning_white.png';
import machineFurnace from '../assets/machine_furnace_white.png';

export const CATALOG = {
    jewellery: {
        rings: jewRing,
        earrings: jewEarrings,
        pendants: jewPendant,
        bracelets: jewBracelet,
        necklaces: jewNecklace,
        anklets: jewAnklet,
        default: jewRing,
    },
    tools: {
        measurement: toolMeasurement,
        cutting: toolCutting,
        polishing: toolPolishing,
        optics: toolOptics,
        setting: toolSetting,
        default: toolMeasurement,
    },
    machines: {
        laser: machineLaser,
        casting: machineCasting,
        printer: machinePrinter,
        cleaning: machineCleaning,
        furnace: machineFurnace,
        default: machineLaser,
    },
};

const isPlaceholder = (src) =>
    !src ||
    src.includes('via.placeholder') ||
    src.includes('unsplash.com') ||
    src.toLowerCase().includes('diagram') ||
    src.toLowerCase().includes('uml');

export const getCatalogImage = (name = '', department = '') => {
    const key = `${name} ${department}`.toLowerCase();

    if (key.includes('machine') || key.includes('laser') || key.includes('casting') || key.includes('printer') || key.includes('furnace') || key.includes('ultrasonic') || key.includes('welding')) {
        if (key.includes('laser') || key.includes('weld')) return CATALOG.machines.laser;
        if (key.includes('cast')) return CATALOG.machines.casting;
        if (key.includes('print') || key.includes('3d') || key.includes('wax')) return CATALOG.machines.printer;
        if (key.includes('clean') || key.includes('ultrasonic')) return CATALOG.machines.cleaning;
        if (key.includes('furnace') || key.includes('refin')) return CATALOG.machines.furnace;
        return CATALOG.machines.default;
    }

    if (key.includes('tool') || key.includes('measurement') || key.includes('caliper') || key.includes('cutting') || key.includes('polishing') || key.includes('optic') || key.includes('loupe') || key.includes('setting')) {
        if (key.includes('measure') || key.includes('caliper')) return CATALOG.tools.measurement;
        if (key.includes('cut') || key.includes('plier')) return CATALOG.tools.cutting;
        if (key.includes('polish') || key.includes('buff')) return CATALOG.tools.polishing;
        if (key.includes('optic') || key.includes('loupe') || key.includes('lens')) return CATALOG.tools.optics;
        if (key.includes('set') || key.includes('hammer') || key.includes('forging')) return CATALOG.tools.setting;
        return CATALOG.tools.default;
    }

    if (key.includes('earring') || key.includes('stud')) return CATALOG.jewellery.earrings;
    if (key.includes('pendant')) return CATALOG.jewellery.pendants;
    if (key.includes('bracelet') || key.includes('bangle')) return CATALOG.jewellery.bracelets;
    if (key.includes('necklace') || key.includes('chain') || key.includes('mangalsutra')) return CATALOG.jewellery.necklaces;
    if (key.includes('anklet')) return CATALOG.jewellery.anklets;
    return CATALOG.jewellery.rings;
};

export const resolveCatalogImage = (src, name = '', department = '') => {
    if (isPlaceholder(src)) return getCatalogImage(name, department);
    return src;
};
