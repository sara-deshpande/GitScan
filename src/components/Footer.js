import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>
                GitScan reads public GitHub data and sends it to OpenAI to generate your analysis.
                Nothing is stored on a server. Your results stay in your own browser.
            </p>
            <p>
                Built by Sara Deshpande ·{' '}
                <a href="https://github.com/sara-deshpande/GitScan" target="_blank" rel="noreferrer">
                    View on GitHub
                </a>
            </p>
        </footer>
    );
}

export default Footer;