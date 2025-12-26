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
    const [about, setAbout] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');

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
                        // Pre-fill form
                        setFullName(p.fullName || ''); // Added pre-fill
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
            username, fullName, about, contact, email, dob,
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
                    <span>Portfolio Creation</span>
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
                            <label>Experience Level:</label>
                            <select value={experienceType} onChange={(e) => setExperienceType(e.target.value)}>
                                <option value="fresher">Fresher (Internships)</option>
                                <option value="experienced">Experienced (Full-time)</option>
                            </select>
                        </div>

                        {experienceType === 'experienced' ? (
                            <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                                <h4 style={{ marginBottom: '15px' }}>Add Work Experience</h4>
                                <input type="text" placeholder="Company Name" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} className="form-group-input" style={{ marginBottom: 10 }} />
                                <input type="text" placeholder="Role / Title" value={expRole} onChange={(e) => setExpRole(e.target.value)} className="form-group-input" style={{ marginBottom: 10 }} />
                                <input type="text" placeholder="Duration (e.g. 2020 - 2022)" value={expDuration} onChange={(e) => setExpDuration(e.target.value)} className="form-group-input" style={{ marginBottom: 10 }} />
                                <button className="btn-secondary card-button" onClick={addExperience}>+ Add Job</button>
                                <ul>{experiences.map((exp, i) => <li key={i}>{exp.role} at {exp.company}</li>)}</ul>
                            </div>
                        ) : (
                            <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                                <h4 style={{ marginBottom: '15px' }}>Add Internship (Optional)</h4>
                                <input type="text" placeholder="Company Name" value={internCompany} onChange={(e) => setInternCompany(e.target.value)} className="form-group-input" style={{ marginBottom: 10 }} />
                                <input type="text" placeholder="Role / Title" value={internRole} onChange={(e) => setInternRole(e.target.value)} className="form-group-input" style={{ marginBottom: 10 }} />
                                <input type="text" placeholder="Duration" value={internDuration} onChange={(e) => setInternDuration(e.target.value)} className="form-group-input" style={{ marginBottom: 10 }} />
                                <button className="btn-secondary card-button" onClick={addInternship}>+ Add Internship</button>
                                <ul>{internships.map((int, i) => <li key={i}>{int.role} at {int.company}</li>)}</ul>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 4: PROJECTS */}
                {currentStep === 4 && (
                    <div className="level-section">
                        <div className="section-header"><h3>4. Projects</h3></div>
                        <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                            <input type="text" placeholder="Project Title" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="form-group-input" style={{ marginBottom: 10 }} />
                            <textarea placeholder="Description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} className="form-group-input" style={{ marginBottom: 10 }} />
                            <input type="text" placeholder="Tech Stack (comma separated)" value={projectTech} onChange={(e) => setProjectTech(e.target.value)} className="form-group-input" style={{ marginBottom: 10 }} />
                            <div style={{ display: 'flex', gap: '10px', marginBottom: 10 }}>
                                <input type="text" placeholder="Live Link (URL)" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} style={{ flex: 1 }} />
                                <input type="text" placeholder="GitHub Repo (URL)" value={projectRepo} onChange={(e) => setProjectRepo(e.target.value)} style={{ flex: 1 }} />
                            </div>
                            <button className="btn-secondary card-button" onClick={addProject}>+ Add Project</button>
                        </div>
                        <ul>{projects.map((p, i) => <li key={i}><strong>{p.title}</strong></li>)}</ul>
                    </div>
                )}

                {/* STEP 5: EDUCATION */}
                {currentStep === 5 && (
                    <div className="level-section">
                        <div className="section-header"><h3>5. Education</h3></div>
                        <div className="glass" style={{ padding: '20px', borderRadius: '15px' }}>
                            <input type="text" placeholder="Institution" value={institution} onChange={(e) => setInstitution(e.target.value)} className="form-group-input" style={{ marginBottom: 10 }} />
                            <input type="text" placeholder="Degree" value={degree} onChange={(e) => setDegree(e.target.value)} className="form-group-input" style={{ marginBottom: 10 }} />
                            <div style={{ display: 'flex', gap: '10px', marginBottom: 10 }}>
                                <input type="text" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} style={{ flex: 1 }} />
                                <input type="text" placeholder="Grade/CGPA" value={grade} onChange={(e) => setGrade(e.target.value)} style={{ flex: 1 }} />
                            </div>
                            <button className="btn-secondary card-button" onClick={addEducation}>+ Add Education</button>
                        </div>
                        <ul>{education.map((edu, i) => <li key={i}>{edu.degree} at {edu.institution}</li>)}</ul>
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

                {response && (
                    <div
                        className="status-box status-complete"
                        style={{ marginTop: 20 }}
                    >
                        <h3>🎉 Portfolio Published!</h3>
                        <code style={{ display: 'block', padding: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', margin: '10px 0' }}>{response.url}</code>
                        <button className="btn-secondary" onClick={() => window.open(response.url, '_blank')}>View Live</button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default PortfolioForm;
