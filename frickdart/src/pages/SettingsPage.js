import React, {useEffect, useState} from "react";
import BackToHomeButton from "../components/common/BackToHome";

const SettingsPage = () => {
    const [isLightMode, setIsLightMode] = useState(false);

    const toggleTheme = () => {
        setIsLightMode((prevMode) => !prevMode);
    };

    // Sobald sich isDarkMode ändert, fügen wir eine Klasse zum <body> hinzu oder entfernen sie.
    useEffect(() => {
        if (isLightMode) {
            document.body.classList.add("light-background");
        } else {
            document.body.classList.remove("light-background");
        }
    }, [isLightMode]);

    // Für Text oder weitere Styles kannst du weiterhin auf isDarkMode reagieren.
    const themeClass = isLightMode ? "light-mode" : "dark-mode";

    return (
        <div className={`${themeClass} container py-5 text-success`}>
            <div className="settings-container text-center row">
                <h1 className="mb-4">Einstellungen</h1>

                <button
                    className="btn btn-primary btn-lg mb-3"
                    onClick={toggleTheme}
                >
                    {isLightMode ? "Dark Mode 🌙" : "Light Mode ☀️"}
                </button>

                <BackToHomeButton className="btn btn-secondary btn-sm"/>
            </div>
        </div>
    );
};

export default SettingsPage;