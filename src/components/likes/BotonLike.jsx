import { useLikes } from '../../hooks/useLikes';
import '../../styles/likes.css';

function BotonLike({ publicacionId }) {
    const { totalLikes, usuarioDioLike, toggleLike, loading } = useLikes(publicacionId);

    return (
        <button
            className={`btn-like ${usuarioDioLike ? 'liked' : ''}`}
            onClick={toggleLike}
            disabled={loading}
        >
            {usuarioDioLike ? '❤️' : '🤍'} {totalLikes} {totalLikes === 1 ? 'Me gusta' : 'Me gusta'}
        </button>
    );
}

export default BotonLike;