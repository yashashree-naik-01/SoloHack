import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

// Animation Variants for Wizard Steps


function PortfolioForm() {
    // Current Step State (1 to 6)
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 6;

    // 1. Personal Details
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState(''); // Added missing state
    const [profilePicture, setProfilePicture] = useState(''); // Base64 Image
    const [about, setAbout] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');


    // Image Upload Handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 2. Skills
    const [skills, setSkills] = useState('');

    // 3. Experience
    const [experienceType, setExperienceType] = useState('fresher'); // 'fresher' or 'experienced'
    const [expCompany, setExpCompany] = useState('');
    const [expRole, setExpRole] = useState('');
    const [expDuration, setExpDuration] = useState('');
    const [experiences, setExperiences] = useState([]);

    const [internCompany, setInternCompany] = useState('');
    const [internRole, setInternRole] = useState('');
    const [internDuration, setInternDuration] = useState('');
    const [internships, setInternships] = useState([]);

    // 4. Projects
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectTech, setProjectTech] = useState('');
    const [projectLink, setProjectLink] = useState('');
    const [projectRepo, setProjectRepo] = useState('');
    const [projects, setProjects] = useState([]);

    // 5. Education
    const [institution, setInstitution] = useState('');
    const [degree, setDegree] = useState('');
    const [year, setYear] = useState('');
    const [grade, setGrade] = useState('');
    const [education, setEducation] = useState([]);

    // 6. Social Links
    const [githubLink, setGithubLink] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');

    // Response & Progress
    const [response, setResponse] = useState(null);
    const [progress, setProgress] = useState(0);
    const [savedCompletion, setSavedCompletion] = useState(0); // Real completion from DB

    // Load Data on Mount
    useEffect(() => {
        const fetchPortfolio = async () => {
            const loggedInUser = localStorage.getItem('username');
            if (loggedInUser) {
                setUsername(loggedInUser || ''); // Safeguard
                try {
                    const res = await fetch(`${API_BASE_URL}/api/portfolio/preview/${loggedInUser}`);
                    const data = await res.json();
                    if (data.success) {
                        const p = data.data;
                        setSavedCompletion(p.completionPercentage || 0);
                        // Pre-fill form
                        setFullName(p.fullName || ''); // Added pre-fill
                        setProfilePicture(p.profilePicture || '');
                        setAbout(p.about || '');
                        setContact(p.contact || '');
                        setEmail(p.email || '');
                        setDob(p.dob || '');
                        setSkills((p.skills || []).join(', '));
                        setProjects(p.projects || []);
                        setEducation(p.education || []);
                        setExperienceType(p.experienceType || 'fresher');
                        setExperiences(p.experiences || []);
                        setInternships(p.internships || []);
                        if (p.social) {
                            setGithubLink(p.social.github || '');
                            setLinkedinLink(p.social.linkedin || '');
                        }
                    }
                } catch (err) {
                    console.error("Error fetching existing portfolio:", err);
                }
            }
        };
        fetchPortfolio();
    }, []);

    // Update Progress Bar based on Step
    useEffect(() => {
        const stepProgress = Math.round(((currentStep - 1) / totalSteps) * 100);
        setProgress(stepProgress);
    }, [currentStep]);

    // Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    // Navigation Handlers
    const handleNext = () => {
        // Validation for Step 1
        if (currentStep === 1) {
            if (!username) return alert("❌ Username is required");
            if (contact && !phoneRegex.test(contact)) return alert("❌ Phone number must be exactly 10 digits");
            if (email && !emailRegex.test(email)) return alert("❌ Invalid Email Format");
        }

        if (currentStep < totalSteps) {
            setCurrentStep(curr => curr + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(curr => curr - 1);
        }
    };

    // Data Management Handlers
    const addExperience = () => {
        if (expCompany && expRole) {
            setExperiences([...experiences, { company: expCompany, role: expRole, duration: expDuration }]);
            setExpCompany(''); setExpRole(''); setExpDuration('');
        }
    };
    const addInternship = () => {
        if (internCompany && internRole) {
            setInternships([...internships, { company: internCompany, role: internRole, duration: internDuration }]);
            setInternCompany(''); setInternRole(''); setInternDuration('');
        }
    };
    const addProject = () => {
        if (projectTitle && projectDescription) {
            setProjects([...projects, {
                title: projectTitle,
                description: projectDescription,
                technologies: projectTech.split(',').map(t => t.trim()).filter(t => t),
                link: projectLink,
                githubLink: projectRepo
            }]);
            setProjectTitle(''); setProjectDescription(''); setProjectTech(''); setProjectLink(''); setProjectRepo('');
        }
    };
    const addEducation = () => {
        if (institution && degree) {
            setEducation([...education, { institution, degree, year, grade }]);
            setInstitution(''); setDegree(''); setYear(''); setGrade('');
        }
    };

    const handleSubmit = async () => {
        const portfolioData = {
            username, fullName, profilePicture, about, contact, email, dob,
            skills: skills.split(',').map(s => s.trim()).filter(s => s),
            experienceType, experiences, internships,
            projects, education,
            social: { github: githubLink, linkedin: linkedinLink }
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/portfolio/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(portfolioData)
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setResponse(data);
                if (data.data && data.data.completionPercentage) {
                    setSavedCompletion(data.data.completionPercentage);
                }
                setProgress(100); // 100% on save
                alert('✅ Portfolio Saved Successfully!');
            } else {
                throw new Error(data.error || JSON.stringify(data) || 'Unknown error');
            }
        } catch (error) {
            console.error('Save Error Details:', error);
            alert(`❌ SAVE FAILED!\n\nReason: ${error.message}\n\nPlease check the console (F12) for more details.`);
        }
    };

    return (
        <div className="form-wrapper">
            {/* Progress Bar */}
            <div className="quest-bar-container">
                <div className="quest-info">
                    <span>
                        Portfolio Creation
                        {savedCompletion >= 100 && <span className="badge-complete" style={{ marginLeft: '10px', fontSize: '0.8em', background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>✅ 100% Complete</span>}
                        {savedCompletion < 100 && savedCompletion > 0 && <span className="badge-progress" style={{ marginLeft: '10px', fontSize: '0.8em', background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>{savedCompletion}% Saved</span>}
                    </span>
                    <span>Step {currentStep} of {totalSteps}</span>
                </div>
                <div className="quest-track">
                    <div
                        className="quest-fill"
                        style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
                    />
                </div>
            </div>

            <div className="form-container">

                {/* STEP 1: PERSONAL DETAILS */}
                <div className="level-section" style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                    <div className="section-header"><h3>1. Personal Details</h3></div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Profile Picture</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                        {profilePicture && <img src={profilePicture} alt="Profile Preview" style={{ width: '100px', height: '100px', borderRadius: '8px', marginTop: '10px', objectFit: 'cover' }} />}
                    </div>
                    <div className="form-group">
                        <label>Username (Logged In)</label>
                        <input type="text" value={username || ''} disabled style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} />
                    </div>
                    <div className="form-group">
                        <label>About You</label>
                        <textarea placeholder="Describe yourself..." value={about} onChange={(e) => setAbout(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Phone Number (10 digits)</label>
                            <input type="text" placeholder="XXXXXXXXXX" value={contact} onChange={(e) => setContact(e.target.value)} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Email Address</label>
                            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                    </div>
                </div>

                {/* STEP 2: SKILLS */}
                <div className="level-section" style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                    <div className="section-header"><h3>2. Skills</h3></div>
                    <div className="form-group">
                        <label>Skills List (Comma separated)</label>
                        <input type="text" placeholder="React, Node.js, Design, etc." value={skills} onChange={(e) => setSkills(e.target.value)} />
                    </div>
                </div>

                {/* STEP 3: EXPERIENCE */}
                {currentStep === 3 && (
                    <div className="level-section">
                        <div className="section-header"><h3>3. Experience</h3></div>
                        <div className="form-group">
                            <label className="input-label">Experience Level</label>
                            <select value={experienceType} onChange={(e) => setExperienceType(e.target.value)}>
                                <option value="fresher">Fresher (Internships)</option>
                                <option value="experienced">Experienced (Full-time)</option>
                            </select>
                        </div>

                        {experienceType === 'experienced' ? (
                            <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                                <h4 style={{ marginBottom: '15px', color: 'var(--primary)' }}>Add Work Experience</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                    <div>
                                        <label className="input-label">Company Name</label>
                                        <input type="text" placeholder="e.g. Google" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} className="form-group-input" />
                                    </div>
                                    <div>
                                        <label className="input-label">Role / Title</label>
                                        <input type="text" placeholder="e.g. Software Engineer" value={expRole} onChange={(e) => setExpRole(e.target.value)} className="form-group-input" />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label className="input-label">Duration</label>
                                    <input type="text" placeholder="e.g. Jan 2020 - Present" value={expDuration} onChange={(e) => setExpDuration(e.target.value)} className="form-group-input" />
                                </div>
                                <button className="btn-secondary card-button" style={{ width: '100%' }} onClick={addExperience}>+ Add Job Experience</button>

                                <div className="added-items-list" style={{ marginTop: '20px' }}>
                                    {experiences.map((exp, i) => (
                                        <div key={i} className="added-item-card" style={{ background: 'white', padding: '10px', borderRadius: '8px', marginBottom: '10px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-color)' }}>
                                            <strong>{exp.role}</strong> at {exp.company} <span style={{ float: 'right', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{exp.duration}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                                <h4 style={{ marginBottom: '15px', color: 'var(--primary)' }}>Add Internship (Optional)</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                    <div>
                                        <label className="input-label">Company Name</label>
                                        <input type="text" placeholder="e.g. Startup Inc." value={internCompany} onChange={(e) => setInternCompany(e.target.value)} className="form-group-input" />
                                    </div>
                                    <div>
                                        <label className="input-label">Role / Title</label>
                                        <input type="text" placeholder="e.g. Frontend Intern" value={internRole} onChange={(e) => setInternRole(e.target.value)} className="form-group-input" />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label className="input-label">Duration</label>
                                    <input type="text" placeholder="e.g. Summer 2023" value={internDuration} onChange={(e) => setInternDuration(e.target.value)} className="form-group-input" />
                                </div>
                                <button className="btn-secondary card-button" style={{ width: '100%' }} onClick={addInternship}>+ Add Internship</button>

                                <div className="added-items-list" style={{ marginTop: '20px' }}>
                                    {internships.map((int, i) => (
                                        <div key={i} className="added-item-card" style={{ background: 'white', padding: '10px', borderRadius: '8px', marginBottom: '10px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-color)' }}>
                                            <strong>{int.role}</strong> at {int.company} <span style={{ float: 'right', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{int.duration}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 4: PROJECTS */}
                {currentStep === 4 && (
                    <div className="level-section">
                        <div className="section-header"><h3>4. Projects</h3></div>
                        <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label className="input-label">Project Title</label>
                                <input type="text" placeholder="e.g. Portfolio Builder" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="form-group-input" />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label className="input-label">Project Description</label>
                                <textarea placeholder="Describe what you built..." value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} className="form-group-input" style={{ minHeight: '80px' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label className="input-label">Tech Stack</label>
                                <input type="text" placeholder="e.g. React, Node.js, MongoDB" value={projectTech} onChange={(e) => setProjectTech(e.target.value)} className="form-group-input" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label className="input-label">Live Link (Optional)</label>
                                    <input type="text" placeholder="https://..." value={projectLink} onChange={(e) => setProjectLink(e.target.value)} className="form-group-input" />
                                </div>
                                <div>
                                    <label className="input-label">GitHub Repo (Optional)</label>
                                    <input type="text" placeholder="https://github.com/..." value={projectRepo} onChange={(e) => setProjectRepo(e.target.value)} className="form-group-input" />
                                </div>
                            </div>
                            <button className="btn-secondary card-button" style={{ width: '100%' }} onClick={addProject}>+ Add Project</button>

                            <div className="added-items-list" style={{ marginTop: '20px' }}>
                                {projects.map((p, i) => (
                                    <div key={i} className="added-item-card" style={{ background: 'white', padding: '10px', borderRadius: '8px', marginBottom: '10px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-color)' }}>
                                        <strong>{p.title}</strong>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '5px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 5: EDUCATION */}
                {currentStep === 5 && (
                    <div className="level-section">
                        <div className="section-header"><h3>5. Education</h3></div>
                        <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label className="input-label">Institution Name</label>
                                    <input type="text" placeholder="e.g. Harvard University" value={institution} onChange={(e) => setInstitution(e.target.value)} className="form-group-input" />
                                </div>
                                <div>
                                    <label className="input-label">Degree / Certificate</label>
                                    <input type="text" placeholder="e.g. B.Tech Computer Science" value={degree} onChange={(e) => setDegree(e.target.value)} className="form-group-input" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label className="input-label">Year of Completion</label>
                                    <input type="text" placeholder="e.g. 2024" value={year} onChange={(e) => setYear(e.target.value)} className="form-group-input" />
                                </div>
                                <div>
                                    <label className="input-label">Grade / CGPA</label>
                                    <input type="text" placeholder="e.g. 9.0" value={grade} onChange={(e) => setGrade(e.target.value)} className="form-group-input" />
                                </div>
                            </div>
                            <button className="btn-secondary card-button" style={{ width: '100%' }} onClick={addEducation}>+ Add Education</button>

                            <div className="added-items-list" style={{ marginTop: '20px' }}>
                                {education.map((edu, i) => (
                                    <div key={i} className="added-item-card" style={{ background: 'white', padding: '10px', borderRadius: '8px', marginBottom: '10px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-color)' }}>
                                        <strong>{edu.degree}</strong> <span style={{ color: 'var(--text-secondary)' }}>@ {edu.institution}</span>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Year: {edu.year} • Grade: {edu.grade}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 6: SOCIAL Links */}
                {currentStep === 6 && (
                    <div className="level-section">
                        <div className="section-header"><h3>6. Social Links</h3></div>
                        <div className="form-group" style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label>GitHub Profile</label>
                                <input type="text" placeholder="github.com/..." value={githubLink} onChange={(e) => setGithubLink(e.target.value)} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>LinkedIn Profile</label>
                                <input type="text" placeholder="linkedin.com/in/..." value={linkedinLink} onChange={(e) => setLinkedinLink(e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* NAVIGATION BUTTONS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                    <button
                        className="btn-secondary"
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        style={{ opacity: currentStep === 1 ? 0.3 : 1 }}
                    >
                        ⬅️ Previous
                    </button>

                    {currentStep < totalSteps ? (
                        <button className="btn-primary" onClick={handleNext}>
                            Next ➡️
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={handleSubmit} style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)' }}>
                            💾  Save Portfolio
                        </button>
                    )}
                </div>

                {/* SUCCESS MESSAGE */}

                {/* SUCCESS MESSAGE REMOVED - Saving starts the process, Publishing is separate */}

            </div>
        </div>
    );
}

export default PortfolioForm;
