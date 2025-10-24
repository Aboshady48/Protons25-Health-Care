import "../Style/AboutUs.css"

export const AboutUs = () => {
    return (
        <div className="about-us-page">
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            About Our Team
                        </h1>
                        <p className="hero-subtitle">
                            We are a passionate team of five students from the Programming track of the Protons program, organized by IEEE. United by our interest in technology and personal well-being, we created this platform to help people live healthier, more balanced, and more productive lives.
                        </p>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">5</span>
                                <span className="stat-label">Team Members</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">100+</span>
                                <span className="stat-label">Hours Invested</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">1</span>
                                <span className="stat-label">Mission</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="floating-shapes">
                            <div className="shape shape-1"></div>
                            <div className="shape shape-2"></div>
                            <div className="shape shape-3"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};