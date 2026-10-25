import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>
            GitScan reads public GitHub data and sends it to OpenAI to generate your analysis. Results are kept on the server for 24 hours so repeat scans load instantly, and a copy is saved in your browser.
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