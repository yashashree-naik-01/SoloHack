import { useState } from 'react';

const templates = [
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and simple layout',
        icon: '📄'
    },
    {
        id: 'developer',
        name: 'Developer',
        description: 'Tech-focused with code styling',
        icon: '💻'
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Colorful and expressive',
        icon: '🎨'
    }
];

function TemplateSelector({ selectedTemplate, onTemplateChange }) {
    return (
        <div className="template-selector">
            <h3>Choose Your Template</h3>

            <div className="template-grid">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                        onClick={() => onTemplateChange(template.id)}
                    >
                        <div className="card-inner">
                            <div className="template-icon-wrapper">
                                <span className="template-icon">{template.icon}</span>
                            </div>
                            <div className="template-info">
                                <h4 className="template-name">{template.name}</h4>
                                {selectedTemplate === template.id && (
                                    <span className="selected-indicator">Selected</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default TemplateSelector;
