export const slugifyService = (name = '') =>
    String(name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

export const DEFAULT_SERVICES_SECTION = {
    id: 'services',
    label: 'Our Services',
    subtitle: 'Expert care for your machines & precious jewelry',
    groups: [
        {
            id: 'machine',
            name: 'MACHINE SERVICES',
            items: [
                { id: 'm1', name: 'Preventative Maintenance', slug: 'preventative-maintenance', description: 'Scheduled maintenance to keep your machinery running at peak performance and avoid costly downtime.', image: '' },
                { id: 'm2', name: 'Repair Service', slug: 'repair-service', description: 'Professional repair for industrial machines with genuine parts and certified technicians.', image: '' },
                { id: 'm3', name: 'AMC - Annual Maintenance Contract', slug: 'amc-annual-maintenance-contract', description: 'Year-round coverage with priority support, inspections, and predictable service costs.', image: '' },
                { id: 'm4', name: 'Parts Replacement', slug: 'parts-replacement', description: 'OEM and compatible parts sourcing with quick turnaround for minimal production loss.', image: '' },
                { id: 'm5', name: 'Software Updates', slug: 'software-updates', description: 'Firmware and control software updates to improve efficiency and compatibility.', image: '' },
                { id: 'm6', name: 'Remote Support', slug: 'remote-support', description: 'Expert troubleshooting and guidance via secure remote access when on-site visit is not needed.', image: '' },
                { id: 'm7', name: 'On-site Service', slug: 'on-site-service', description: 'Technicians dispatched to your facility for installation, repair, and maintenance.', image: '' },
            ],
        },
        {
            id: 'jewelry',
            name: 'JEWELRY SERVICES',
            items: [
                { id: 'j1', name: 'Cleaning & Polishing', slug: 'cleaning-polishing', description: 'Restore brilliance and shine to your favorite pieces with expert hand finishing.', image: '' },
                { id: 'j2', name: 'Ultrasonic Cleaning', slug: 'ultrasonic-cleaning', description: 'Deep cleaning for intricate jewelry using professional ultrasonic technology.', image: '' },
                { id: 'j3', name: 'Rhodium Plating', slug: 'rhodium-plating', description: 'Renew white gold and silver pieces with a durable, mirror-like rhodium finish.', image: '' },
                { id: 'j4', name: 'Resizing', slug: 'resizing', description: 'Precision ring and bracelet resizing while preserving design integrity.', image: '' },
                { id: 'j5', name: 'Stone Tightening', slug: 'stone-tightening', description: 'Secure loose diamonds and gemstones to prevent loss and maintain safety.', image: '' },
                { id: 'j6', name: 'Prong/Claw Repair', slug: 'prong-claw-repair', description: 'Rebuild worn prongs and claws to keep stones firmly in place.', image: '' },
                { id: 'j7', name: 'Chain & Clasp Repair', slug: 'chain-clasp-repair', description: 'Fix broken chains, links, and clasps for necklaces and bracelets.', image: '' },
                { id: 'j8', name: 'Pearl Re-stringing', slug: 'pearl-re-stringing', description: 'Professional re-stringing with silk thread and knotting for pearl strands.', image: '' },
                { id: 'j9', name: 'Laser Soldering', slug: 'laser-soldering', description: 'Microscopic repairs on delicate jewelry without heat damage to stones.', image: '' },
                { id: 'j10', name: 'Hallmark Verification', slug: 'hallmark-verification', description: 'Authenticate purity marks and hallmarks on gold and silver jewelry.', image: '' },
                { id: 'j11', name: 'Jewelry Valuation/Appraisal', slug: 'jewelry-valuation-appraisal', description: 'Certified valuation for insurance, resale, or estate documentation.', image: '' },
            ],
        },
    ],
};

export const mergeServicesSection = (fromDb = {}) => ({
    ...DEFAULT_SERVICES_SECTION,
    ...fromDb,
    groups: fromDb?.groups?.length
        ? fromDb.groups.map((group, gi) => ({
            ...DEFAULT_SERVICES_SECTION.groups[gi],
            ...group,
            items: group.items?.length ? group.items : DEFAULT_SERVICES_SECTION.groups[gi]?.items || [],
        }))
        : DEFAULT_SERVICES_SECTION.groups,
});

export const getServicesFromSections = (homepageSections) =>
    mergeServicesSection(homepageSections?.services || {});

export const findServiceBySlug = (homepageSections, categoryId, slug) => {
    const section = getServicesFromSections(homepageSections);
    const group = section.groups.find((g) => g.id === categoryId);
    if (!group) return null;
    return group.items.find((item) => (item.slug || slugifyService(item.name)) === slug) || null;
};
