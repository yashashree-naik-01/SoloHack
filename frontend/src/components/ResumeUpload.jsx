import { useState } from 'react';
import { API_BASE_URL } from '../config';

function ResumeUpload({ onDataExtracted }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null
    const [extractedData, setExtractedData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            return;
        }

        // Validate file type
        if (selectedFile.type !== 'application/pdf') {
            setErrorMessage('Please upload a PDF file only');
            setFile(null);
            return;
        }

        // Validate file size (max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setErrorMessage('File size must be less than 5MB');
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setErrorMessage('');
        setUploadStatus(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setErrorMessage('Please select a PDF file first');
            return;
        }

        setUploading(true);
        setUploadStatus(null);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await fetch(`${API_BASE_URL}/api/content/extract-resume`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                setUploadStatus('success');
                setExtractedData(data.data);

                // Pass extracted data to parent component
                if (onDataExtracted) {
                    onDataExtracted(data.data);
                }
            } else {
                setUploadStatus('error');
                setErrorMessage(data.error || 'Failed to extract data from resume');
            }
        } catch (error) {
            setUploadStatus('error');
            setErrorMessage('Network error. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const resetUpload = () => {
        setFile(null);
        setUploadStatus(null);
        setExtractedData(null);
        setErrorMessage('');
    };

    return (
        <div className="resume-upload-container">
            <div className="upload-header">
                <h3>📄 Quick Start: Upload Your Resume</h3>
                <p>Upload your PDF resume and we'll automatically fill in your portfolio details using AI</p>
            </div>

            {uploadStatus !== 'success' && (
                <div className="upload-area">
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            id="resume-upload"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                        <label htmlFor="resume-upload" className="file-label">
                            <div className="upload-icon">📎</div>
                            <div className="upload-text">
                                {file ? (
                                    <>
                                        <strong>{file.name}</strong>
                                        <span className="file-size">
                                            ({(file.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <strong>Click to browse</strong> or drag and drop
                                        <span className="file-hint">PDF files only (max 5MB)</span>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>

                    <div className="upload-actions">
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className={`btn-upload ${file && !uploading ? 'active' : 'inactive'}`}
                        >
                            {uploading ? (
                                <>🔄 Extracting Data...</>
                            ) : (
                                <>🚀 Upload & Extract</>
                            )}
                        </button>

                        {file && (
                            <button onClick={resetUpload} className="btn-reset">
                                ❌ Clear
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="upload-message error">
                    <span className="message-icon">⚠️</span>
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Success Message */}
            {uploadStatus === 'success' && extractedData && (
                <div className="upload-success">
                    <div className="success-header">
                        <span className="success-icon">✅</span>
                        <h4>Data Extracted Successfully!</h4>
                    </div>

                    <div className="extracted-summary">
                        <p>We've extracted the following information from your resume:</p>

                        <div className="data-checklist">
                            {extractedData.about && (
                                <div className="data-item found">
                                    <span className="check-mark">✓</span>
                                    <span>About/Summary</span>
                                </div>
                            )}
                            {extractedData.skills && extractedData.skills.length > 0 && (
                                <div className="data-item found">
                                    <span className="check-mark">✓</span>
                                    <span>Skills ({extractedData.skills.length} found)</span>
                                </div>
                            )}
                            {extractedData.projects && extractedData.projects.length > 0 && (
                                <div className="data-item found">
                                    <span className="check-mark">✓</span>
                                    <span>Projects ({extractedData.projects.length} found)</span>
                                </div>
                            )}
                            {extractedData.education && extractedData.education.length > 0 && (
                                <div className="data-item found">
                                    <span className="check-mark">✓</span>
                                    <span>Education ({extractedData.education.length} found)</span>
                                </div>
                            )}
                        </div>

                        {/* Highlight missing sections */}
                        <div className="missing-sections">
                            {!extractedData.about && (
                                <div className="data-item missing">
                                    <span className="missing-mark">⚠️</span>
                                    <span>About/Summary - Please add manually</span>
                                </div>
                            )}
                            {(!extractedData.skills || extractedData.skills.length === 0) && (
                                <div className="data-item missing">
                                    <span className="missing-mark">⚠️</span>
                                    <span>Skills - Please add manually</span>
                                </div>
                            )}
                            {(!extractedData.projects || extractedData.projects.length === 0) && (
                                <div className="data-item missing">
                                    <span className="missing-mark">⚠️</span>
                                    <span>Projects - Please add manually</span>
                                </div>
                            )}
                            {(!extractedData.education || extractedData.education.length === 0) && (
                                <div className="data-item missing">
                                    <span className="missing-mark">⚠️</span>
                                    <span>Education - Please add manually</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button onClick={resetUpload} className="btn-upload-another">
                        📄 Upload Another Resume
                    </button>
                </div>
            )}
        </div>
    );
}

export default ResumeUpload;
