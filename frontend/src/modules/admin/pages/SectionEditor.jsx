import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import PageHeader from '../components/common/PageHeader';
import { DEFAULT_HOMEPAGE_SECTIONS } from '../../../modules/user/data/homepageSectionDefaults';
import CategoryShowcaseEditor from '../components/editors/CategoryShowcaseEditor';
import CraftsmanshipEditor from '../components/editors/CraftsmanshipEditor';
import AdvantageEditor from '../components/editors/AdvantageEditor';
import ServicesEditor from '../components/editors/ServicesEditor';

const SectionEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { homepageSections, updateSection } = useShop();

    const [sectionData, setSectionData] = useState(null);

    useEffect(() => {
        if (homepageSections && homepageSections[id]) {
            setSectionData(homepageSections[id]);
        } else if (DEFAULT_HOMEPAGE_SECTIONS[id]) {
            setSectionData(DEFAULT_HOMEPAGE_SECTIONS[id]);
        } else {
            setSectionData({ label: id, items: [] });
        }
    }, [id, homepageSections]);

    if (!sectionData) {
        return <div className="p-10 text-center">Loading Section Editor...</div>;
    }

    const handleSave = (newData) => {
        updateSection(id, newData);
    };

    // Render appropriate editor based on section ID or type
    const renderEditor = () => {
        // Since all sections now use the generic CategoryShowcaseEditor which
        // binds dynamically to the DB, we can just return it generically!
        switch (id) {
            case 'category-showcase':
            case 'price-range-showcase':
            case 'perfect-gift':
            case 'new-launch':
            case 'latest-drop':
            case 'most-gifted':
            case 'proposal-rings':
            case 'curated-for-you':
            case 'style-it-your-way':
                return <CategoryShowcaseEditor sectionData={sectionData} onSave={handleSave} defaultItems={[]} />;
            case 'design-craftsmanship':
                return <CraftsmanshipEditor sectionData={sectionData} onSave={handleSave} />;
            case 'hg-advantage':
                return <AdvantageEditor sectionData={sectionData} onSave={handleSave} />;
            case 'services':
                return <ServicesEditor sectionData={sectionData} onSave={handleSave} />;
            default:
                return (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <h3 className="text-xl font-bold text-gray-400">Editor not implemented for this section type yet.</h3>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 p-6 md:p-8">
                <PageHeader
                    title={`Edit ${sectionData.label}`}
                    subtitle="Customize the content for this homepage section"
                    backPath="/admin/sections"
                />

                {renderEditor()}
            </div>
        </div>
    );
};

export default SectionEditor;
