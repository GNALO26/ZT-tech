import { useState, useEffect } from 'react';
import { ThumbsUp, Heart } from 'lucide-react';
import api from '../../services/api';

export default function Reactions({ articleId }) {
  const [counts, setCounts] = useState({ like: 0, interested: 0 });
  const [userLiked, setUserLiked] = useState(false);
  const [userInterested, setUserInterested] = useState(false);

  useEffect(() => {
    api.get(`/articles/${articleId}/counts`).then(res => setCounts(res.data)).catch(console.error);
  }, [articleId]);

  const handleReact = async (type) => {
    try {
      const res = await api.post(`/articles/${articleId}/react`, { type });
      if (res.data.added) {
        setCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
        if (type === 'like') setUserLiked(true);
        if (type === 'interested') setUserInterested(true);
      } else {
        setCounts(prev => ({ ...prev, [type]: prev[type] - 1 }));
        if (type === 'like') setUserLiked(false);
        if (type === 'interested') setUserInterested(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <button
        onClick={() => handleReact('like')}
        className={`flex items-center gap-1 text-sm transition ${userLiked ? 'text-primary' : 'text-gray-500 dark:text-gray-400'} hover:text-primary`}
        aria-label="J'aime"
      >
        <ThumbsUp className="w-4 h-4" /> {counts.like}
      </button>
      <button
        onClick={() => handleReact('interested')}
        className={`flex items-center gap-1 text-sm transition ${userInterested ? 'text-secondary' : 'text-gray-500 dark:text-gray-400'} hover:text-secondary`}
        aria-label="Intéressé"
      >
        <Heart className="w-4 h-4" /> {counts.interested}
      </button>
    </div>
  );
}