// src/components/Login.jsx avec Tailwind
import { useState } from 'react';

const Loginadmin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="login-container">
            
            {/* Section gauche - Bleue */}
            <div className="left-section">
                <div className="left-content">
                    <h1 className="facebook-logo">Presse MCNT</h1>
                    <p className="explore-text">
                        Connectez-vous pour accéder au portail administrateur.
                    </p>
                </div>
            </div>

            {/* Section droite - Blanche */}
            <div className="right-section">
                <div className="right-content">
                    <h2>Se connecter à Presse MCNT</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="login-btn">
                            Se connecter
                        </button>
                    </form>

                </div>
            </div>

        </div>
    );
};
export default Loginadmin;