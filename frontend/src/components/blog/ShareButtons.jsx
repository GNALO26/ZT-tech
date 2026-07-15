import { Facebook, Linkedin, Twitter, Link as LinkIcon } from 'lucide-react';

export default function ShareButtons({ title, url }) {
  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-600',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: 'hover:bg-sky-500',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-700',
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert('Lien copié !');
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500">Partager :</span>
      {shareLinks.map(({ name, icon: Icon, href, color }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 rounded-full bg-gray-100 text-gray-600 transition ${color} hover:text-white`}
          title={name}
          aria-label={`Partager sur ${name}`}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
      <button
        onClick={copyLink}
        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
        title="Copier le lien"
        aria-label="Copier le lien"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}