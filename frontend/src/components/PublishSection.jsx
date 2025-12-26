import { useState } from 'react';
import { API_BASE_URL } from '../config';

function PublishSection({ response, username, onPublishSuccess }) {
    const [publishing, setPublishing] = useState(false);
    const [publishError, setPublishError] = useState(null);
    const [publishSuccess, setPublishSuccess] = useState(false);

    if (!response || !response.success || !response.data) {
        return null;
    }

    const { completionPercentage, isPublished } = response.data;
    const data = response.data;

    // Calculate section completion
    const sections = [
        { name: 'About', completed: data.about && data.about.trim().length > 0, icon: '✍️' },
        { name: 'Skills', completed: data.skills && data.skills.length > 0, icon: '💡' },
        { name: 'Projects', completed: data.projects && data.projects.length > 0, icon: '🚀' },
        { name: 'Education', completed: data.education && data.education.length > 0, icon: '🎓' }
    ];

    const canPublish = completionPercentage === 100;

    const handlePublish = async () => {
        if (!username) {
            setPublishError('Username is required to publish!');
            return;
        }

        if (!canPublish) {
            setPublishError('Portfolio must be 100% complete to publish');
            return;
        }

        setPublishing(true);
        setPublishError(null);
        setPublishSuccess(false);

        try {
            const res = await fetch(`${API_BASE_URL}/api/portfolio/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            const result = await res.json();

            if (result.success) {
                setPublishSuccess(true);
                if (onPublishSuccess) {
                    onPublishSuccess(result.data);
                }
            } else {
                setPublishError(result.message || result.error || 'Failed to publish');
            }
        } catch (error) {
            setPublishError('Network error. Please check your connection and try again.');
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="publish-section">
            {/* Completion Status */}
            <div className={`completion-status ${canPublish ? 'complete' : 'incomplete'}`}>
                <div className="completion-header">
                    <h3>
                        {canPublish ? '🎉 Portfolio Complete!' : '📋 Portfolio Progress'}
                    </h3>
                    <div className="completion-percentage">
                        {completionPercentage}%
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>

                {/* Section Breakdown */}
                <div className="section-checklist">
                    {sections.map((section, idx) => (
                        <div key={idx} className={`checklist-item ${section.completed ? 'completed' : 'pending'}`}>
                            <span className="check-icon">
                                {section.completed ? '✅' : '⭕'}
                            </span>
                            <span className="section-icon">{section.icon}</span>
                            <span className="section-name">{section.name}</span>
                        </div>
                    ))}
                </div>

                {/* Status Message */}
                {canPublish ? (
                    <p className="status-message success">
                        ✨ Your portfolio is ready to share with the world!
                    </p>
                ) : (
                    <p className="status-message warning">
                        ⚠️ Complete all sections above to unlock publishing
                    </p>
                )}
            </div>

            {/* Publish Button */}
            <button
                onClick={handlePublish}
                disabled={!canPublish || publishing || isPublished}
                className={`btn-publish ${canPublish && !isPublished ? 'enabled' : 'disabled'}`}
            >
                {publishing ? (
                    <>🔄 Publishing...</>
                ) : isPublished ? (
                    <>✅ Already Published</>
                ) : canPublish ? (
                    <>🚀 Publish Portfolio</>
                ) : (
                    <>🔒 Complete All Sections to Publish</>
                )}
            </button>

            {/* Success Message */}
            {(publishSuccess || isPublished) && (
                <div className="publish-success">
                    <div className="success-icon">🎉</div>
                    <h4>Portfolio Published Successfully!</h4>
                    <p>Your portfolio is now live and accessible to everyone.</p>
                    <div className="share-url-box">
                        <label>Share this link:</label>
                        <div className="url-copy-container">
                            <input
                                type="text"
                                readOnly
                                value={`${window.location.origin}/portfolio/${username}`}
                                onClick={(e) => e.target.select()}
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/portfolio/${username}`);
                                    alert('✅ Link copied to clipboard!');
                                }}
                                className="btn-copy"
                            >
                                📋 Copy
                            </button>
                        </div>
                    </div>
                    <p className="visibility-status">
                        🌍 Public Visibility: <strong className="live-badge">LIVE</strong>
                    </p>
                </div>
            )}

            {/* Error Message */}
            {publishError && (
                <div className="publish-error">
                    <span className="error-icon">❌</span>
                    <span>{publishError}</span>
                </div>
            )}
        </div>
    );
}

export default PublishSection;
