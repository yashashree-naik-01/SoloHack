import { useParams } from 'react-router-dom';
import PublicPortfolioPage from '../components/PublicPortfolioPage';

function PortfolioViewPage() {
    const { username } = useParams();

    return <PublicPortfolioPage username={username} />;
}

export default PortfolioViewPage;
